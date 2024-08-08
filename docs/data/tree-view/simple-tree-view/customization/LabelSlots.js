import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2, TreeItem2Label } from '@mui/x-tree-view/TreeItem2';

function CustomLabel(props) {
  const { tooltip, ...other } = props;

  return (
    <Tooltip title={tooltip}>
      <TreeItem2Label {...other} />
    </Tooltip>
  );
}

const CustomTreeItem = React.forwardRef((props, ref) => {
  const { labelTooltip, ...other } = props;

  return (
    <TreeItem2
      {...other}
      ref={ref}
      slots={{ label: CustomLabel }}
      slotProps={{ label: { tooltip: labelTooltip } }}
    />
  );
});

export default function LabelSlots() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView defaultExpandedItems={['grid']}>
        <CustomTreeItem itemId="grid" label="Data Grid">
          <CustomTreeItem
            itemId="grid-community"
            label="@mui/x-data-grid"
            labelTooltip="Community version (MIT) of the Data Grid"
          />
          <CustomTreeItem
            itemId="grid-pro"
            label="@mui/x-data-grid-pro"
            labelTooltip="Pro version (commercial) of the Data Grid"
          />
          <CustomTreeItem
            itemId="grid-premium"
            label="@mui/x-data-grid-premium"
            labelTooltip="Premium version (commercial) of the Data Grid"
          />
        </CustomTreeItem>
        <CustomTreeItem itemId="pickers" label="Date and Time Pickers">
          <CustomTreeItem
            itemId="pickers-community"
            label="@mui/x-date-pickers"
            labelTooltip="Community version (MIT) of the Date and Time Pickers"
          />
          <CustomTreeItem
            itemId="pickers-pro"
            label="@mui/x-date-pickers-pro"
            labelTooltip="Pro version (commercial) of the Date and Time Pickers"
          />
        </CustomTreeItem>
        <CustomTreeItem itemId="charts" label="Charts">
          <CustomTreeItem
            itemId="charts-community"
            label="@mui/x-charts"
            labelTooltip="Community version (MIT) of the Charts"
          />
        </CustomTreeItem>
        <CustomTreeItem itemId="tree-view" label="Tree View">
          <CustomTreeItem
            itemId="tree-view-community"
            label="@mui/x-tree-view"
            labelTooltip="Community version (MIT) of the Tree View"
          />
        </CustomTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
