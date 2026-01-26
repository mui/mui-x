import type { Collection, JSCodeshift } from 'jscodeshift';

interface RenamePropsArgs {
  root: Collection<any>;
  /**
   * Names of the components to target
   * @example ["DataGrid", "DataGridPro"]
   */
  componentNames: string[];
  /**
   * Object that maps prop names to their nested properties renaming mappings.
   *
   * In the following example we rename properties inside `componentsProps` prop:
   * @example { componentsProps: { root: "slotRoot", input: "slotInput" } }
   */
  nestedProps: Record<string, Record<string, any>>;
  j: JSCodeshift;
}

/**
 * Allow to rename object properties inside props of specified components.
 */
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
