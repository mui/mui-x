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

          const legendProps = elementPath.node.openingElement.attributes?.find(
            (elementNode) =>
              elementNode.type === 'JSXAttribute' && elementNode.name.name === 'legend',
          );

          if (!legendProps) {
            // No legend props to manage
            return;
          }

          const slotProps = elementPath.node.openingElement.attributes?.find(
            (elementNode) =>
              elementNode.type === 'JSXAttribute' && elementNode.name.name === 'slotProps',
          );

          if (slotProps === null) {
            // We create a new slotProps object
            elementPath.node.openingElement.attributes?.push(
              j.jsxAttribute(
                j.jsxIdentifier('slotProps'),
                j.jsxExpressionContainer(
                  j.objectExpression([
                    // @ts-ignore legend receives an object.
                    j.objectProperty(j.identifier('legend'), legendProps.value.expression),
                  ]),
                ),
              ),
            );
          } else {
            transformNestedProp(
              elementPath,
              'slotProps',
              'legend',
              // @ts-ignore legend receives an object.
              legendProps.value.expression,
              j,
            );
          }

          // Remove the legend prop
          j(elementPath)
            .find(j.JSXAttribute)
            .filter((a) => a.value.name.name === 'legend')
            .forEach((pathToRemove) => {
              j(pathToRemove).remove();
            });
        });
      });
    });

  const transformed = root.findJSXElements();

  return transformed.toSource(printOptions);
}
