import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';
import renameProps from '../../../util/renameProps';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameProps({
    j,
    root,
    componentNames: [
      'PieArc',
      'PieArcPlot',
      'PieArcLabel',
      'PieArcLabelPlot',
      'BarElement',
      'AnimatedRangeBarElement',
      'AnimatedArea',
      'AnimatedLine',
      'MarkElement',
      'AreaElement',
      'LineElement',
      'LineHighlightElement',
    ],
    props: {
      id: 'seriesId',
    },
  });

  return root.toSource(printOptions);
}

export const testConfig = {
  name: 'rename-id-to-series-id',
  specFiles: [
    {
      name: 'rename id to seriesId',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
};
