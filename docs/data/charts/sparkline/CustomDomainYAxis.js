import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const settings = {
  valueFormatter: (v) => `${v}%`,
  height: 100,
  showTooltip: true,
  showHighlight: true,
};

// Extend a value to match a multiple of the step.
function extend(value, step) {
  if (value > 0) {
    // If >0 go to the next step
    return step * Math.ceil(value / step);
  }
  // If <0 go to the previous step
  return step * Math.floor(value / step);
}

const values = [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91];

export default function CustomDomainYAxis() {
  return (
    <Stack
      sx={(theme) => ({
        width: '100%',
        '& p': { mb: 1, mt: 2 },
        '& svg': {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.palette.divider,
        },
      })}
    >
      <Typography>
        <code>domainLimit=&quot;nice&quot;</code>, range from -100 to 100
      </Typography>
      <Stack
        sx={{
          width: '100%',
        }}
        direction="row"
        spacing={2}
      >
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart data={values} {...settings} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart plotType="bar" data={values} {...settings} />
        </Box>
      </Stack>
      <Typography>
        <code>domainLimit=&quot;strict&quot;</code>, range from -15 to 92
      </Typography>
      <Stack sx={{ width: '100%' }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={values}
            yAxis={{ domainLimit: 'strict' }}
            {...settings}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            plotType="bar"
            data={values}
            yAxis={{ domainLimit: 'strict' }}
            {...settings}
          />
        </Box>
      </Stack>
      <Typography>custom function, range from -50 to 100</Typography>
      <Stack sx={{ width: '100%' }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={values}
            yAxis={{
              domainLimit: ([min, max]) => [
                min - (Math.abs(min) % 50),
                max + 50 - (Math.abs(max) % 50),
              ],
            }}
            {...settings}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            plotType="bar"
            data={values}
            yAxis={{
              domainLimit: ([min, max]) => [extend(min, 50), extend(max, 50)],
            }}
            {...settings}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
