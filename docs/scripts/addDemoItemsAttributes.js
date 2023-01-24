const importToIgnore = (name) => {
  if (['LocalizationProvider', 'DemoItem', 'DemoContainer'].includes(name)) {
    return true;
  }
  if (name.startsWith('Adapter')) {
    return true;
  }
  if (name.startsWith('use')) {
    return true;
  }
  return false;
};

export default function transformer(file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const printOptions = options || {
    quote: 'single',
    trailingComma: true,
  };

  const pickersComponentNames = new Set();
  root
    .find(j.ImportDeclaration)
    .filter(({ node }) => {
      return node.source.value.startsWith('@mui/x-date-picker');
    })
    .forEach((path) => {
      path.node.specifiers.forEach((node) => {
        const name = node.local.name;

        if (!importToIgnore(name)) {
          pickersComponentNames.add(name);
        }
      });
    });

  return root
    .find(j.JSXElement)
    .filter((path) => {
      return ['DemoItem', 'DemoContainer'].includes(path.value.openingElement.name.name);
    })
    .forEach((wrapperPath) => {
      const children = [];
      pickersComponentNames.forEach((componentName) => {
        const foundElements = j(wrapperPath).findJSXElements(componentName);
        // we need to repeat same component names if there are with same name 
        foundElements.forEach(() => children.push(componentName))
      });

      // Remove pervious prop
      j(wrapperPath)
        .find(j.JSXAttribute)
        .filter((attribute) => attribute.node.name.name === 'components')
        .remove();

      const newComponent = j.jsxElement(
        j.jsxOpeningElement(wrapperPath.node.openingElement.name, [
          ...wrapperPath.node.openingElement.attributes,
          // build and insert our new prop
          j.jsxAttribute(
            j.jsxIdentifier('components'),
            j.jsxExpressionContainer(j.arrayExpression(children.map(c => j.stringLiteral(c)))),
          ),
        ]),
        wrapperPath.node.closingElement,
        wrapperPath.node.children,
      );

      // Replace the original component with our modified one
      j(wrapperPath).replaceWith(newComponent);
    })
    .toSource(printOptions);
}
