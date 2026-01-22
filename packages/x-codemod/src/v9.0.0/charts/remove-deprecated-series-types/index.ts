import path from 'node:path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

// Maps from removed type to the replacement info
const REMOVED_TYPES: Record<string, { baseType: string; genericType: string }> = {
  CartesianSeriesType: {
    baseType: 'AllSeriesType',
    genericType: 'CartesianChartSeriesType',
  },
  DefaultizedCartesianSeriesType: {
    baseType: 'DefaultizedSeriesType',
    genericType: 'CartesianChartSeriesType',
  },
  StackableSeriesType: {
    baseType: 'DefaultizedSeriesType',
    genericType: 'StackableChartSeriesType',
  },
};

const REMOVED_TYPE_NAMES = Object.keys(REMOVED_TYPES);

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
    wrapColumn: 40,
  };

  // Track local names for removed types and the source they came from
  const removedTypeLocalNames: Record<string, string> = {};
  let originalImportSource: string | null = null;

  // Find and remove imports of deprecated types
  const packageRegex = /^@mui\/x-charts(-pro|-premium)?(\/(models|internals))?$/;

  root.find(j.ImportDeclaration).forEach((astPath) => {
    const source = astPath.node.source.value?.toString() ?? '';
    if (!packageRegex.test(source)) {
      return;
    }

    const specifiers = astPath.node.specifiers || [];
    const remainingSpecifiers: typeof specifiers = [];

    specifiers.forEach((specifier) => {
      if (specifier.type === 'ImportSpecifier') {
        const importedName = specifier.imported.name;
        if (REMOVED_TYPE_NAMES.includes(importedName)) {
          // Track the local name used for this import
          const localName = specifier.local?.name || importedName;
          removedTypeLocalNames[localName] = importedName;
          // Track the original import source (use the first one found)
          if (!originalImportSource) {
            originalImportSource = source;
          }
        } else {
          remainingSpecifiers.push(specifier);
        }
      } else {
        remainingSpecifiers.push(specifier);
      }
    });

    if (remainingSpecifiers.length === 0) {
      // Remove the entire import declaration if no specifiers remain
      j(astPath).remove();
    } else if (remainingSpecifiers.length !== specifiers.length) {
      // Update the import declaration with remaining specifiers
      astPath.node.specifiers = remainingSpecifiers;
    }
  });

  // Replace type references with the new types
  // We need to add the necessary imports if they're not already present
  const typesToImport = new Set<string>();
  const genericTypesToImport = new Set<string>();

  Object.entries(removedTypeLocalNames).forEach(([localName, originalName]) => {
    const replacementInfo = REMOVED_TYPES[originalName];
    if (!replacementInfo) {
      return;
    }

    // Find all usages of the type as a type reference
    root.find(j.TSTypeReference).forEach((astPath) => {
      if (astPath.node.typeName.type === 'Identifier' && astPath.node.typeName.name === localName) {
        typesToImport.add(replacementInfo.baseType);
        genericTypesToImport.add(replacementInfo.genericType);

        // Replace with the generic type: e.g., AllSeriesType<CartesianChartSeriesType>
        const newTypeReference = j.tsTypeReference(
          j.identifier(replacementInfo.baseType),
          j.tsTypeParameterInstantiation([
            j.tsTypeReference(j.identifier(replacementInfo.genericType)),
          ]),
        );

        j(astPath).replaceWith(newTypeReference);
      }
    });
  });

  // Helper to check if a type is already imported from a given package pattern
  const isAlreadyImported = (typeName: string, sourcePattern: RegExp) => {
    return (
      root
        .find(j.ImportSpecifier, {
          imported: { name: typeName },
        })
        .filter((specPath) => {
          const importDecl = specPath.parentPath.parentPath;
          const source = importDecl.node.source.value?.toString() ?? '';
          return sourcePattern.test(source);
        })
        .size() > 0
    );
  };

  // Collect types that need to be added to imports
  const typesToAdd = Array.from(typesToImport).filter(
    (typeName) => !isAlreadyImported(typeName, packageRegex),
  );
  const genericTypesToAdd = Array.from(genericTypesToImport).filter(
    (typeName) => !isAlreadyImported(typeName, /internals/),
  );

  // Determine where to add base types - use original source or default to same pattern
  // If original was '@mui/x-charts', add to '@mui/x-charts'
  // If original was '@mui/x-charts/models', add to '@mui/x-charts/models'
  const baseTypeImportSource = originalImportSource || '@mui/x-charts/models';

  // Add base types to the appropriate import
  if (typesToAdd.length > 0) {
    const existingImport = root.find(j.ImportDeclaration, {
      source: { value: baseTypeImportSource },
    });

    if (existingImport.size() > 0) {
      // Add to existing import
      existingImport.forEach((astPath) => {
        const specifiers = astPath.node.specifiers || [];
        typesToAdd.forEach((typeName) => {
          specifiers.push(j.importSpecifier(j.identifier(typeName)));
        });
      });
    } else {
      // Create new import
      const newImport = j.importDeclaration(
        typesToAdd.map((typeName) => j.importSpecifier(j.identifier(typeName))),
        j.stringLiteral(baseTypeImportSource),
      );

      const firstImport = root.find(j.ImportDeclaration).at(0);
      if (firstImport.size() > 0) {
        firstImport.insertBefore(newImport);
      } else {
        root.get().node.program.body.unshift(newImport);
      }
    }
  }

  // Add generic types to @mui/x-charts/internals
  if (genericTypesToAdd.length > 0) {
    const internalsImport = root.find(j.ImportDeclaration, {
      source: { value: '@mui/x-charts/internals' },
    });

    if (internalsImport.size() > 0) {
      // Add to existing import
      internalsImport.forEach((astPath) => {
        const specifiers = astPath.node.specifiers || [];
        genericTypesToAdd.forEach((typeName) => {
          specifiers.push(j.importSpecifier(j.identifier(typeName)));
        });
      });
    } else {
      // Create new import after the last @mui/x-charts import
      const newImport = j.importDeclaration(
        genericTypesToAdd.map((typeName) => j.importSpecifier(j.identifier(typeName))),
        j.stringLiteral('@mui/x-charts/internals'),
      );

      const chartImports = root.find(j.ImportDeclaration).filter((astPath) => {
        const source = astPath.node.source.value?.toString() ?? '';
        return source.startsWith('@mui/x-charts');
      });

      if (chartImports.size() > 0) {
        chartImports.at(-1).insertAfter(newImport);
      } else {
        const firstImport = root.find(j.ImportDeclaration).at(0);
        if (firstImport.size() > 0) {
          firstImport.insertBefore(newImport);
        } else {
          root.get().node.program.body.unshift(newImport);
        }
      }
    }
  }

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'remove-deprecated-series-types',
  specFiles: [
    {
      name: 'root-imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-root-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-root-imports.spec.tsx')),
    },
    {
      name: 'nested-imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-nested-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-nested-imports.spec.tsx')),
    },
  ],
});
