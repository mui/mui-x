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
    packageNames: ['@mui/x-data-grid', '@mui/x-data-grid-pro', '@mui/x-data-grid-premium'],
    imports: [
      {
        oldEndpoint: 'DataGrid',
        importsMapping: {
          selectedGridRowsSelector: 'gridRowSelectionIdsSelector',
          selectedGridRowsCountSelector: 'gridRowSelectionCountSelector',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}
