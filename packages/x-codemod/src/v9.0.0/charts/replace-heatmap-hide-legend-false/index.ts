import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import addProp from '../../../util/addProp';

/**
 * Codemod for v9.0.0: Updates <Heatmap /> usages to explicitly set hideLegend={true}
 * if the prop is missing, to preserve v8 behavior after the default changes to false.
 */

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return addProp({
    root,
    j,
    componentNames: ['Heatmap', 'HeatmapPremium'],
    propName: 'hideLegend',
    propValue: true,
  }).toSource(printOptions);
}
