import * as React from 'react';
import Collapse from '@mui/material/Collapse';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useSpring, animated } from '@react-spring/web';

function TransitionComponent(props) {
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

const CustomTreeItem = React.forwardRef((props, ref) => (
  <TreeItem
    {...props}
    slots={{ groupTransition: TransitionComponent, ...props.slots }}
    ref={ref}
  />
));

export default function CustomAnimation() {
  return (
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedItems={['1']}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
    >
      <CustomTreeItem itemId="1" label="Main">
        <CustomTreeItem itemId="2" label="Hello" />
        <CustomTreeItem itemId="3" label="Subtree with children">
          <CustomTreeItem itemId="6" label="Hello" />
          <CustomTreeItem itemId="7" label="Sub-subtree with children">
            <CustomTreeItem itemId="9" label="Child 1" />
            <CustomTreeItem itemId="10" label="Child 2" />
            <CustomTreeItem itemId="11" label="Child 3" />
          </CustomTreeItem>
          <CustomTreeItem itemId="8" label="Hello" />
        </CustomTreeItem>
        <CustomTreeItem itemId="4" label="World" />
        <CustomTreeItem itemId="5" label="Something something" />
      </CustomTreeItem>
    </SimpleTreeView>
  );
}
