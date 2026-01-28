import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';

export default function SankeyHighlighting() {
  const [nodeHighlight, setNodeHighlight] = React.useState('links');
  const [nodeFade, setNodeFade] = React.useState('global');
  const [linkHighlight, setLinkHighlight] = React.useState('links');
  const [linkFade, setLinkFade] = React.useState('global');

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <SankeyChart
          series={{
            data: {
              nodes: [
                { id: 'A', label: 'A' },
                { id: 'B', label: 'B' },
                { id: 'C', label: 'C' },
                { id: 'D', label: 'D' },
                { id: 'E', label: 'E' },
                { id: 'F', label: 'F' },
              ],
              links: [
                { source: 'A', target: 'D', value: 3 },
                { source: 'A', target: 'E', value: 4 },
                { source: 'B', target: 'D', value: 2 },
                { source: 'B', target: 'E', value: 3 },
                { source: 'C', target: 'E', value: 2 },
                { source: 'D', target: 'F', value: 5 },
                { source: 'E', target: 'F', value: 9 },
              ],
            },
            nodeOptions: {
              highlight: nodeHighlight,
              fade: nodeFade,
            },
            linkOptions: {
              highlight: linkHighlight,
              fade: linkFade,
            },
          }}
          height={300}
          margin={{ left: 80, right: 80 }}
        />
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <TextField
            select
            label="Node Highlight"
            value={nodeHighlight}
            onChange={(event) => setNodeHighlight(event.target.value)}
            fullWidth
          >
            <MenuItem value="nodes">nodes</MenuItem>
            <MenuItem value="links">links</MenuItem>
            <MenuItem value="incoming">incoming</MenuItem>
            <MenuItem value="outgoing">outgoing</MenuItem>
            <MenuItem value="none">none</MenuItem>
          </TextField>
          <TextField
            select
            label="Node Fade"
            value={nodeFade}
            onChange={(event) => setNodeFade(event.target.value)}
            fullWidth
          >
            <MenuItem value="global">global</MenuItem>
            <MenuItem value="none">none</MenuItem>
          </TextField>
        </Stack>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <TextField
            select
            label="Link Highlight"
            value={linkHighlight}
            onChange={(event) => setLinkHighlight(event.target.value)}
            fullWidth
          >
            <MenuItem value="links">links</MenuItem>
            <MenuItem value="nodes">nodes</MenuItem>
            <MenuItem value="source">source</MenuItem>
            <MenuItem value="target">target</MenuItem>
            <MenuItem value="none">none</MenuItem>
          </TextField>
          <TextField
            select
            label="Link Fade"
            value={linkFade}
            onChange={(event) => setLinkFade(event.target.value)}
            fullWidth
          >
            <MenuItem value="global">global</MenuItem>
            <MenuItem value="none">none</MenuItem>
          </TextField>
        </Stack>
      </Stack>
    </Stack>
  );
}
