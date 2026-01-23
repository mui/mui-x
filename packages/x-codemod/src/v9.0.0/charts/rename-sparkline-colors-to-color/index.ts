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
      const colorsAttributeExpression =
        attribute.node.value?.type === 'JSXExpressionContainer'
          ? attribute.node.value.expression
          : null;

      let colorAttributeExpression;

      if (colorsAttributeExpression?.type === 'ArrayExpression') {
        colorAttributeExpression = colorsAttributeExpression.elements[0];
      } else if (colorsAttributeExpression?.type === 'Identifier') {
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
      } else {
        // Don't know how to handle this case
      }

      // Only transform the value if we know how to handle it, otherwise rename the prop and add a comment
      if (colorAttributeExpression) {
        j(attribute).replaceWith(
          j.jsxAttribute(
            j.jsxIdentifier(props[attribute.node.name.name as string]),
            j.jsxExpressionContainer(colorAttributeExpression),
          ),
        );
      } else {
        j(attribute)
          .replaceWith(
            j.jsxAttribute(
              j.jsxIdentifier(props[attribute.node.name.name as string]),
              attribute.node.value,
            ),
          )
          .insertBefore(
            j.commentBlock(
              " mui-x-codemod: We renamed the `colors` prop to `color`, but didn't change the value. Please ensure sure this prop receives a string or a function that returns a string. ",
            ),
          );
      }
    })
    .toSource(printOptions);
}
