import type {
  ASTPath,
  Collection,
  ImportDeclaration,
  ImportSpecifier,
  JSCodeshift,
} from 'jscodeshift';

interface ImportConfig {
  oldEndpoint?: string;
  newEndpoint?: string;
  skipRoot?: boolean;
  importsMapping: Record<string, string>;
}

interface RenameImportsParameters {
  j: JSCodeshift;
  root: Collection<any>;
  packageNames: string[];
  imports: ImportConfig[];
}

const getPathStrFromPath = (path: ASTPath<ImportDeclaration> | ASTPath<ImportSpecifier>) => {
  let cleanPath: ASTPath<ImportDeclaration>;
  if (path.get('type').value === 'ImportDeclaration') {
    cleanPath = path as ASTPath<ImportDeclaration>;
  } else {
    cleanPath = path.parentPath.parentPath as ASTPath<ImportDeclaration>;
  }

  return cleanPath.node.source.value?.toString() ?? '';
};

const getRelativeEndpointFromPathStr = (pathStr: string, packageNames: string[]) => {
  return pathStr.replace(new RegExp(`^(${packageNames.join('|')})/`), '');
};

const getMatchingNestedImport = (
  path: ASTPath<ImportSpecifier> | ASTPath<ImportDeclaration>,
  parameters: RenameImportsParameters,
) => {
  const pathStr = getPathStrFromPath(path);
  const relativeEndpoint = getRelativeEndpointFromPathStr(pathStr, parameters.packageNames);
  return parameters.imports.find((importConfig) => importConfig.oldEndpoint === relativeEndpoint);
};

const getMatchingRootImport = (
  path: ASTPath<ImportSpecifier>,
  parameters: RenameImportsParameters,
) => {
  return parameters.imports.find((importConfig) => {
    return (
      !importConfig.skipRoot && importConfig.importsMapping.hasOwnProperty(path.node.imported.name)
    );
  });
};

export function renameImports(parameters: RenameImportsParameters) {
  const { j, root } = parameters;

  const renamedIdentifiersMap: Record<string, string> = {};

  const importDeclarations = root
    // Find all the import declarations (import { ... } from '...')
    .find(j.ImportDeclaration);

  // Rename the nested imports specifiers
  // - import { A } from '@mui/x-date-pickers/A'
  // + import { B } from '@mui/x-date-pickers/A'
  const nestedImportRegExp = new RegExp(`^(${parameters.packageNames.join('|')})/(.*)$`);
  importDeclarations
    // Filter out the declarations that are not nested endpoints of the matching packages or that don't have any update to apply
    .filter((path) => {
      const pathStr = getPathStrFromPath(path);
      if (!pathStr.match(nestedImportRegExp)) {
        return false;
      }

      return !!getMatchingNestedImport(path, parameters);
    })
    // Find all the import specifiers (extract A in import { A } from '...')
    .find(j.ImportSpecifier)
    // Filter out the specifiers that don't need to be updated
    .filter((path) => {
      return getMatchingNestedImport(path, parameters)!.importsMapping.hasOwnProperty(
        path.node.imported.name,
      );
    })
    // Rename the import specifiers
    .replaceWith((path) => {
      const newName = getMatchingNestedImport(path, parameters)!.importsMapping[
        path.node.imported.name
      ];

      // If the import is alias, we keep the alias and don't rename the variable usage
      const hasAlias = path.node.local?.name !== path.node.imported.name;
      if (hasAlias) {
        return j.importSpecifier(j.identifier(newName), j.identifier(path.node.local!.name));
      }

      renamedIdentifiersMap[path.node.imported.name] = newName;
      return j.importSpecifier(j.identifier(newName));
    });

  // Rename the root imports specifiers
  // - import { A } from '@mui/x-date-pickers'
  // + import { B } from '@mui/x-date-pickers'
  const rootImportRegExp = new RegExp(`^(${parameters.packageNames.join('|')})$`);
  importDeclarations
    // Filter out the declarations that are not root endpoint of the matching packages
    .filter((path) => {
      const pathStr = getPathStrFromPath(path);
      return !!pathStr.match(rootImportRegExp);
    })
    .find(j.ImportSpecifier)
    .filter((path) => {
      return !!getMatchingRootImport(path, parameters);
    })
    // Rename the import specifiers
    .replaceWith((path) => {
      const newName = getMatchingRootImport(path, parameters)!.importsMapping[
        path.node.imported.name
      ];

      // If the import is alias, we keep the alias and don't rename the variable usage
      const hasAlias = path.node.local?.name !== path.node.imported.name;
      if (hasAlias) {
        return j.importSpecifier(j.identifier(newName), j.identifier(path.node.local!.name));
      }

      renamedIdentifiersMap[path.node.imported.name] = newName;
      return j.importSpecifier(j.identifier(newName));
    });

  // Rename the nested import declarations
  // - import { B } from '@mui/x-date-pickers/A'
  // + import { B } from '@mui/x-date-pickers/B'
  importDeclarations
    // Filter out the declarations that are not nested endpoints of the matching packages or that don't have any update to apply
    .filter((path) => {
      const pathStr = getPathStrFromPath(path);
      if (!pathStr.match(nestedImportRegExp)) {
        return false;
      }

      return !!getMatchingNestedImport(path, parameters)?.newEndpoint;
    })
    .replaceWith((path) => {
      const pathStr = getPathStrFromPath(path);
      const oldEndpoint = getRelativeEndpointFromPathStr(pathStr, parameters.packageNames);
      const newEndpoint = getMatchingNestedImport(path, parameters)!.newEndpoint;
      const newPathStr = pathStr.replace(oldEndpoint, newEndpoint!);

      return j.importDeclaration(
        // Copy over the existing import specifiers
        path.node.specifiers,
        // Replace the source with our new source
        j.stringLiteral(newPathStr),
      );
    });

  // Rename the import usage
  // - <A />
  // + <B />
  root
    .find(j.Identifier)
    .filter((path) => {
      return renamedIdentifiersMap.hasOwnProperty(path.node.name);
    })
    .replaceWith((path) => {
      const newName = renamedIdentifiersMap[path.node.name];
      return j.identifier(newName);
    });

  return root;
}
