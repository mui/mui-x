import type { Collection, JSCodeshift, JSXAttribute } from 'jscodeshift';

interface RemovePropsArgs {
  root: Collection<any>;
  /**
   * Names of the components to target
   * @example ["DataGrid", "DataGridPro"]
   */
  componentNames: string[];
  /**
   * The list of props to remove
   * @example ["disableSelectionOnClick", "hideFooterSelectedRowCount"]
   */
  props: string[];
  /**
   * Optional predicate to filter which props to remove based on their value.
   * Return `true` to remove the prop, `false` to keep it.
   * @param {JSXAttribute} attribute The JSXAttribute node to evaluate.
   * @returns {boolean} Whether to remove the prop or not.
   */
  shouldRemove?: (attribute: JSXAttribute) => boolean;
  j: JSCodeshift;
}

/**
 * Removes specified props from given components.
 */
export default function removeProps({
  root,
  componentNames,
  props,
  shouldRemove,
  j,
}: RemovePropsArgs) {
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
        componentNames.includes(attributeParent.value.name.name) &&
        (!shouldRemove || shouldRemove(attribute.node))
      ) {
        j(attribute).remove();
      }
    });
}
