import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
// Import data
import dataMaterial from '../data/@mui-material.json';
import dataCharts from '../data/@mui-x-charts.json';
import dataDataGrid from '../data/@mui-x-data-grid.json';
import dataPickers from '../data/@mui-x-date-pickers.json';

const packages = {
  '@mui/material': dataMaterial.map((item) => ({ ...item, date: new Date(item.date) })),
  '@mui/x-data-grid': dataDataGrid.map((item) => ({ ...item, date: new Date(item.date) })),
  '@mui/x-date-pickers': dataPickers.map((item) => ({ ...item, date: new Date(item.date) })),
  '@mui/x-charts': dataCharts.map((item) => ({ ...item, date: new Date(item.date) })),
} as const;

const versions = {
  '@mui/material': [5, 6, 7],
  '@mui/x-data-grid': [5, 6, 7, 8],
  '@mui/x-date-pickers': [5, 6, 7, 8],
  '@mui/x-charts': [6, 7, 8],
} as const;

const valueFormatter = (value: number | null) => {
  if (value !== null) {
    return value.toLocaleString();
  }
  return value;
};

export default function DownloadDemo() {
  const [selectedPackage, setSelectedPackage] =
    React.useState<keyof typeof packages>('@mui/material');

  return (
    <Stack spacing={1} direction="column" sx={{ height: '100%' }}>
      <Select
        size="small"
        sx={{ width: 200 }}
        value={selectedPackage}
        onChange={(event) => setSelectedPackage(event.target.value as keyof typeof packages)}
      >
        {Object.keys(packages).map((pkg) => (
          <MenuItem key={pkg} value={pkg}>
            {pkg}
          </MenuItem>
        ))}
      </Select>
      <LineChartPro
        skipAnimation
        dataset={packages[selectedPackage]}
        series={versions[selectedPackage].map((v) => ({
          dataKey: `${v}`,
          stack: 'v',
          area: true,
          showMark: false,
          label: `v${v}`,
          valueFormatter,
        }))}
        xAxis={[
          {
            dataKey: 'date',
            scaleType: 'time',
            disableTicks: true,
            domainLimit: 'strict',
            zoom: true,
          },
        ]}
        yAxis={[{ min: 0, width: 80, zoom: true }]}
        margin={{ left: 0 }}
      />
    </Stack>
  );
}
