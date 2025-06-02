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

type Versions = '5' | '6' | '7' | '8';

type DataItem = {
  date: Date;
} & Partial<Record<Versions, number | undefined | null>> &
  Partial<Record<`${Versions}_percent`, number | undefined | null>>;

const addRelativeValue = (versions: Versions[]) => (item: DataItem) => {
  const sum = versions.reduce((a, version: Versions) => a + (item[version] ?? 0), 0);

  for (const version of versions) {
    if (version in item) {
      item[`${version}_percent`] = (100 * (item[version] ?? 0)) / sum;
    } else {
      item[version] = null;
      item[`${version}_percent`] = null;
    }
  }
  return item;
};

const versions: Record<string, Versions[]> = {
  '@mui/material': ['5', '6', '7'],
  '@mui/x-data-grid': ['5', '6', '7', '8'],
  '@mui/x-date-pickers': ['5', '6', '7', '8'],
  '@mui/x-charts': ['6', '7', '8'],
};

const packages = {
  '@mui/material': dataMaterial.map((item) =>
    addRelativeValue(versions['@mui/material'])({ ...item, date: new Date(item.date) }),
  ),
  '@mui/x-data-grid': dataDataGrid.map((item) =>
    addRelativeValue(versions['@mui/x-data-grid'])({ ...item, date: new Date(item.date) }),
  ),
  '@mui/x-date-pickers': dataPickers.map((item) =>
    addRelativeValue(versions['@mui/x-date-pickers'])({ ...item, date: new Date(item.date) }),
  ),
  '@mui/x-charts': dataCharts.map((item) =>
    addRelativeValue(versions['@mui/x-charts'])({ ...item, date: new Date(item.date) }),
  ),
} as const;

const valueFormatter = (value: number | null) => {
  if (value !== null) {
    return value.toLocaleString();
  }
  return value;
};

const IntlPercent = new Intl.NumberFormat(undefined, { style: 'percent' });
const percentValueFormatter = (value: number | null) => {
  if (value !== null) {
    return IntlPercent.format(value / 100);
  }
  return value;
};

export default function DownloadDemo() {
  const [selectedPackage, setSelectedPackage] =
    React.useState<keyof typeof packages>('@mui/material');

  const [selectedFormat, setSelectedFormat] = React.useState<'absolute' | 'relative'>('absolute');

  return (
    <Stack spacing={1} direction="column" sx={{ height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" width="100%">
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

        <Select
          size="small"
          sx={{ width: 200 }}
          value={selectedFormat}
          onChange={(event) => setSelectedFormat(event.target.value as 'absolute' | 'relative')}
        >
          <MenuItem value="absolute">absolute</MenuItem>
          <MenuItem value="relative">relative</MenuItem>
        </Select>
      </Stack>

      <div style={{ flexGrow: 1 }}>
        <LineChartPro
          skipAnimation
          dataset={packages[selectedPackage]}
          series={versions[selectedPackage].map((v) => ({
            dataKey: `${v}${selectedFormat === 'relative' ? '_percent' : ''}`,
            stack: 'v',
            area: true,
            showMark: false,
            label: `v${v}`,
            valueFormatter: selectedFormat === 'relative' ? percentValueFormatter : valueFormatter,
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
          yAxis={[
            { min: 0, width: 80, zoom: true, max: selectedFormat === 'relative' ? 100 : undefined },
          ]}
          margin={{ left: 0 }}
        />
      </div>
    </Stack>
  );
}
