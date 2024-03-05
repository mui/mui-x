import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks/useTreeItem2Utils';

import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
  const { interactions } = useTreeItem2Utils({
    nodeId: props.nodeId,
    children: props.children,
  });

  const handleContentClick = (event) => {
    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event) => {
    interactions.handleExpansion(event);
  };

  return (
    <TreeItem2
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
