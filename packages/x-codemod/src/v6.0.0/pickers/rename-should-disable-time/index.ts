/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file, api, options) {
  const j = api.jscodeshift;

  const printOptions = options.printOptions;

  const root = j(file.source);

  root
    .find(j.ImportDeclaration)
    .filter(({ node }) => {
      return node.source.value.startsWith('@mui/x-date-pickers');
    })

    .forEach((path) => {
      path.node.specifiers.forEach((node) => {
        // Process only date-pickers components
        root.findJSXElements(node.local.name).forEach((elementPath) => {
          if (elementPath.node.type !== 'JSXElement') {
            return;
          }

          elementPath.node.openingElement.attributes.forEach((elementNode) => {
            if (elementNode.type !== 'JSXAttribute') {
              return;
            }
            if (elementNode.name.name === 'shouldDisableTime') {
              elementNode.name.name = 'shouldDisableClock';
            }
          });
        });
      });
    });

  const transformed = root.findJSXElements();

  return transformed.toSource(printOptions);
}
