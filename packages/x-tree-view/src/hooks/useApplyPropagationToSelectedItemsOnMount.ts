import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { TreeViewItemId, TreeViewSelectionPropagation } from '../models';
import { getLookupFromArray } from '../internals/plugins/selection/TreeViewSelectionPlugin';

const defaultGetItemId = (item: any) => item.id;

const defaultGetItemChildren = (item: any) => item.children;

/**
 * Applies the selection propagation rules to the selected items.
 * The value is only computed during the first render, any update of the parameters will be ignored.
 *
 * Uncontrolled example:
 * ```tsx
 * const defaultSelectedItems = useApplyPropagationToSelectedItemsOnMount({
 *   items: props.items,
 *   selectionPropagation: props.selectionPropagation,
 *   selectedItems: ['10', '11', '13', '14'],
 * });
 *
 * return (
 *   <RichTreeView
 *     items={props.items}
 *     selectionPropagation={props.selectionPropagation}
 *     defaultSelectedItems={defaultSelectedItems}
 *   />
 * );
 * ```
 *
 * Controlled example:
 * ```tsx
 * const initialSelectedItems = useApplyPropagationToSelectedItemsOnMount({
 *   items: props.items,
 *   selectionPropagation: props.selectionPropagation,
 *   selectedItems: ['10', '11', '13', '14'],
 * });
 *
 * const [selectedItems, setSelectedItems] = React.useState(initialSelectedItems);
 *
 * return (
 *   <RichTreeView
 *     items={props.items}
 *     selectionPropagation={props.selectionPropagation}
 *     selectedItems={selectedItems}
 *     onSelectedItemsChange={setSelectedItems}
 *   />
 * );
 * ```
 */
export function useApplyPropagationToSelectedItemsOnMount(
  parameters: UseApplyPropagationToDefaultSelectedItemsParameters<any>,
) {
  const {
    items: itemsParam,
    getItemId = defaultGetItemId,
    getItemChildren = defaultGetItemChildren,
    selectedItems,
    selectionPropagation,
  } = parameters;

  return useRefWithInit(() => {
    const lookup = getLookupFromArray(selectedItems);

    function walk(items: any[], isParentSelected: boolean) {
      for (const item of items) {
        const itemId = getItemId(item);
        let isSelected = lookup[itemId];

        if (!isSelected && selectionPropagation.descendants && isParentSelected) {
          lookup[itemId] = true;
          isSelected = true;
        }

        const children = getItemChildren(item) ?? [];
        if (children.length > 0) {
          walk(children, isSelected);

          if (!isSelected && selectionPropagation.parents) {
            const areAllChildrenSelected = children.every(
              (childId: any) => lookup[getItemId(childId)],
            );
            if (areAllChildrenSelected) {
              lookup[itemId] = true;
            }
          }
        }
      }
    }

    walk(itemsParam, false);

    return Object.keys(lookup);
  }).current;
}

interface UseApplyPropagationToDefaultSelectedItemsParameters<R extends { children?: R[] }> {
  items: R[];
  getItemId?: (item: R) => TreeViewItemId;
  getItemChildren?: (item: R) => R[] | undefined;
  selectedItems: string[];
  selectionPropagation: TreeViewSelectionPropagation;
}
