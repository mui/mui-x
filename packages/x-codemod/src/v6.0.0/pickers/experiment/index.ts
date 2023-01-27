export default function transformer(file, { jscodeshift: j }, options) {
  const source = j(file.source);

  source
    .find(j.JSXElement)
    .filter((path) => path.value.openingElement.name.name === 'button') // Find all button jsx elements
    .find(j.JSXAttribute) // Find all attributes (props) on the button
    .filter((path) => path.node.name.name === 'onClick') // Filter to only props called onClick
    .remove(); // Remove everything that matched

  return source.toSource();
}
