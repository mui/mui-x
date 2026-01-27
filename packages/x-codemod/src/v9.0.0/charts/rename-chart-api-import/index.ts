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
    packageNames: ['@mui/x-charts', '@mui/x-charts-pro', '@mui/x-charts-premium'],
    imports: [
      {
        oldEndpoint: 'ChartContainer',
        newEndpoint: 'context',
        importsMapping: {
          ChartApi: 'ChartApi',
        },
        splitUnmatchedSpecifiers: true,
      },
    ],
  });

  return root.toSource(printOptions);
}

export const testConfig = {
  name: 'rename-chart-api-import',
  specFiles: [
    {
      name: 'imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
};
