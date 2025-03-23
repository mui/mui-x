import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { renameImports } from '../../../util/renameImports';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
    wrapColumn: 40,
  };

  renameImports({
    j,
    root,
    packageNames: ['@mui/x-charts', '@mui/x-charts-pro'],
    imports: [
      {
        oldEndpoint: 'hooks',
        importsMapping: {
          unstable_useSeries: 'useSeries',
          unstable_usePieSeries: 'usePieSeries',
          unstable_useLineSeries: 'useLineSeries',
          unstable_useBarSeries: 'useBarSeries',
          unstable_useScatterSeries: 'useScatterSeries',
          unstable_useHeatmapSeries: 'useHeatmapSeries',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}
