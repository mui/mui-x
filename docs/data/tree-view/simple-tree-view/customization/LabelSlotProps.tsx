import * as React from 'react';
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
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedItems={['pickers']}
      sx={{ overflowX: 'hidden', minHeight: 224, flexGrow: 1, maxWidth: 300 }}
    >
      <CustomTreeItem itemId="grid" label="Data Grid">
        <CustomTreeItem itemId="grid-community" label="@mui/x-data-grid" />
        <CustomTreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
        <CustomTreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
      </CustomTreeItem>
      <CustomTreeItem itemId="pickers" label="Date and Time Pickers">
        <CustomTreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
        <CustomTreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
      </CustomTreeItem>
    </SimpleTreeView>
  );
}
