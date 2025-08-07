import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses, lineElementClasses } from '@mui/x-charts/LineChart';
import data from './weekly-downloads.json';

export default function NpmSparkLine() {
  return (
    <Stack direction="row">
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          data={data.map((item) => item.downloads)}
          height={40}
          width={200}
          area
          showTooltip={false}
          margin={{ bottom: 0, top: 5, left: 4, right: 4 }}
          xAxis={{ data: data.map((item) => `${item.start} to ${item.end}`) }}
          yAxis={{
            domainLimit: (_, maxValue) => ({ min: 0, max: maxValue }),
          }}
          color="rgb(137, 86, 255)"
          sx={{
            [`& .${areaElementClasses.root}`]: { opacity: 0.2 },
            [`& .${lineElementClasses.root}`]: { strokeWidth: 2 },
          }}
        />
      </Box>
    </Stack>
  );
}
