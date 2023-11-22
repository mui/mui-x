import type { Collection, JSCodeshift } from 'jscodeshift';

interface RemovePropsArgs {
  root: Collection<any>;
  componentNames: string[];
  props: string[];
  j: JSCodeshift;
}

export default function removeProps({ root, componentNames, props, j }: RemovePropsArgs) {
  return root
    .find(j.JSXElement)
    .filter((path) => {
      return componentNames.includes((path.value.openingElement.name as any).name);
    })
    .find(j.JSXAttribute)
    .filter((attribute) => props.includes(attribute.node.name.name as string))
    .forEach((attribute) => {
      // Only remove props from components in componentNames. Not nested ones.
      const attributeParent = attribute.parentPath.parentPath;
      if (
        attributeParent.value.type === 'JSXOpeningElement' &&
        componentNames.includes(attributeParent.value.name.name)
      ) {
        j(attribute).remove();
      }
    });
}
