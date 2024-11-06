import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CircleIcon from '@mui/icons-material/Circle';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

function CustomLabel({ children, status, onClick, ...props }) {
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

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { interactions, status } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });
  const handleContentClick = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleIconButtonClick = (event) => {
    interactions.handleSelection(event);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { onClick: handleIconButtonClick, status },
        content: { onClick: handleContentClick },
      }}
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
