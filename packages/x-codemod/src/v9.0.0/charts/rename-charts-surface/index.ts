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
        oldEndpoint: 'ChartsSurface',
        newEndpoint: 'ChartsSvgSurface',
        importsMapping: {
          ChartsSurface: 'ChartsSvgSurface',
          ChartsSurfaceProps: 'ChartsSvgSurfaceProps',
          ChartsSurfaceClasses: 'ChartsSvgSurfaceClasses',
          chartsSurfaceClasses: 'chartsSvgSurfaceClasses',
        },
      },
      {
        importsMapping: {
          ChartsSurface: 'ChartsSvgSurface',
          ChartsSurfaceProps: 'ChartsSvgSurfaceProps',
          ChartsSurfaceClasses: 'ChartsSvgSurfaceClasses',
          chartsSurfaceClasses: 'chartsSvgSurfaceClasses',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}

export const testConfig = {
  name: 'rename-charts-surface',
  specFiles: [
    {
      name: 'imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
};
