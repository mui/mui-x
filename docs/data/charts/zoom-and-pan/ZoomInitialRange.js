import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
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

const tokenColor = {
  string: 'success.main',
  number: 'warning.main',
  keyword: 'secondary.main',
  key: 'primary.main',
  plain: 'text.primary',
};

/** Renders a one-line code snippet with token colors from the theme palette. */
function HighlightedCode({ code }) {
  const nodes = [];
  const tokenRegExp = /'[^']*'|[A-Za-z_]\w*|\d+\.?\d*/g;
  let lastIndex = 0;
  let tokenId = 0;
  let match = tokenRegExp.exec(code);

  while (match !== null) {
    const token = match[0];
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }

    const rest = code.slice(match.index + token.length);
    let type;
    if (token[0] === "'") {
      type = 'string';
    } else if (/^\d/.test(token)) {
      type = 'number';
    } else if (token === 'null' || token === 'new') {
      type = 'keyword';
    } else if (/^\s*:/.test(rest)) {
      type = 'key';
    } else {
      type = 'plain';
    }

    nodes.push(
      <Box key={tokenId} component="span" sx={{ color: tokenColor[type] }}>
        {token}
      </Box>,
    );
    tokenId += 1;
    lastIndex = match.index + token.length;
    match = tokenRegExp.exec(code);
  }
  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex));
  }

  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        px: 1.5,
        py: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
        fontSize: '0.8125rem',
        overflowX: 'auto',
      }}
    >
      <code>{nodes}</code>
    </Box>
  );
}

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
