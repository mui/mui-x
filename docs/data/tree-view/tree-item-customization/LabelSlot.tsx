import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';

type TreeItemWithLabel = {
  id: string;
  label: string;
  secondaryLabel?: string;
};

export const MUI_X_PRODUCTS: TreeViewBaseItem<TreeItemWithLabel>[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      {
        id: 'grid-community',
        label: '@mui/x-data-grid',
        secondaryLabel: 'Community package',
      },
      {
        id: 'grid-pro',
        label: '@mui/x-data-grid-pro',
        secondaryLabel: 'Pro package',
      },
      {
        id: 'grid-premium',
        label: '@mui/x-data-grid-premium',
        secondaryLabel: 'Premium package',
      },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time pickers',

    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        secondaryLabel: 'Community package',
      },
      {
        id: 'pickers-pro',
        label: '@mui/x-date-pickers-pro',
        secondaryLabel: 'Pro package',
      },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',

    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

interface CustomLabelProps {
  children: string;
  className: string;
  secondaryLabel: string;
}

function CustomLabel({ children, className, secondaryLabel }: CustomLabelProps) {
  return (
    <div className={className}>
      <Typography>{children}</Typography>
      {secondaryLabel && (
        <Typography variant="caption" color="secondary">
          {secondaryLabel}
        </Typography>
      )}
    </div>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const item = useTreeItemModel<TreeItemWithLabel>(props.itemId)!;

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { secondaryLabel: item?.secondaryLabel || '' } as CustomLabelProps,
      }}
    />
  );
});

export default function LabelSlot() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
