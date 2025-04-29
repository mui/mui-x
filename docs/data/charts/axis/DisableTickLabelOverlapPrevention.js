import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';

export default function DisableTickLabelOverlapPrevention() {
  const [invertLayout, setInvertLayout] = React.useState(false);
  const [disableTickLabelOverlapPrevention, setDisableTickLabelOverlapPrevention] =
    React.useState(false);
  const xAxis = [
    {
      scaleType: 'band',
      dataKey: 'label',
      label: 'Label',
      disableTickLabelOverlapPrevention,
      width: 48,
    },
  ];

  const yAxis = [
    {
      disableTickLabelOverlapPrevention,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox onChange={(event) => setInvertLayout(event.target.checked)} />
          }
          label="Invert layout"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={disableTickLabelOverlapPrevention}
          control={
            <Checkbox
              onChange={(event) =>
                setDisableTickLabelOverlapPrevention(event.target.checked)
              }
            />
          }
          label="Disable label overlap prevention"
          labelPlacement="end"
        />
      </Stack>

      <BarChart
        xAxis={invertLayout ? yAxis : xAxis}
        height={300}
        dataset={data}
        series={[
          { dataKey: 'x', label: 'Series A' },
          { dataKey: 'y', label: 'Series B' },
        ]}
        hideLegend
        layout={invertLayout ? 'horizontal' : 'vertical'}
        yAxis={invertLayout ? xAxis : yAxis}
      />
    </Box>
  );
}

const data = [
  { label: 'P0001', x: 10.01, y: 10.02 },
  { label: 'P0002', x: 10.03, y: 10.01 },
  { label: 'P0003', x: 10.02, y: 10.04 },
  { label: 'P0004', x: 10.04, y: 10.03 },
  { label: 'P0005', x: 10.01, y: 10.05 },
  { label: 'P0006', x: 10.05, y: 10.02 },
  { label: 'P0007', x: 10.03, y: 10.04 },
  { label: 'P0008', x: 10.02, y: 10.03 },
  { label: 'P0009', x: 10.04, y: 10.01 },
  { label: 'P0010', x: 10.05, y: 10.04 },
  { label: 'P0011', x: 10.06, y: 10.03 },
  { label: 'P0012', x: 10.07, y: 10.02 },
  { label: 'P0013', x: 10.06, y: 10.05 },
  { label: 'P0014', x: 10.08, y: 10.04 },
  { label: 'P0015', x: 10.07, y: 10.06 },
  { label: 'P0016', x: 10.09, y: 10.05 },
  { label: 'P0017', x: 10.08, y: 10.03 },
  { label: 'P0018', x: 10.1, y: 10.04 },
  { label: 'P0019', x: 10.09, y: 10.02 },
  { label: 'P0020', x: 10.11, y: 10.03 },
  { label: 'P0021', x: 10.12, y: 10.04 },
  { label: 'P0022', x: 10.11, y: 10.05 },
  { label: 'P0023', x: 10.13, y: 10.03 },
  { label: 'P0024', x: 10.12, y: 10.02 },
  { label: 'P0025', x: 10.14, y: 10.04 },
  { label: 'P0026', x: 10.15, y: 10.03 },
  { label: 'P0027', x: 10.14, y: 10.05 },
  { label: 'P0028', x: 10.16, y: 10.04 },
  { label: 'P0029', x: 10.15, y: 10.02 },
  { label: 'P0030', x: 10.17, y: 10.03 },
  { label: 'P0031', x: 10.18, y: 10.04 },
  { label: 'P0032', x: 10.17, y: 10.05 },
  { label: 'P0033', x: 10.19, y: 10.03 },
  { label: 'P0034', x: 10.18, y: 10.02 },
  { label: 'P0035', x: 10.2, y: 10.04 },
  { label: 'P0036', x: 10.21, y: 10.03 },
  { label: 'P0037', x: 10.2, y: 10.05 },
  { label: 'P0038', x: 10.22, y: 10.04 },
  { label: 'P0039', x: 10.21, y: 10.02 },
  { label: 'P0040', x: 10.23, y: 10.03 },
  { label: 'P0041', x: 10.24, y: 10.04 },
  { label: 'P0042', x: 10.23, y: 10.05 },
  { label: 'P0043', x: 10.25, y: 10.03 },
  { label: 'P0044', x: 10.24, y: 10.02 },
  { label: 'P0045', x: 10.26, y: 10.04 },
  { label: 'P0046', x: 10.27, y: 10.03 },
  { label: 'P0047', x: 10.26, y: 10.05 },
  { label: 'P0048', x: 10.28, y: 10.04 },
  { label: 'P0049', x: 10.27, y: 10.02 },
  { label: 'P0050', x: 10.29, y: 10.03 },
];
