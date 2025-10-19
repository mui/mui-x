import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

export default function SankeyControlledHighlight() {
  const [highlightedItem, setHighlightedItem] = React.useState({
    type: 'sankey',
    seriesId: 'auto-generated-id',
    subType: 'node',
    nodeId: 'A',
  });

  const handleHighlightChange = (item) => {
    setHighlightedItem(item);
  };

  const handleToggleChange = (_event, newValue) => {
    if (newValue === null) {
      setHighlightedItem(null);
      return;
    }

    if (newValue.startsWith('node-')) {
      const nodeId = newValue.replace('node-', '');
      setHighlightedItem({
        type: 'sankey',
        seriesId: 'auto-generated-id',
        subType: 'node',
        nodeId,
      });
    } else if (newValue.startsWith('link-')) {
      const [source, target] = newValue.replace('link-', '').split('-');
      setHighlightedItem({
        type: 'sankey',
        seriesId: 'auto-generated-id',
        subType: 'link',
        sourceId: source,
        targetId: target,
      });
    }
  };

  const getCurrentValue = () => {
    if (!highlightedItem) {
      return null;
    }
    if (highlightedItem.subType === 'node') {
      return `node-${highlightedItem.nodeId}`;
    }
    return `link-${highlightedItem.sourceId}-${highlightedItem.targetId}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Controlled Highlighting</FormLabel>
        <ToggleButtonGroup
          value={getCurrentValue()}
          exclusive
          onChange={handleToggleChange}
          aria-label="highlight control"
          size="small"
        >
          <ToggleButton value="node-A" aria-label="highlight node A">
            Node A
          </ToggleButton>
          <ToggleButton value="node-C" aria-label="highlight node C">
            Node C
          </ToggleButton>
          <ToggleButton value="node-E" aria-label="highlight node E">
            Node E
          </ToggleButton>
          <ToggleButton value="link-A-C" aria-label="highlight link A to C">
            Link A→C
          </ToggleButton>
          <ToggleButton value="link-B-D" aria-label="highlight link B to D">
            Link B→D
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <SankeyChart
        series={{
          data: {
            nodes: [
              { id: 'A', label: 'Node A', color: '#3b82f6' },
              { id: 'B', label: 'Node B', color: '#10b981' },
              { id: 'C', label: 'Node C', color: '#f59e0b' },
              { id: 'D', label: 'Node D', color: '#ef4444' },
              { id: 'E', label: 'Node E', color: '#8b5cf6' },
            ],
            links: [
              { source: 'A', target: 'C', value: 30 },
              { source: 'A', target: 'D', value: 20 },
              { source: 'B', target: 'C', value: 25 },
              { source: 'B', target: 'D', value: 15 },
              { source: 'C', target: 'E', value: 35 },
              { source: 'D', target: 'E', value: 20 },
            ],
          },
          nodeOptions: {
            highlight: 'links',
            fade: 'global',
          },
          linkOptions: {
            highlight: 'nodes',
            fade: 'global',
          },
        }}
        height={300}
        highlightedItem={highlightedItem}
        onHighlightChange={handleHighlightChange}
      />
    </Box>
  );
}
