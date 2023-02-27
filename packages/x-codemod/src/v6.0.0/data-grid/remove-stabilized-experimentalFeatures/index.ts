import removeObjectProperty from '../../../util/removeObjectProperty';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

const componentsNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
const propName = 'experimentalFeatures';
const propKeys = ['newEditingApi', 'rowPinning', 'aggregation'];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  propKeys.forEach((propKey) => {
    removeObjectProperty({ root, j, propName, componentsNames, propKey });
  });

  return root.toSource(printOptions);
}
