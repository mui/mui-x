import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRichTreeViewPro } from './types.rich-tree-view-pro';

const allowedProps = ['apiRef', 'canMoveItemToNewPosition', 'checkboxSelection', 'classes', 'dataSource', 'dataSourceCache', 'defaultExpandedItems', 'defaultSelectedItems', 'disableSelection', 'disableVirtualization', 'disabledItemsFocusable', 'domStructure', 'expandedItems', 'expansionTrigger', 'getItemChildren', 'getItemId', 'getItemLabel', 'id', 'isItemDisabled', 'isItemEditable', 'isItemReorderable', 'isItemSelectionDisabled', 'itemChildrenIndentation', 'itemHeight', 'itemsReordering', 'multiSelect', 'onExpandedItemsChange', 'onItemClick', 'onItemExpansionToggle', 'onItemFocus', 'onItemLabelChange', 'onItemPositionChange', 'onItemSelectionToggle', 'onItemsLazyLoaded', 'onSelectedItemsChange', 'selectedItems', 'selectionPropagation', 'slotProps', 'slots', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="RichTreeViewPro" allowedProps={allowedProps}>
      <TypesRichTreeViewPro />
    </TypesPageShell>
  );
}
