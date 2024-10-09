import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { UseTreeItem2ContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import { MUI_X_PRODUCTS } from './products';

const CustomContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  border: '1px solid',
  display: 'flex',
  '&:hover': {
    backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.2),
  },
  variants: [
    {
      props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.disabled,
      style: {
        opacity: 0.5,
        backgroundColor: theme.palette.action.disabledBackground,
      },
    },
    {
      props: ({ status }: UseTreeItem2ContentSlotOwnProps) => status.selected,
      style: {
        backgroundColor: alpha((theme.vars || theme).palette.primary.main, 0.4),
      },
    },
  ],
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem2
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
