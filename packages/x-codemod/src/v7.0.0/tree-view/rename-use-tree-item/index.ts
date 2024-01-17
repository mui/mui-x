import { ASTPath, ImportDeclaration } from 'jscodeshift';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const PACKAGE_REGEXP = /@mui\/x-tree-view(\/TreeItem|)/;

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
  // - import { useTreeItem } from '@mui/x-tree-view/TreeItem'
  // + import { useTreeItemState } from '@mui/x-tree-view/TreeItem'
  matchingImports
    .find(j.ImportSpecifier)
    .filter((path) => path.node.imported.name === 'useTreeItem')
    .replaceWith(j.importSpecifier(j.identifier('useTreeItemState')));

  // Rename the import usage
  // - useTreeItem(nodeId);
  // + useTreeItemState(nodeId)
  root
    .find(j.Identifier)
    .filter((path) => path.node.name === 'useTreeItem')
    .replaceWith(j.identifier('useTreeItemState'));

  return root.toSource(printOptions);
}
