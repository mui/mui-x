import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import {
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemGroupTransition,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemCheckbox,
  TreeItemProps,
} from '@mui/x-tree-view/TreeItem';
import {
  TreeViewBaseItem,
  TreeViewCancellableEventHandler,
} from '@mui/x-tree-view/models';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';

type ItemType = TreeViewBaseItem<{
  id: string;
  label: string;
  childrenCount?: number;
}>;

const LATENCY_MS = 300;

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
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
    publicAPI,
  } = useTreeItem({
    id,
    itemId,
    children,
    label,
    disabled,
    rootRef: ref,
  });

  const refreshChildren: TreeViewCancellableEventHandler<React.MouseEvent> = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
    publicAPI.updateItemChildren!(itemId);
  };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other as any)}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} />
            {status.expandable && status.expanded && (
              <IconButton
                size="small"
                onClick={refreshChildren}
                title="Refetch children"
              >
                <CachedIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function ApiMethodUpdateItemChildren() {
  const fetchData = async (): Promise<ItemType[]> => {
    const length: number = randomInt(5, 10);
    const rows = Array.from({ length }, () => ({
      id: randomId(),
      label: randomName({}, {}),
      ...(randomBoolean() ? { childrenCount: length } : {}),
    }));

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rows);
      }, LATENCY_MS);
    });
  };

  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeViewPro
        items={[]}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
