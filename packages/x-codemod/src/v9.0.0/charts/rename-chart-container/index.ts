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
      // ChartContainer → ChartsContainer
      {
        oldEndpoint: 'ChartContainer',
        newEndpoint: 'ChartsContainer',
        importsMapping: {
          ChartContainer: 'ChartsContainer',
          ChartContainerProps: 'ChartsContainerProps',
          ChartContainerSlots: 'ChartsContainerSlots',
          ChartContainerSlotProps: 'ChartsContainerSlotProps',
        },
      },
      // ChartContainerPro → ChartsContainerPro
      {
        oldEndpoint: 'ChartContainerPro',
        newEndpoint: 'ChartsContainerPro',
        importsMapping: {
          ChartContainerPro: 'ChartsContainerPro',
          ChartContainerProProps: 'ChartsContainerProProps',
          ChartContainerProSlots: 'ChartsContainerProSlots',
          ChartContainerProSlotProps: 'ChartsContainerProSlotProps',
        },
      },
      // ChartContainerPremium → ChartsContainerPremium
      {
        oldEndpoint: 'ChartContainerPremium',
        newEndpoint: 'ChartsContainerPremium',
        importsMapping: {
          ChartContainerPremium: 'ChartsContainerPremium',
          ChartContainerPremiumProps: 'ChartsContainerPremiumProps',
          ChartContainerPremiumSlots: 'ChartsContainerPremiumSlots',
          ChartContainerPremiumSlotProps: 'ChartsContainerPremiumSlotProps',
        },
      },
      // Hooks from internals
      {
        oldEndpoint: 'internals',
        importsMapping: {
          useChartContainerProps: 'useChartsContainerProps',
          UseChartContainerPropsReturnValue: 'UseChartsContainerPropsReturnValue',
          useChartContainerProProps: 'useChartsContainerProProps',
          UseChartContainerProPropsReturnValue: 'UseChartsContainerProPropsReturnValue',
        },
      },
    ],
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-chart-container',
  specFiles: [
    {
      name: 'imports',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
});
