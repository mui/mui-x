import * as React from 'react';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses, TreeItemProps } from '@mui/x-tree-view/TreeItem';
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
    <TreeItem {...props} TransitionComponent={TransitionComponent} ref={ref} />
  ),
);

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontFamily: 'monospace',
      fontSize: '0.8rem',
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
}));

export default function CustomAnimation() {
  return (
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedNodes={['1']}
      defaultCollapseIcon={
        <IndeterminateCheckBoxRoundedIcon sx={{ opacity: 0.8 }} />
      }
      defaultExpandIcon={<AddBoxRoundedIcon sx={{ opacity: 0.8 }} />}
      defaultEndIcon={<DisabledByDefaultRoundedIcon sx={{ opacity: 0.3 }} />}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
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
  );
}
