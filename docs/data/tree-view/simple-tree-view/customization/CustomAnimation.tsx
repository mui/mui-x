import * as React from 'react';
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
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedNodes={['1']}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
    >
      <CustomTreeItem nodeId="1" label="Main">
        <CustomTreeItem nodeId="2" label="Hello" />
        <CustomTreeItem nodeId="3" label="Subtree with children">
          <CustomTreeItem nodeId="6" label="Hello" />
          <CustomTreeItem nodeId="7" label="Sub-subtree with children">
            <CustomTreeItem nodeId="9" label="Child 1" />
            <CustomTreeItem nodeId="10" label="Child 2" />
            <CustomTreeItem nodeId="11" label="Child 3" />
          </CustomTreeItem>
          <CustomTreeItem nodeId="8" label="Hello" />
        </CustomTreeItem>
        <CustomTreeItem nodeId="4" label="World" />
        <CustomTreeItem nodeId="5" label="Something something" />
      </CustomTreeItem>
    </SimpleTreeView>
  );
}
