import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';
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
    packageNames: ['@mui/x-charts-pro'],
    imports: [
      {
        oldEndpoint: 'SankeyChart',
        importsMapping: {
          Unstable_SankeyChart: 'SankeyChart',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-sankey-chart',
  specFiles: [
    {
      name: 'imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
});
