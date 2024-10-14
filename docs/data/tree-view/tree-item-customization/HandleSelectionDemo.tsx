import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CircleIcon from '@mui/icons-material/Circle';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
import {
  UseTreeItem2ContentSlotOwnProps,
  UseTreeItem2LabelSlotOwnProps,
  UseTreeItem2Status,
} from '@mui/x-tree-view/useTreeItem2';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem2,
  TreeItem2Props,
  TreeItem2SlotProps,
} from '@mui/x-tree-view/TreeItem2';
import { MUI_X_PRODUCTS } from './products';

interface CustomLabelProps extends UseTreeItem2LabelSlotOwnProps {
  status: UseTreeItem2Status;
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
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions, status } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });
  const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleIconButtonClick = (event: React.MouseEvent) => {
    interactions.handleSelection(event);
  };

  return (
    <TreeItem2
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={
        {
          label: { onClick: handleIconButtonClick, status },
          content: { onClick: handleContentClick },
        } as TreeItem2SlotProps
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
