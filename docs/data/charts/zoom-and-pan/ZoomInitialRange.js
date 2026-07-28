import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

// Time axis: calendar intervals, an absolute date range, a function, or a reset.
const linePresets = [
  {
    label: '5Y',
    code: "{ unit: 'year', step: 5 }",
    value: { unit: 'year', step: 5 },
  },
  {
    label: '10Y',
    code: "{ unit: 'year', step: 10 }",
    value: { unit: 'year', step: 10 },
  },
  {
    label: '2000s',
    code: '[new Date(2000, 0, 1), new Date(2010, 0, 1)]',
    value: [new Date(2000, 0, 1), new Date(2010, 0, 1)],
  },
  {
    label: 'First half',
    code: '() => ({ start: 0, end: 50 })',
    value: () => ({ start: 0, end: 50 }),
  },
  { label: 'All', code: 'null', value: null },
];

// Band axis: a range expressed with the axis values themselves, or a reset.
const barPresets = [
  { label: 'H1', code: "['Jan', 'Jun']", value: ['Jan', 'Jun'] },
  { label: 'H2', code: "['Jul', 'Dec']", value: ['Jul', 'Dec'] },
  { label: 'Spring–Summer', code: "['Mar', 'Aug']", value: ['Mar', 'Aug'] },
  { label: 'All', code: 'null', value: null },
];

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const sales = [42, 38, 55, 61, 73, 88, 95, 91, 70, 58, 49, 44];

export default function ZoomInitialRange() {
  const [chartType, setChartType] = React.useState('line');
  const [label, setLabel] = React.useState('10Y');

  const presets = chartType === 'line' ? linePresets : barPresets;
  const preset = presets.find((item) => item.label === label) ?? presets[0];

  const handleChartType = (_event, nextType) => {
    if (nextType === null) {
      return;
    }
    setChartType(nextType);
    // Switch to a preset that exists for the newly selected chart.
    setLabel((nextType === 'line' ? linePresets : barPresets)[1].label);
  };

  const initialZoom = [{ axisId: 'x', value: preset.value }];

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={chartType}
          onChange={handleChartType}
        >
          <ToggleButton value="line">Line</ToggleButton>
          <ToggleButton value="bar">Bar</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          select
          size="small"
          label="Initial zoom"
          value={preset.label}
          onChange={(event) => setLabel(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          {presets.map((item) => (
            <MenuItem key={item.label} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <HighlightedCode
        code={`initialZoom={[{ axisId: 'x', value: ${preset.code} }]}`}
        language="jsx"
        copyButtonHidden
      />
      {chartType === 'line' ? (
        <LineChartPro
          // Remount the chart so `initialZoom` is applied again when the preset changes.
          key={`line-${preset.label}`}
          dataset={dataset}
          xAxis={[
            {
              id: 'x',
              scaleType: 'time',
              dataKey: 'date',
              zoom: true,
              tickNumber: 5,
            },
          ]}
          yAxis={[
            {
              width: 60,
              valueFormatter: (value) => `$${(value / 1000).toFixed(0)}k`,
            },
          ]}
          series={[
            { dataKey: 'fr', label: 'France' },
            { dataKey: 'gb', label: 'UK' },
            { dataKey: 'dl', label: 'Germany' },
          ]}
          height={300}
          initialZoom={initialZoom}
        />
      ) : (
        <BarChartPro
          // Remount the chart so `initialZoom` is applied again when the preset changes.
          key={`bar-${preset.label}`}
          xAxis={[{ id: 'x', scaleType: 'band', data: months, zoom: true }]}
          series={[{ label: 'Sales', data: sales }]}
          height={300}
          initialZoom={initialZoom}
        />
      )}
    </Stack>
  );
}
