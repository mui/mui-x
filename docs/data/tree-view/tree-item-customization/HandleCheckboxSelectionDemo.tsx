import * as React from 'react';
import Box from '@mui/material/Box';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { UseTreeItemCheckboxSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem,
  TreeItemProps,
  TreeItemSlotProps,
} from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });

  const doSomething = () => {
    // Do something when the checkbox is clicked
  };

  const handleCheckboxOnChange: UseTreeItemCheckboxSlotOwnProps['onChange'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
    doSomething();
    interactions.handleCheckboxSelection(event);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={
        {
          checkbox: { onChange: handleCheckboxOnChange },
        } as TreeItemSlotProps
      }
    />
  );
});

export default function HandleCheckboxSelectionDemo() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
