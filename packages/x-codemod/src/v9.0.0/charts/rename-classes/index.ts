import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';
import { renameClasses } from '../../../util/renameClasses';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  renameClasses({
    j,
    root,
    packageNames: ['@mui/x-charts', '@mui/x-charts-pro', '@mui/x-charts-premium'],
    classes: {
      barElementClasses: {
        newClassName: 'barClasses',
        properties: { root: 'element' },
      },
      barClasses: {
        newClassName: 'barClasses',
        properties: {
          root: 'label',
          animate: 'labelAnimate',
        },
      },
      radarSeriesPlotClasses: {
        newClassName: 'radarClasses',
        properties: {
          root: 'seriesRoot',
          area: 'seriesArea',
          mark: 'seriesMark'
        },
      },
      },
      sankeyPlotClasses: {
        newClassName: 'sankeyClasses',
        properties: {},
      },
    },
  });

  // Classes that had same name as cartesian classes but only for radar charts.
  renameClasses({
    j,
    root,
    packageNames: ['@mui/x-charts/RadarChart', '@mui/x-charts-pro/RadarChart', '@mui/x-charts-premium/RadarChart'],
    classes: {
      chartsAxisHighlightClasses: {
        newClassName: 'radarClasses',
        properties: {
          root: 'axisHighlightRoot',
          line: 'axisHighlightLine',
          dot: 'axisHighlightDot'
        },
      },
      chartsAxisClasses: {
        newClassName: 'radarClasses',
        properties: {
          root: 'axisRoot',
          line: 'axisLine',
          label: 'axisLabel'
        },
      },
      chartsGridClasses: {
        newClassName: 'radarClasses',
        properties: {
          radial: 'gridRadial',
          divider: 'gridDivider',
          stripe: 'gridStripe'
        },
      }
    },
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-classes',
  specFiles: [
    {
      name: 'rename barElementClasses to barClasses',
      actual: readFile(path.join(import.meta.dirname, 'actual-imports.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected-imports.spec.tsx')),
    },
  ],
});
