import type { Collection, JSCodeshift } from 'jscodeshift';

interface RenamePropsArgs {
  root: Collection<any>;
  componentNames: string[];
  nestedProps: Record<string, Record<string, any>>;
  j: JSCodeshift;
}

export default function renameNestedProps({
  root,
  componentNames,
  nestedProps,
  j,
}: RenamePropsArgs) {
  return root
    .find(j.JSXElement)
    .filter((path) => componentNames.includes((path.value.openingElement.name as any).name))
    .find(j.JSXAttribute)
    .filter((attribute) => Object.keys(nestedProps).includes(attribute.node.name.name as string))
    .forEach((attribute) => {
      Object.entries(nestedProps).forEach(([rootPropName, props]) => {
        if (
          attribute.node.name.name === rootPropName &&
          attribute.node.value?.type === 'JSXExpressionContainer' &&
          attribute.node.value?.expression.type === 'ObjectExpression'
        ) {
          const existingProperties = attribute.node.value.expression.properties;
          existingProperties.forEach((property) => {
            if (
              property.type === 'Property' &&
              property.key.type === 'Identifier' &&
              props[property.key.name]
            ) {
              property.key.name = props[property.key.name];
            }
          });
        }
      });
    });
}
