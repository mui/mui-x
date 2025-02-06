import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions;

  const root = j(file.source);
  const componentNames = ['SparkLineChart'];
  const props = { colors: 'color' };

  const colorAttributes = root
    .find(j.JSXElement)
    .filter((path) => {
      return componentNames.includes((path.value.openingElement.name as any).name);
    })
    .find(j.JSXAttribute)
    .filter((attribute) => Object.keys(props).includes(attribute.node.name.name as string));

  return colorAttributes
    .forEach((attribute) => {
      if (attribute.node.value?.type !== 'JSXExpressionContainer') {
        return;
      }

      const colorsAttributeExpression = attribute.node.value.expression;

      let colorAttributeExpression;

      if (colorsAttributeExpression.type === 'ArrayExpression') {
        colorAttributeExpression = j.chainExpression(
          j.optionalMemberExpression(colorsAttributeExpression, j.literal(0)),
        );
      } else if (colorsAttributeExpression.type === 'Identifier') {
        colorAttributeExpression = j.conditionalExpression(
          j.binaryExpression(
            '===',
            j.unaryExpression('typeof', colorsAttributeExpression),
            j.literal('function'),
          ),
          j.arrowFunctionExpression(
            [j.identifier('mode')],
            j.chainExpression(
              j.optionalMemberExpression(
                j.callExpression(colorsAttributeExpression, [j.identifier('mode')]),
                j.literal(0),
              ),
            ),
          ),
          colorsAttributeExpression,
        );
      } else if (colorsAttributeExpression.type === 'ArrowFunctionExpression') {
        colorAttributeExpression = j.arrowFunctionExpression(
          [j.identifier('mode')],
          j.chainExpression(
            j.optionalMemberExpression(
              j.callExpression(colorsAttributeExpression, [j.identifier('mode')]),
              j.literal(0),
            ),
          ),
        );
      } else {
        // Don't know how to handle this case
      }

      // Only apply transformation if we know how to handle it
      if (colorAttributeExpression) {
        j(attribute).replaceWith(
          j.jsxAttribute(
            j.jsxIdentifier(props[attribute.node.name.name as string]),
            j.jsxExpressionContainer(colorAttributeExpression),
          ),
        );
      }
    })
    .toSource(printOptions);
}
