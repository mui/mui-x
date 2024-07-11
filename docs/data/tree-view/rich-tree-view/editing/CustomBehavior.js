import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils, useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem2 = React.forwardRef(function CustomTreeItem2(props, ref) {
  const {
    interactions: { handleCancelItemLabelEditing },
  } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleInputBlur = (event) => {
    event.defaultMuiPrevented = true;
    handleCancelItemLabelEditing(event);
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
  const apiRef = useTreeViewApiRef();

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem2 }}
        apiRef={apiRef}
        isItemEditable={(item) => Boolean(item?.editable)}
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
