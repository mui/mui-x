export default function transformer(file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const printOptions = options || {
    quote: 'single',
    trailingComma: true,
  };

  return root
    .find(j.JSXElement)
    .filter((path) => {
      return path.value.openingElement.name.name === 'DemoItem';
    })
    .forEach((path) => {
      const firstChildElement = path.value.children?.find((child) => child.type === 'JSXElement');
      if (!firstChildElement) {
        return;
      }

      const childName = firstChildElement.openingElement.name.name;

      // Remove perviouse prop
      j(path)
        .find(j.JSXAttribute)
        .filter((attribute) => attribute.node.name.name === 'content')
        .remove();

      const newComponent = j.jsxElement(
        j.jsxOpeningElement(path.node.openingElement.name, [
          ...path.node.openingElement.attributes,
          // build and insert our new prop
          j.jsxAttribute(j.jsxIdentifier('content'), j.stringLiteral(childName)),
        ]),
        path.node.closingElement,
        path.node.children,
      );

      // Replace our original component with our modified one
      j(path).replaceWith(newComponent);
    })
    .toSource(printOptions);
}
