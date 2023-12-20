import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    borderRadius: theme.spacing(0.5),
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
  },
}));

export default function CustomMaterialIcons() {
  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="customized"
        defaultExpanded={['1']}
        defaultCollapseIcon={<ExpandLessIcon />}
        defaultExpandIcon={<ExpandMoreIcon />}
        defaultEndIcon={<CloseIcon />}
        sx={{ overflowX: 'hidden' }}
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
      </TreeView>
    </Box>
  );
}
