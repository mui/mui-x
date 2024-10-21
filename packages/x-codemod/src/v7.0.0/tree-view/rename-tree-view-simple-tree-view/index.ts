import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { renameImports } from '../../../util/renameImports';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameImports({
    j,
    root,
    packageNames: ['@mui/x-tree-view'],
    imports: [
      {
        oldEndpoint: 'TreeView',
        newEndpoint: 'SimpleTreeView',
        importsMapping: {
          TreeView: 'SimpleTreeView',
          TreeViewProps: 'SimpleTreeViewProps',
          TreeViewClasses: 'SimpleTreeViewClasses',
          TreeViewClassKey: 'SimpleTreeViewClassKey',
          treeViewClasses: 'simpleTreeViewClasses',
          getTreeViewUtilityClass: 'getSimpleTreeViewUtilityClass',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}
