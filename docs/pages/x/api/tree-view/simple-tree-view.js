import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSimpleTreeView } from './types.simple-tree-view';

const allowedProps = ['apiRef', 'checkboxSelection', 'children', 'classes', 'defaultExpandedItems', 'defaultSelectedItems', 'disableSelection', 'disabledItemsFocusable', 'expandedItems', 'expansionTrigger', 'id', 'itemChildrenIndentation', 'itemHeight', 'multiSelect', 'onExpandedItemsChange', 'onItemClick', 'onItemExpansionToggle', 'onItemFocus', 'onItemSelectionToggle', 'onSelectedItemsChange', 'selectedItems', 'selectionPropagation', 'slotProps', 'slots', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="SimpleTreeView" allowedProps={allowedProps}>
      <TypesSimpleTreeView />
    </TypesPageShell>
  );
}
