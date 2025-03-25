import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameProps from '../../../util/renameProps';

const componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
const props = {
  unstable_rowSpanning: 'rowSpanning',
  unstable_dataSource: 'dataSource',
  unstable_dataSourceCache: 'dataSourceCache',
  unstable_lazyLoading: 'lazyLoading',
  unstable_lazyLoadingRequestThrottleMs: 'lazyLoadingRequestThrottleMs',
  unstable_onDataSourceError: 'onDataSourceError',
};

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return renameProps({ root, j, props, componentNames }).toSource(printOptions);
}
