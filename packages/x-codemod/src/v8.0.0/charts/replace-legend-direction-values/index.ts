import { JSXAttribute, JSXExpressionContainer, ObjectExpression } from 'jscodeshift';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import { transformNestedProp } from '../../../util/addComponentsSlots';
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

          const direction = (
            (slotProps?.value as JSXExpressionContainer | null)?.expression as ObjectExpression
          )?.properties
            // @ts-expect-error
            ?.find((v) => v?.key?.name === 'legend')
            // @ts-expect-error
            ?.value?.properties?.find((v) => v?.key?.name === 'direction');

          if (
            direction === undefined ||
            direction?.value === undefined ||
            direction?.value?.value === undefined
          ) {
            return;
          }
          const directionValue = direction.value;

          directionValue.value = mapFix(directionValue.value);

          transformNestedProp(elementPath, 'slotProps', 'legend.direction', directionValue, j);
        });
      });
    });

  const transformed = root.findJSXElements();

  return transformed.toSource(printOptions);
}

function mapFix(v?: string) {
  switch (v) {
    case 'row':
      return 'horizontal';
    case 'column':
      return 'vertical';
    default:
      return v;
  }
}
