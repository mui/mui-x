import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'root',
  children: [
    { id: 'Documents', value: 40 },
    { id: 'Photos', value: 30 },
    { id: 'Music', value: 20 },
    { id: 'Videos', value: 18 },
    { id: 'Apps', value: 12 },
    { id: 'Other', value: 6 },
  ],
};

export default function TreemapLabels() {
  const [showLabels, setShowLabels] = React.useState(true);

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <FormControlLabel
        control={
          <Switch
            checked={showLabels}
            onChange={(event) => setShowLabels(event.target.checked)}
          />
        }
        label="Show labels"
      />
      <Treemap series={{ data, nodeOptions: { showLabels } }} height={300} />
    </Stack>
  );
}
