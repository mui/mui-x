import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
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
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

export default function CustomStyling() {
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
