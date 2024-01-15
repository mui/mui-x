import * as React from 'react';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default function BorderedTreeView() {
  return (
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedNodes={['1', '3']}
      defaultCollapseIcon={
        <IndeterminateCheckBoxRoundedIcon sx={{ opacity: 0.8 }} />
      }
      defaultExpandIcon={<AddBoxRoundedIcon sx={{ opacity: 0.8 }} />}
      defaultEndIcon={<DisabledByDefaultRoundedIcon sx={{ opacity: 0.3 }} />}
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
