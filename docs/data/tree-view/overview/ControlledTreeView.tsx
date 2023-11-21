import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from 'packages/x-tree-view/src/SimpleTreeItem';

export default function ControlledTreeView() {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ['1', '5', '6', '7'] : [],
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? ['1', '2', '3', '4', '5', '6', '7', '8', '9'] : [],
    );
  };

  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
        <Button onClick={handleSelectClick}>
          {selected.length === 0 ? 'Select all' : 'Unselect all'}
        </Button>
      </Box>
      <SimpleTreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        multiSelect
      >
        <SimpleTreeItem nodeId="1" label="Applications">
          <SimpleTreeItem nodeId="2" label="Calendar" />
          <SimpleTreeItem nodeId="3" label="Chrome" />
          <SimpleTreeItem nodeId="4" label="Webstorm" />
        </SimpleTreeItem>
        <SimpleTreeItem nodeId="5" label="Documents">
          <SimpleTreeItem nodeId="6" label="MUI">
            <SimpleTreeItem nodeId="7" label="src">
              <SimpleTreeItem nodeId="8" label="index.js" />
              <SimpleTreeItem nodeId="9" label="tree-view.js" />
            </SimpleTreeItem>
          </SimpleTreeItem>
        </SimpleTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
