import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function SelectableItems() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 290 }}>
      <SimpleTreeView defaultExpandedItems={['grid']} checkboxSelection>
        <TreeItem itemId="grid" label="Data Grid" selectable={false}>
          <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
          <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
          <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
        </TreeItem>
        <TreeItem itemId="pickers" label="Date and Time Pickers" selectable={false}>
          <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
          <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </TreeItem>
        <TreeItem itemId="charts" label="Charts" selectable={false}>
          <TreeItem itemId="charts-community" label="@mui/x-charts" />
        </TreeItem>
        <TreeItem itemId="tree-view" label="Tree View" selectable={false}>
          <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
        </TreeItem>
      </SimpleTreeView>
    </Box>
  );
}
