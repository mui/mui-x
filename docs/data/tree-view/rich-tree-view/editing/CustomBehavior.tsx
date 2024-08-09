import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { UseTreeItem2LabelInputSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem2 = React.forwardRef(function CustomTreeItem2(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleInputBlur: UseTreeItem2LabelInputSlotOwnProps['onBlur'] = (event) => {
    interactions.handleCancelItemLabelEditing(event);
  };

  return (
    <TreeItem2
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
        slots={{ item: CustomTreeItem2 }}
        experimentalFeatures={{ labelEditing: true }}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
