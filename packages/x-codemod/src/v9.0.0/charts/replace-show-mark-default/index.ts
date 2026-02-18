import path from 'path';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

const COMPONENT_NAMES = ['LineChart', 'LineChartPro', 'LineChartPremium'];
const PROVIDER_NAMES = [
  'ChartDataProvider',
  'ChartDataProviderPro',
  'ChartDataProviderPremium',
  // With the new naming to be sure codemod order does not matter
  'ChartsDataProvider',
  'ChartsDataProviderPro',
  'ChartsDataProviderPremium'
];

/**
 * Codemod for v9.0.0: Updates line series objects to preserve v8 behavior after the `showMark` default changes from true to false.
 *
 * If `showMark` is not defined, adds `showMark: true` to preserve v8 behavior.
 * 
 * The `showmMark: false` cases are left unchanged to stay idempotent.
 * 
 * Ths codemod applies on LineChart components and providers when series type is set to 'line'.
 */
export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  root
    .find(j.JSXElement)
    .filter((p) => COMPONENT_NAMES.includes((p.value.openingElement.name as any).name))
    .forEach((p) => {
      const seriesAttr = p.value.openingElement.attributes?.find(
        (attr) => attr.type === 'JSXAttribute' && (attr.name as any).name === 'series',
      );

      if (!seriesAttr || seriesAttr.type !== 'JSXAttribute') {
        return;
      }

      const seriesValue = seriesAttr.value;
      if (!seriesValue || seriesValue.type !== 'JSXExpressionContainer') {
        return;
      }

      const expr = seriesValue.expression;
      if (expr.type !== 'ArrayExpression') {
        return;
      }

      expr.elements.forEach((element) => {
        if (!element || element.type !== 'ObjectExpression') {
          return;
        }

        const hasShowMark = element.properties.some(
          (prop) =>
            prop.type === 'ObjectProperty' &&
            prop.key.type === 'Identifier' &&
            prop.key.name === 'showMark',
        );

        if (!hasShowMark) {
          element.properties.push(j.objectProperty(j.identifier('showMark'), j.booleanLiteral(true)));
        }
      });
    });

  root
    .find(j.JSXElement)
    .filter((p) => PROVIDER_NAMES.includes((p.value.openingElement.name as any).name))
    .forEach((p) => {
      const seriesAttr = p.value.openingElement.attributes?.find(
        (attr) => attr.type === 'JSXAttribute' && (attr.name as any).name === 'series',
      );

      if (!seriesAttr || seriesAttr.type !== 'JSXAttribute') {
        return;
      }

      const seriesValue = seriesAttr.value;
      if (!seriesValue || seriesValue.type !== 'JSXExpressionContainer') {
        return;
      }

      const expr = seriesValue.expression;
      if (expr.type !== 'ArrayExpression') {
        return;
      }

      expr.elements.forEach((element) => {
        if (!element || element.type !== 'ObjectExpression') {
          return;
        }

        const lineSeriesType = element.properties.some(
          (prop) =>
            prop.type === 'ObjectProperty' &&
            prop.key.type === 'Identifier' &&
            prop.key.name === 'type' &&
            prop.value.type === 'StringLiteral' &&
            prop.value.value === 'line',
        );

        const hasShowMark = element.properties.some(
          (prop) =>
            prop.type === 'ObjectProperty' &&
            prop.key.type === 'Identifier' &&
            prop.key.name === 'showMark',
        );

        if (lineSeriesType && !hasShowMark) {
          element.properties.push(j.objectProperty(j.identifier('showMark'), j.booleanLiteral(true)));
        }
      });
    });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'replace-show-mark-default',
  specFiles: [
    {
      name: 'imports',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
