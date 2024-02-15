import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useTreeItemInteractions } from '@mui/x-tree-view/internals/useTreeItemInteractions';
import { UseTreeItemContentSlotOwnProps } from '@mui/x-tree-view/internals/useTreeItem';
import {
  TreeItemNext,
  TreeItemNextProps,
} from '@mui/x-tree-view/internals/TreeItemNext';

const CustomTreeItem = React.forwardRef(function MyTreeItem(
  props: TreeItemNextProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItemInteractions({
    nodeId: props.nodeId,
    children: props.children,
  });

  const handleContentClick: UseTreeItemContentSlotOwnProps['onClick'] = (event) => {
    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event: React.MouseEvent) => {
    interactions.handleExpansion(event);
  };

  return (
    <TreeItemNext
      {...props}
      ref={ref}
      slotProps={{
        content: { onClick: handleContentClick },
        iconContainer: { onClick: handleIconContainerClick },
      }}
    />
  );
});

export default function IconExpansionTreeView() {
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <SimpleTreeView aria-label="icon expansion">
        <CustomTreeItem nodeId="1" label="Applications">
          <CustomTreeItem nodeId="2" label="Calendar" />
        </CustomTreeItem>
        <CustomTreeItem nodeId="5" label="Documents">
          <CustomTreeItem nodeId="10" label="OSS" />
          <CustomTreeItem nodeId="6" label="MUI">
            <CustomTreeItem nodeId="8" label="index.js" />
          </CustomTreeItem>
        </CustomTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
