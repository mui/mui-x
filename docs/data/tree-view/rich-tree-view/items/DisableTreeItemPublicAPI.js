import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemContent } from '@mui/x-tree-view/TreeItem';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

function CustomContent({ children, toggleItemDisabled, disabled, ...props }) {
  return (
    <TreeItemContent {...props}>
      {children}

      <IconButton
        size="small"
        onClick={(event) => {
          event?.stopPropagation();
          toggleItemDisabled();
        }}
      >
        {disabled ? (
          <LockOutlinedIcon fontSize="small" />
        ) : (
          <LockOpenOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </TreeItemContent>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { publicAPI, status } = useTreeItem(props);

  const toggleItemDisabled = () =>
    publicAPI.toggleDisabledItem(props.itemId, !status.disabled);

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        content: CustomContent,
      }}
      slotProps={{
        content: { toggleItemDisabled, disabled: status.disabled },
      }}
    />
  );
});

export default function DisableTreeItemPublicAPI() {
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
