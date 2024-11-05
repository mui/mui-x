import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { UseTreeItemLabelInputSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleInputBlur: UseTreeItemLabelInputSlotOwnProps['onBlur'] = (event) => {
    interactions.handleCancelItemLabelEditing(event);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={{
        labelInput: {
          onBlur: handleInputBlur,
        },
      }}
    />
  );
});

export default function CustomBehavior() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        experimentalFeatures={{ labelEditing: true }}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
