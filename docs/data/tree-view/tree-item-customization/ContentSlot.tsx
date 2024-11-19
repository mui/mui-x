import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { UseTreeItemContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  borderRadius: theme.shape.borderRadius,
  border: '1px solid',
  display: 'flex',
  '&:hover': {
    backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.2),
  },
  variants: [
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.disabled,
      style: {
        opacity: 0.5,
        backgroundColor: theme.palette.action.disabledBackground,
      },
    },
    {
      props: ({ status }: UseTreeItemContentSlotOwnProps) => status.selected,
      style: {
        backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.4),
      },
    },
  ],
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        content: CustomContent,
      }}
    />
  );
});

export default function ContentSlot() {
  return (
    <Stack sx={{ minHeight: 200, minWidth: 350 }} spacing={2}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        defaultSelectedItems={'grid'}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        isItemDisabled={(item) => Boolean(item?.disabled)}
      />
    </Stack>
  );
}
