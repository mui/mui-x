import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import addProp from '../../../util/addProp';
import readFile from '../../../util/readFile';

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
    position: 'start',
  }).toSource(printOptions);
}

export const testConfig = {
  name: 'replace-heatmap-hide-legend-false',
  specFiles: [
    {
      name: 'imports',
      actual: readFile(path.join(__dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(__dirname, 'expected.spec.tsx')),
    },
  ],
};
