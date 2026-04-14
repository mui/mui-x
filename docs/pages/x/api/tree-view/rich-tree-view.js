import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRichTreeView } from './types.rich-tree-view';

const allowedProps = ['apiRef', 'checkboxSelection', 'classes', 'defaultExpandedItems', 'defaultSelectedItems', 'disableSelection', 'disabledItemsFocusable', 'domStructure', 'expandedItems', 'expansionTrigger', 'getItemChildren', 'getItemId', 'getItemLabel', 'id', 'isItemDisabled', 'isItemEditable', 'isItemSelectionDisabled', 'itemChildrenIndentation', 'itemHeight', 'multiSelect', 'onExpandedItemsChange', 'onItemClick', 'onItemExpansionToggle', 'onItemFocus', 'onItemLabelChange', 'onItemSelectionToggle', 'onSelectedItemsChange', 'selectedItems', 'selectionPropagation', 'slotProps', 'slots', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="RichTreeView" allowedProps={allowedProps}>
      <TypesRichTreeView />
    </TypesPageShell>
  );
}
