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
        const importedName = specifier.imported.name.toString();
        if (REMOVED_TYPE_NAMES.includes(importedName)) {
          // Track the local name used for this import
          const localName = specifier.local?.name.toString() || importedName;
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

  // Collect all types that need to be added to imports
  const allTypesToAdd = new Set([...typesToImport, ...genericTypesToImport]);
  const typesToAdd = Array.from(allTypesToAdd).filter(
    (typeName) => !isAlreadyImported(typeName, packageRegex),
  );

  // Determine where to add types - use original source or default to same pattern
  // If original was '@mui/x-charts', add to '@mui/x-charts'
  // If original was '@mui/x-charts/models', add to '@mui/x-charts/models'
  const importSource = originalImportSource || '@mui/x-charts/models';

  // Merge duplicate import declarations from the same source before adding new types.
  // Previous codemods may have split imports, leaving multiple declarations from the same source.
  const importsBySource = new Map<string, any[]>();
  root.find(j.ImportDeclaration).forEach((astPath) => {
    const source = astPath.node.source.value?.toString() ?? '';
    if (!packageRegex.test(source)) {
      return;
    }
    if (!importsBySource.has(source)) {
      importsBySource.set(source, []);
    }
    importsBySource.get(source)!.push(astPath);
  });

  importsBySource.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }

    // Collect all specifiers from all declarations, deduplicating by name
    const allSpecifiers: typeof paths[0]['node']['specifiers'] = [];
    const seenNames = new Set<string>();

    paths.forEach((importPath) => {
      (importPath.node.specifiers || []).forEach((specifier) => {
        if (specifier.type === 'ImportSpecifier') {
          const name = specifier.imported.name.toString();
          if (!seenNames.has(name)) {
            seenNames.add(name);
            allSpecifiers.push(specifier);
          }
        } else {
          allSpecifiers.push(specifier);
        }
      });
    });

    // Keep the first declaration with all specifiers, remove the rest
    paths[0].node.specifiers = allSpecifiers;
    for (let i = 1; i < paths.length; i++) {
      j(paths[i]).remove();
    }
  });

  // Add all replacement types to the same import source as the original
  if (typesToAdd.length > 0) {
    const existingImport = root.find(j.ImportDeclaration, {
      source: { value: importSource },
    });

    if (existingImport.size() > 0) {
      // Add to the existing import
      const specifiers = existingImport.at(0).get().node.specifiers || [];
      typesToAdd.forEach((typeName) => {
        specifiers.push(j.importSpecifier(j.identifier(typeName)));
      });
    } else {
      // Create new import
      const newImport = j.importDeclaration(
        typesToAdd.map((typeName) => j.importSpecifier(j.identifier(typeName))),
        j.stringLiteral(importSource),
      );

      const firstImport = root.find(j.ImportDeclaration).at(0);
      if (firstImport.size() > 0) {
        firstImport.insertBefore(newImport);
      } else {
        root.get().node.program.body.unshift(newImport);
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
