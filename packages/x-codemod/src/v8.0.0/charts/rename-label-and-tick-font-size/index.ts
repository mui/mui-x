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

          ['label', 'tick'].forEach((attributeName) => {
            const attributeValue = elementPath.node.openingElement.attributes?.find(
              (elementNode) =>
                elementNode.type === 'JSXAttribute' &&
                elementNode.name.name === `${attributeName}FontSize`,
            );

            if (!attributeValue) {
              return;
            }

            const attributeStyle = elementPath.node.openingElement.attributes?.find(
              (elementNode) =>
                elementNode.type === 'JSXAttribute' &&
                elementNode.name.name === `${attributeName}Style`,
            );

            // @ts-ignore receives an object.
            const styleValue = attributeStyle?.value.expression.properties.find(
              (prop) => prop.key.name === 'fontSize',
            );

            if (attributeStyle === null) {
              // We create a new "style" object
              elementPath.node.openingElement.attributes?.push(
                j.jsxAttribute(
                  j.jsxIdentifier(`${attributeName}Style`),
                  j.jsxExpressionContainer(
                    j.objectExpression([
                      j.objectProperty(
                        j.identifier('fontSize'),
                        // @ts-ignore receives an object.
                        attributeValue.value.expression,
                      ),
                    ]),
                  ),
                ),
              );
            } else {
              transformNestedProp(
                elementPath,
                `${attributeName}Style`,
                'fontSize',
                // @ts-ignore receives an object.
                styleValue?.value ?? attributeValue.value.expression,
                j,
              );
            }
          });

          // Remove the legend prop
          j(elementPath)
            .find(j.JSXAttribute)
            .filter(
              (a) => a.value.name.name === 'labelFontSize' || a.value.name.name === 'tickFontSize',
            )
            .forEach((pathToRemove) => {
              j(pathToRemove).remove();
            });
        });
      });
    });

  const transformed = root.findJSXElements();

  return transformed.toSource(printOptions);
}
