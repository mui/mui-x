import * as React from 'react';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import { TransitionProps } from '@mui/material/transitions';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 16}px,0,0)`,
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
    <TreeItem {...props} TransitionComponent={TransitionComponent} ref={ref} />
  ),
);

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.2,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 12,
    paddingLeft: 16,
    borderLeft: `1px dashed ${theme.palette.divider}`,
  },
}));

export default function CustomizedTreeView() {
  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
      <SimpleTreeView
        aria-label="customized"
        defaultExpandedNodes={['1']}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        sx={{ overflowX: 'hidden' }}
      >
        <StyledTreeItem nodeId="1" label="Main">
          <StyledTreeItem nodeId="2" label="Hello" />
          <StyledTreeItem nodeId="3" label="Subtree with children">
            <StyledTreeItem nodeId="6" label="Hello" />
            <StyledTreeItem nodeId="7" label="Sub-subtree with children">
              <StyledTreeItem nodeId="9" label="Child 1" />
              <StyledTreeItem nodeId="10" label="Child 2" />
              <StyledTreeItem nodeId="11" label="Child 3" />
            </StyledTreeItem>
            <StyledTreeItem nodeId="8" label="Hello" />
          </StyledTreeItem>
          <StyledTreeItem nodeId="4" label="World" />
          <StyledTreeItem nodeId="5" label="Something something" />
        </StyledTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
