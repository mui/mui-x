import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  { id, itemId, label, disabled, children },
  ref,
) {
  const {
    getRootProps,
    getContentProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const { interactions } = useTreeItem2Utils({
    itemId,
    children,
  });

  const handleClick = (event) => {
    interactions.handleExpansion(event);
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps({ sx: { position: 'relative' } })}>
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

        <TreeItem2Content {...getContentProps()}>
          <TreeItem2Label {...getLabelProps()} />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItem2Content>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
      </TreeItem2Root>
    </TreeItem2Provider>
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
