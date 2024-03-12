import * as React from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
];

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
    <RichTreeView
      items={MUI_X_PRODUCTS}
      aria-label="customized"
      defaultExpandedItems={['pickers']}
      sx={{ overflowX: 'hidden', minHeight: 224, flexGrow: 1, maxWidth: 300 }}
      slots={{ item: CustomTreeItem }}
    />
  );
}
