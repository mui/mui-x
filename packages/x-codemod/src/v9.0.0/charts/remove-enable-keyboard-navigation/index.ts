import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import removeProps from '../../../util/removeProps';
import readFile from '../../../util/readFile';

const componentNames = [
  'BarChart',
  'LineChart',
  'PieChart',
  'ScatterChart',
  'SparkLineChart',
  'RadarChart',
  'ChartsContainer',
  'BarChartPro',
  'LineChartPro',
  'PieChartPro',
  'ScatterChartPro',
  'RadarChartPro',
  'FunnelChart',
  'Heatmap',
  'SankeyChart',
  'BarChartPremium',
  'HeatmapPremium',
  'ChartDataProvider',
  'ChartDataProviderPro',
];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  removeProps({
    root,
    componentNames,
    props: ['enableKeyboardNavigation'],
    shouldRemove: (attribute) => {
      // Only remove the prop if it's not explicitly set to false or a variable that could be false.
      if (attribute.value === null) {
        return true;
      }

      if (attribute.value?.type === 'JSXExpressionContainer') {
        if (attribute.value.expression.type === 'BooleanLiteral') {
          return attribute.value.expression.value !== false;
        }
        // If it's an expression, we can't be sure of its value, so we keep it.
      }
      return false;
    },
    j,
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'remove-enable-keyboard-navigation',
  specFiles: [
    {
      name: 'remove enableKeyboardNavigation prop',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
