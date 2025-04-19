import { JSXAttribute, JSXExpressionContainer, ObjectExpression } from 'jscodeshift';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions;

  const root = j(file.source);

  root
    .find(j.ImportDeclaration)
    .filter(({ node }) => {
      return typeof node.source.value === 'string' && node.source.value.startsWith('@mui/x-charts');
    })
    .forEach((path) => {
      path.node.specifiers?.forEach((node) => {
        root.findJSXElements(node.local?.name).forEach((elementPath) => {
          if (elementPath.node.type !== 'JSXElement') {
            return;
          }

          let chartProps = elementPath.value.openingElement.attributes;

          const slotProps = chartProps?.find(
            (elementNode) =>
              elementNode.type === 'JSXAttribute' && elementNode.name.name === 'slotProps',
          ) as JSXAttribute | null;

          if (slotProps === null) {
            // No slotProps to manage
            return;
          }

          const legendSlotProps = (
            (slotProps?.value as JSXExpressionContainer | null)?.expression as ObjectExpression
          )?.properties?.find(
            (v) =>
              // @ts-expect-error
              v?.key?.name === 'legend',
            // @ts-expect-error
          )?.value;
          const hiddenIndex = legendSlotProps?.properties?.findIndex(
            (v) => v?.key?.name === 'hidden',
          );

          if (hiddenIndex === undefined || hiddenIndex === -1) {
            return;
          }

          const hidden = legendSlotProps?.properties?.[hiddenIndex]?.value;

          if (!hidden) {
            return;
          }

          legendSlotProps.properties.splice(hiddenIndex, 1);

          if (
            slotProps.value?.type === 'JSXExpressionContainer' &&
            legendSlotProps.properties.length === 0
          ) {
            const slotPropsObject = slotProps.value?.expression;

            if (slotPropsObject.type === 'ObjectExpression') {
              slotPropsObject.properties = slotPropsObject.properties.filter(
                (prop) =>
                  prop.type !== 'ObjectProperty' ||
                  prop.key.type !== 'Identifier' ||
                  prop.key.name !== 'legend',
              );
            }
          }

          if (
            slotProps.value?.type === 'JSXExpressionContainer' &&
            slotProps.value.expression.type === 'ObjectExpression' &&
            slotProps.value.expression.properties.length === 0
          ) {
            chartProps = chartProps?.filter(
              (attr) => attr.type !== 'JSXAttribute' || attr.name.name !== 'slotProps',
            );
          }

          chartProps?.push(
            j.jsxAttribute(j.jsxIdentifier('hideLegend'), j.jsxExpressionContainer(hidden)),
          );
          elementPath.value.openingElement.attributes = chartProps;
        });
      });
    });

  const transformed = root.findJSXElements();

  return transformed.toSource(printOptions);
}
