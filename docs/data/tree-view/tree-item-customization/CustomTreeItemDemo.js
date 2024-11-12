import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemGroupTransition,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemCheckbox,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';

const ITEMS = [
  {
    id: '1',
    label: 'An item',
    children: [
      { id: '1.1', label: 'An editable child', editable: true },
      { id: '1.2', label: 'Another child' },
    ],
  },
];

const AnnotationText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: theme.typography.pxToRem(11),
}));

const CustomTreeItemTransition = styled(TreeItemGroupTransition)(({ theme }) => ({
  padding: 6,
  border: '1px solid transparent',
  '&:hover:not(:has(:hover))': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTreeItemLabelInput = styled(TreeItemLabelInput)(({ theme }) => ({
  color: theme.palette.text.primary,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
  border: '1px solid transparent',
  '&:hover:not(:has(:hover))': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTreeItemIconContainer = styled(TreeItemIconContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTreeItemLabel = styled(TreeItemLabel)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTreeItemCheckbox = styled(TreeItemCheckbox)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: '1px solid transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, ...other } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMouseOver = (event) => {
    setAnchorEl(event.target);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    getLabelInputProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  return (
    <React.Fragment>
      <TreeItemProvider itemId={itemId}>
        <TreeItemRoot
          {...getRootProps({
            ...other,
            onMouseOver: handleMouseOver,
            onMouseLeave: handleMouseLeave,
            'data-name': 'TreeItemRoot',
          })}
        >
          <CustomTreeItemContent
            {...getContentProps({
              'data-name': 'TreeItemContent',
            })}
          >
            <CustomTreeItemIconContainer
              {...getIconContainerProps({
                'data-name': 'TreeItemIconContainer',
              })}
            >
              <TreeItemIcon status={status} data-name="TreeItemIcon" />
            </CustomTreeItemIconContainer>
            <CustomTreeItemCheckbox
              {...getCheckboxProps({
                'data-name': 'TreeItemCheckbox',
              })}
            />
            {status?.editable ? (
              <CustomTreeItemLabelInput
                {...getLabelInputProps({
                  'data-name': 'TreeItemLabelInput',
                })}
              />
            ) : (
              <CustomTreeItemLabel
                {...getLabelProps({
                  'data-name': 'TreeItemLabel',
                })}
              />
            )}

            <TreeItemDragAndDropOverlay
              {...getDragAndDropOverlayProps({
                'data-name': 'TreeItemDragAndDropOverlay',
              })}
            />
          </CustomTreeItemContent>
          {children && (
            <CustomTreeItemTransition
              {...getGroupTransitionProps({
                'data-name': 'TreeItemGroupTransition',
              })}
            />
          )}
        </TreeItemRoot>
      </TreeItemProvider>
      <Popover
        slotProps={{
          root: {
            slotProps: {
              backdrop: { id: 'backdrop', invisible: true, sx: { display: 'none' } },
              root: { style: { width: 'fit-content', height: 'fit-content' } },
            },
          },
          paper: {
            elevation: 0,
            sx: (theme) => ({
              maxWidth: 'initial',
              maxHeight: 'initial',
              minHeight: 0,
              backgroundColor: theme.palette.primary.main,
              padding: '0 4px',
              display: 'flex',
            }),
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <AnnotationText variant="caption">
          {anchorEl && anchorEl.closest('[data-name]')?.dataset.name}
        </AnnotationText>
      </Popover>
    </React.Fragment>
  );
});

export default function CustomTreeItemDemo() {
  return (
    <Box sx={{ minHeight: 120, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['1']}
        items={ITEMS}
        slots={{ item: CustomTreeItem }}
        defaultSelectedItems="1.1"
        checkboxSelection
        experimentalFeatures={{ labelEditing: true }}
        isItemEditable={(item) => Boolean(item?.editable)}
      />
    </Box>
  );
}
