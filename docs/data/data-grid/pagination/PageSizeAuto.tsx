import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

export default function PageSizeAuto() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [height, setHeight] = React.useState(400);

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <FormControl fullWidth>
        <InputLabel
          htmlFor="main-grouping-criteria"
          id="ain-grouping-criteria-label"
        >
          Height of the container
        </InputLabel>
        <Select
          label="Main Grouping Criteria"
          onChange={(e) => setHeight(Number(e.target.value))}
          value={height}
          id="main-grouping-criteria"
          labelId="main-grouping-criteria-label"
        >
          <MenuItem value="300">300px</MenuItem>
          <MenuItem value="400">400px</MenuItem>
          <MenuItem value="500">500px</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height, width: '100%' }}>
        <DataGrid autoPageSize pagination {...data} />
      </div>
    </Stack>
  );
}
