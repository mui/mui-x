import * as React from 'react';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem2,
  TreeItem2Props,
  TreeItem2SlotProps,
} from '@mui/x-tree-view/TreeItem2';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem2
      {...props}
      ref={ref}
      slotProps={
        {
          content: {
            sx: { border: '1px solid' },
          },
        } as TreeItem2SlotProps
      }
    />
  );
});

export default function ContentSlotProps() {
  return (
    <Stack sx={{ minHeight: 200, minWidth: 350 }} spacing={2}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Stack>
  );
}
