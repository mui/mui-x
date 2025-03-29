import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
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

import { MUI_X_PRODUCTS } from './products';
import DemoWrapper from '../../DemoWrapper';

interface CustomTreeItemProps
  extends Omit<UseTreeItemParameters, 'rootRef'>,
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

  const { draggable, onDragStart, onDragOver, onDragEnd, ...otherRootProps } = getRootProps(other);

  const handleDragStart = (event: React.DragEvent) => {
    if (!onDragStart) {
      return;
    }

    onDragStart(event);
    event.dataTransfer.setDragImage((event.target as HTMLElement).parentElement!, 0, 0);
  };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...otherRootProps}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <TreeItemIconContainer
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
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

export default function DragAndDropDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });
  return (
    <DemoWrapper link="/x/react-tree-view/rich-tree-view/editing/">
      <Stack
        spacing={1}
        sx={{ width: '100%', padding: 2, minHeight: '600px' }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            minHeight: 352,
            minWidth: 260,
            padding: 2,
            width: 'fit-content',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <RichTreeViewPro
              items={MUI_X_PRODUCTS}
              defaultExpandedItems={['grid', 'pickers']}
              itemsReordering
              slots={{ item: CustomTreeItem }}
            />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={'<RichTreeView\n  items={MUI_X_PRODUCTS}\n  itemsReordering\n/>'}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
