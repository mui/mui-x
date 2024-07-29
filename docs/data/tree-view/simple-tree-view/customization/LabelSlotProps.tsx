import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';

const CustomTreeItem = React.forwardRef(
  (props: TreeItem2Props, ref: React.Ref<HTMLLIElement>) => (
    <TreeItem2
      ref={ref}
      {...props}
      slotProps={{
        label: {
          id: `${props.itemId}-label`,
        },
      }}
    />
  ),
);

export default function LabelSlotProps() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView defaultExpandedItems={['grid']}>
        <CustomTreeItem itemId="grid" label="Data Grid">
          <CustomTreeItem itemId="grid-community" label="@mui/x-data-grid" />
          <CustomTreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
          <CustomTreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
        </CustomTreeItem>
        <CustomTreeItem itemId="pickers" label="Date and Time Pickers">
          <CustomTreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
          <CustomTreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </CustomTreeItem>
        <CustomTreeItem itemId="charts" label="Charts">
          <CustomTreeItem itemId="charts-community" label="@mui/x-charts" />
        </CustomTreeItem>
        <CustomTreeItem itemId="tree-view" label="Tree View">
          <CustomTreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
        </CustomTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
