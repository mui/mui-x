import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

interface CustomLabelProps {
  children: string;
  className: string;
  selectFirstChildren?: (event: React.MouseEvent) => void;
}

function CustomLabel({
  children,
  className,
  selectFirstChildren,
}: CustomLabelProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={4}
      flexGrow={1}
      className={className}
    >
      <Typography>{children}</Typography>
      {!!selectFirstChildren && (
        <Button
          size="small"
          variant="text"
          sx={{ position: 'absolute', right: 0, top: 0 }}
          onClick={selectFirstChildren}
        >
          Select child
        </Button>
      )}
    </Stack>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { publicAPI, status } = useTreeItem(props);

  const selectFirstChildren = status.expanded
    ? (event: React.MouseEvent) => {
        event.stopPropagation();
        const children = publicAPI.getItemOrderedChildrenIds(props.itemId);
        if (children.length > 0) {
          publicAPI.selectItem({
            event,
            itemId: children[0],
            shouldBeSelected: true,
          });
        }
      }
    : undefined;

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { selectFirstChildren } as CustomLabelProps,
      }}
    />
  );
});

export default function useTreeItemHookPublicAPI() {
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
