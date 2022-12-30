import type { Collection, JSCodeshift } from 'jscodeshift';

interface RenamePropsArgs {
  root: Collection<any>;
  componentNames: string[];
  props: Record<string, any>;
  j: JSCodeshift;
}

export default function renameProps({ root, componentNames, props, j }: RenamePropsArgs) {
  return root
    .find(j.JSXElement)
    .filter((path) => {
      return componentNames.includes((path.value.openingElement.name as any).name);
    })
    .find(j.JSXAttribute)
    .filter((attribute) => Object.keys(props).includes(attribute.node.name.name as string))
    .forEach((attribute) => {
      j(attribute).replaceWith(
        j.jsxAttribute(
          j.jsxIdentifier(props[attribute.node.name.name as string]),
          attribute.node.value,
        ),
      );
    });
}
