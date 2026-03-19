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
      'ScatterChart',
      'ScatterChartPro',
      'SparkLineChart',
      'ChartsContainer',
      'ChartContainer',
      'ChartDataProvider',
      'ChartsDataProvider',
      'ChartDataProviderPro',
      'ChartsDataProviderPro',
      'ChartDataProviderPremium',
      'ChartsDataProviderPremium',
    ],
    props: {
      voronoiMaxRadius: 'hitAreaRadius',
      disableVoronoi: 'disableHitArea',
    },
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-voronoi-max-radius',
  specFiles: [
    {
      name: 'rename voronoiMaxRadius to hitAreaRadius and disableVoronoi to disableHitArea',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
});
