import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const highlights = ['node', 'children', 'parents', 'parent', 'child'];

const fades = ['none', 'global', 'node', 'children', 'parents'];

const data = {
  id: 'root',
  children: [
    {
      id: 'Tech',
      children: [
        {
          id: 'Frontend',
          children: [
            { id: 'React', value: 30 },
            { id: 'Vue', value: 15 },
          ],
        },
        {
          id: 'Backend',
          children: [
            { id: 'Node', value: 25 },
            { id: 'Go', value: 12 },
          ],
        },
      ],
    },
    {
      id: 'Design',
      children: [
        {
          id: 'UX',
          children: [
            { id: 'Research', value: 12 },
            { id: 'Prototyping', value: 8 },
          ],
        },
      ],
    },
  ],
};

export default function TreemapHighlight() {
  const [highlight, setHighlight] = React.useState('children');
  const [fade, setFade] = React.useState('global');

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          select
          label="Highlight"
          value={highlight}
          onChange={(event) => setHighlight(event.target.value)}
          sx={{ minWidth: 160 }}
        >
          {highlights.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Fade"
          value={fade}
          onChange={(event) => setFade(event.target.value)}
          sx={{ minWidth: 160 }}
        >
          {fades.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Treemap series={{ data, nodeOptions: { highlight, fade } }} height={360} />
    </Stack>
  );
}
