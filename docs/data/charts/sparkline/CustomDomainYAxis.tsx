import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const settings = {
  valueFormatter: (value: number | null) => `${value}%`,
  height: 100,
  showTooltip: true,
  showHighlight: true,
  data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91],
  margin: { top: 10, bottom: 20, left: 5, right: 5 },
  sx: (theme: Theme) => ({
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  }),
};

// Extend a value to match a multiple of the step.
function extend(value: number, step: number) {
  if (value > 0) {
    // If >0 go to the next step
    return step * Math.ceil(value / step);
  }
  // If <0 go to the previous step
  return step * Math.floor(value / step);
}

const yRange = {
  nice: '-100, 100',
  strict: '-15, 92',
  function: '-20, 100',
};
export default function CustomDomainYAxis() {
  const [domainLimitKey, setDomainLimitKey] = React.useState<
    'nice' | 'strict' | 'function'
  >('nice');

  const domainLimit =
    domainLimitKey === 'function'
      ? (min: number, max: number) => ({
          min: extend(min, 10),
          max: extend(max, 10),
        })
      : domainLimitKey;
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Stack direction="row" alignItems="baseline" justifyContent="space-between">
        <TextField
          select
          value={domainLimitKey}
          onChange={(event) =>
            setDomainLimitKey(event.target.value as 'nice' | 'strict' | 'function')
          }
          label="domain limit"
          sx={{ minWidth: 150, mb: 2 }}
        >
          <MenuItem value="nice">nice</MenuItem>
          <MenuItem value="strict">strict</MenuItem>
          <MenuItem value="function">function</MenuItem>
        </TextField>
        <Typography>y-axis range: {yRange[domainLimitKey]}</Typography>
      </Stack>
      <Stack
        sx={{
          width: '100%',
        }}
        direction="row"
        spacing={2}
      >
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart {...settings} yAxis={{ domainLimit }} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart plotType="bar" {...settings} yAxis={{ domainLimit }} />
        </Box>
      </Stack>
    </Box>
  );
}
