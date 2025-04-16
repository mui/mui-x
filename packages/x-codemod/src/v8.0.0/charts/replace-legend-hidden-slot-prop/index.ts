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

          const slotProps = elementPath.node.openingElement.attributes?.find(
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

          const chartProps = elementPath.value.openingElement.attributes;

          chartProps?.push(
            j.jsxAttribute(j.jsxIdentifier('hideLegend'), j.jsxExpressionContainer(hidden)),
          );
        });
      });
    });

  const transformed = root.findJSXElements();

  return transformed.toSource(printOptions);
}
