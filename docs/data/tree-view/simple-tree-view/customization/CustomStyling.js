import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.25)
        : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
}));

export default function CustomStyling() {
  return (
    <SimpleTreeView
      aria-label="customized"
      defaultExpandedItems={['1']}
      sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
    >
      <StyledTreeItem itemId="1" label="Main">
        <StyledTreeItem itemId="2" label="Hello" />
        <StyledTreeItem itemId="3" label="Subtree with children">
          <StyledTreeItem itemId="6" label="Hello" />
          <StyledTreeItem itemId="7" label="Sub-subtree with children">
            <StyledTreeItem itemId="9" label="Child 1" />
            <StyledTreeItem itemId="10" label="Child 2" />
            <StyledTreeItem itemId="11" label="Child 3" />
          </StyledTreeItem>
          <StyledTreeItem itemId="8" label="Hello" />
        </StyledTreeItem>
        <StyledTreeItem itemId="4" label="World" />
        <StyledTreeItem itemId="5" label="Something something" />
      </StyledTreeItem>
    </SimpleTreeView>
  );
}
