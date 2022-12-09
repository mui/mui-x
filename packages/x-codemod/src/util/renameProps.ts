import type { Collection } from 'jscodeshift';

interface RenamePropsArgs {
  root: Collection<any>;
  componentName: string;
  props: Record<string, any>;
}

export default function renameProps({ root, componentName, props }: RenamePropsArgs) {
  return root.findJSXElements(componentName).forEach((path) => {
    path.node.openingElement.attributes?.forEach((node) => {
      if (node.type === 'JSXAttribute' && Object.keys(props).includes(node.name.name as string)) {
        node.name.name = props[node.name.name as string];
      }
    });
  });
}
