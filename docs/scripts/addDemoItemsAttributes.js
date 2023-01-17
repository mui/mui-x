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
        const isPresent = j(wrapperPath).findJSXElements(componentName).length > 0;
        if (isPresent) {
          children.push(componentName);
        }
      });

      children.sort();
      // Remove perviouse prop
      j(wrapperPath)
        .find(j.JSXAttribute)
        .filter((attribute) => attribute.node.name.name === 'content')
        .remove();

      const newComponent = j.jsxElement(
        j.jsxOpeningElement(wrapperPath.node.openingElement.name, [
          ...wrapperPath.node.openingElement.attributes,
          // build and insert our new prop
          j.jsxAttribute(
            j.jsxIdentifier('content'),
            j.jsxExpressionContainer(j.arrayExpression(children.map(c => j.stringLiteral(c)))),
          ),
        ]),
        wrapperPath.node.closingElement,
        wrapperPath.node.children,
      );

      // Replace our original component with our modified one
      j(wrapperPath).replaceWith(newComponent);
    })
    .toSource(printOptions);
}
