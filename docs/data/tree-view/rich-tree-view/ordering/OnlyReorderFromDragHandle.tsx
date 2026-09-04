import * as React from 'react';
import Box from '@mui/material/Box';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
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
import { MUI_X_PRODUCTS } from '../../datasets/products';

interface CustomTreeItemProps
  extends
    Omit<UseTreeItemParameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const { draggable, onDragStart, ...otherRootProps } = getRootProps(other);

  const handleDragStart = (event: React.DragEvent) => {
    if (!onDragStart) {
      return;
    }

    onDragStart(event);
    event.dataTransfer.setDragImage(
      (event.target as HTMLElement).parentElement!,
      0,
      0,
    );
  };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...otherRootProps}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <TreeItemIconContainer draggable={draggable} onDragStart={handleDragStart}>
            <DragIndicatorIcon />
          </TreeItemIconContainer>
          <TreeItemCheckbox {...getCheckboxProps()} />
          <TreeItemLabel {...getLabelProps()} />
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function OnlyReorderFromDragHandle() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 300 }}>
      <RichTreeViewPro
        items={MUI_X_PRODUCTS}
        defaultExpandedItems={['grid', 'pickers']}
        itemsReordering
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
