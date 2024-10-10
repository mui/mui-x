import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemProps,
  TreeItemGroupTransition,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  { id, itemId, label, disabled, children }: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    getRootProps,
    getContentProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const { interactions } = useTreeItemUtils({
    itemId,
    children,
  });

  const handleClick = (event: React.MouseEvent) => {
    interactions.handleExpansion(event);
  };

  return (
    <TreeItemProvider itemId={itemId}>
      <TreeItemRoot {...getRootProps({ sx: { position: 'relative' } })}>
        {status.expandable && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              width: '24px',
              height: 'calc(100% - 12px)',
              position: 'absolute',
              left: '-24px',
              top: '6px',
            }}
          >
            {status.expanded ? (
              <React.Fragment>
                <IconButton
                  onClick={handleClick}
                  aria-label="collapse item"
                  size="small"
                >
                  <IndeterminateCheckBoxOutlinedIcon sx={{ fontSize: '14px' }} />
                </IconButton>
                <Box sx={{ flexGrow: 1, borderLeft: '1px solid' }} />
              </React.Fragment>
            ) : (
              <IconButton
                onClick={handleClick}
                aria-label="Expand item"
                size="small"
              >
                <AddBoxOutlinedIcon sx={{ fontSize: '14px' }} />
              </IconButton>
            )}
          </Box>
        )}

        <TreeItemContent {...getContentProps()}>
          <TreeItemLabel {...getLabelProps()} />

          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function HandleExpansionDemo() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        defaultExpandedItems={['grid']}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
