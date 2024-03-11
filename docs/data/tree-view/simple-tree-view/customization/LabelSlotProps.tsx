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
          id: `${props.nodeId}-label`,
        },
      }}
    />
  ),
);

export default function LabelSlotProps() {
  return (
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedNodes={['pickers']}
      sx={{ overflowX: 'hidden', minHeight: 224, flexGrow: 1, maxWidth: 300 }}
    >
      <CustomTreeItem nodeId="grid" label="Data Grid">
        <CustomTreeItem nodeId="grid-community" label="@mui/x-data-grid" />
        <CustomTreeItem nodeId="grid-pro" label="@mui/x-data-grid-pro" />
        <CustomTreeItem nodeId="grid-premium" label="@mui/x-data-grid-premium" />
      </CustomTreeItem>
      <CustomTreeItem nodeId="pickers" label="Date and Time Pickers">
        <CustomTreeItem nodeId="pickers-community" label="@mui/x-date-pickers" />
        <CustomTreeItem nodeId="pickers-pro" label="@mui/x-date-pickers-pro" />
      </CustomTreeItem>
    </SimpleTreeView>
  );
}
