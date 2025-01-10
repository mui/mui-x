import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CircleIcon from '@mui/icons-material/Circle';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import {
  UseTreeItemContentSlotOwnProps,
  UseTreeItemLabelSlotOwnProps,
  UseTreeItemStatus,
} from '@mui/x-tree-view/useTreeItem';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem,
  TreeItemProps,
  TreeItemSlotProps,
} from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

interface CustomLabelProps extends UseTreeItemLabelSlotOwnProps {
  status: UseTreeItemStatus;
  onClick: React.MouseEventHandler<HTMLElement>;
}

function CustomLabel({ children, status, onClick, ...props }: CustomLabelProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexGrow={1}
      {...props}
    >
      <Typography>{children}</Typography>
      <IconButton onClick={onClick} aria-label="select item" size="small">
        {status.selected ? (
          <CircleIcon fontSize="inherit" color="primary" />
        ) : (
          <PanoramaFishEyeIcon fontSize="inherit" color="primary" />
        )}
      </IconButton>
    </Stack>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions, status } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });
  const handleContentClick: UseTreeItemContentSlotOwnProps['onClick'] = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleIconButtonClick = (event: React.MouseEvent) => {
    interactions.handleSelection(event);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={
        {
          label: { onClick: handleIconButtonClick, status },
          content: { onClick: handleContentClick },
        } as TreeItemSlotProps
      }
    />
  );
});

export default function HandleSelectionDemo() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}
