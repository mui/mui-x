import { ASTPath, ImportDeclaration } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const VARIABLES = {
  TreeView: 'SimpleTreeView',
  TreeViewProps: 'SimpleTreeViewProps',
  TreeViewClasses: 'SimpleTreeViewClasses',
  TreeViewClassKey: 'SimpleTreeViewClassKey',
  treeViewClasses: 'simpleTreeViewClasses',
  getTreeViewUtilityClass: 'getSimpleTreeViewUtilityClass',
};

const PACKAGE_REGEXP = /@mui\/x-tree-view(\/(.*)|)/;

const matchImport = (path: ASTPath<ImportDeclaration>) =>
  (path.node.source.value?.toString() ?? '').match(PACKAGE_REGEXP);

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  const matchingImports = root.find(j.ImportDeclaration).filter((path) => !!matchImport(path));

  // Rename the import specifiers
  // - import { TreeView } from '@mui/x-tree-view/TreeView'
  // + import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
  matchingImports
    .find(j.ImportSpecifier)
    .filter((path) => VARIABLES.hasOwnProperty(path.node.imported.name))
    .replaceWith((path) => j.importSpecifier(j.identifier(VARIABLES[path.node.imported.name])));

  // Rename the nested import declarations
  // - import {} from '@mui/x-tree-view/TreeView'
  // + import {} from '@mui/x-tree-view/SimpleTreeView'
  matchingImports
    .filter((path) => matchImport(path)?.[2] === 'TreeView')
    .replaceWith((path) => {
      const importPath = path.node.source.value?.toString() ?? '';

      return j.importDeclaration(
        path.node.specifiers, // copy over the existing import specifiers
        j.stringLiteral(importPath.replace('TreeView', 'SimpleTreeView')), // Replace the source with our new source
      );
    });

  // Rename the import usage
  // - <TreeView />
  // + <SimpleTreeView />
  root
    .find(j.Identifier)
    .filter((path) => VARIABLES.hasOwnProperty(path.node.name))
    .replaceWith((path) => j.identifier(VARIABLES[path.node.name]));

  return root.toSource(printOptions);
}
