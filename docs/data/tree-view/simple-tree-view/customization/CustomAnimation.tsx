import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useSpring, animated } from '@react-spring/web';

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const CustomTreeItem = React.forwardRef(
  (props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => (
    <TreeItem
      {...props}
      slots={{ groupTransition: TransitionComponent, ...props.slots }}
      ref={ref}
    />
  ),
);

export default function CustomAnimation() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView defaultExpandedItems={['grid']}>
        <CustomTreeItem itemId="grid" label="Data Grid">
          <CustomTreeItem itemId="grid-community" label="@mui/x-data-grid" />
          <CustomTreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
          <CustomTreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
        </CustomTreeItem>
        <CustomTreeItem itemId="pickers" label="Date and Time Pickers">
          <CustomTreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
          <CustomTreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </CustomTreeItem>
        <CustomTreeItem itemId="charts" label="Charts">
          <CustomTreeItem itemId="charts-community" label="@mui/x-charts" />
        </CustomTreeItem>
        <CustomTreeItem itemId="tree-view" label="Tree View">
          <CustomTreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
        </CustomTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
