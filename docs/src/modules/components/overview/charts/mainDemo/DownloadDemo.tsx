import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { lineElementClasses } from '@mui/x-charts/LineChart';
import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
// Import data
import dataMaterial from '../data/material.json';
import dataCharts from '../data/x-charts.json';
import dataGrid from '../data/x-data-grid.json';
import dataPickers from '../data/x-date-pickers.json';
import { shortMonthYearFormatter } from '../shortMonthYearFormatter';
import { generateDataset, Versions } from './generateDataset';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

const versions: Record<string, Versions[]> = {
  '@mui/material': ['5', '6', '7'],
  '@mui/x-data-grid': ['5', '6', '7', '8'],
  '@mui/x-date-pickers': ['5', '6', '7', '8'],
  '@mui/x-charts': ['6', '7', '8'],
};

const packages = {
  '@mui/material': generateDataset(dataMaterial),
  '@mui/x-data-grid': generateDataset(dataGrid),
  '@mui/x-date-pickers': generateDataset(dataPickers),
  '@mui/x-charts': generateDataset(dataCharts),
};

const IntlAbsolute = new Intl.NumberFormat('en-US');
const valueFormatter = (value: number | null) => {
  if (value !== null) {
    return IntlAbsolute.format(value);
  }
  return value;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format;

const IntlNumber = new Intl.NumberFormat('en-US', { notation: 'compact' });
const IntlPercent = new Intl.NumberFormat('en-US', { style: 'percent' });
const percentValueFormatter = (value: number | null) => {
  if (value !== null) {
    return IntlPercent.format(value / 100);
  }
  return value;
};

export default function DownloadDemo() {
  const [selectedPackage, setSelectedPackage] =
    React.useState<keyof typeof packages>('@mui/x-charts');

  const [selectedFormat, setSelectedFormat] = React.useState<'absolute' | 'relative'>('absolute');

  return (
    <Stack spacing={1} direction="column" sx={{ height: '100%', minHeight: 0 }}>
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
          <MenuItem value="absolute">Absolute</MenuItem>
          <MenuItem value="relative">Relative</MenuItem>
        </Select>
      </Stack>

      <div style={{ flex: 1, minHeight: 300 }}>
        <LineChartPro
          skipAnimation
          dataset={packages[selectedPackage]}
          series={versions[selectedPackage].map((v) => ({
            id: v,
            dataKey: `${v}${selectedFormat === 'relative' ? '_percent' : ''}`,
            stack: 'v',
            area: true,
            curve: 'linear',
            label: `v${v}`,
            valueFormatter: selectedFormat === 'relative' ? percentValueFormatter : valueFormatter,
          }))}
          xAxis={[
            {
              dataKey: 'date',
              scaleType: 'time',
              domainLimit: 'strict',
              zoom: true,
              height: 30,
              tickNumber: 5,
              valueFormatter: (value: Date, context) =>
                context.location === 'tick' ? shortMonthYearFormatter(value) : dateFormatter(value),
            },
          ]}
          yAxis={[
            {
              min: 0,
              zoom: true,
              max: selectedFormat === 'relative' ? 100 : undefined,
              valueFormatter: IntlNumber.format,
            },
          ]}
          margin={{ left: 0, bottom: 0 }}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              strokeWidth: 1.5,
            },
            '& .MuiAreaElement-series-5': {
              fill: "url('#5')",
            },
            '& .MuiAreaElement-series-6': {
              fill: "url('#6')",
            },
            '& .MuiAreaElement-series-7': {
              fill: "url('#7')",
            },
            '& .MuiAreaElement-series-8': {
              fill: "url('#8')",
            },
          }}
        >
          {versions[selectedPackage].map((v, i) => (
            <AreaGradient color={rainbowSurgePalette('light')[i]} id={v} key={v} />
          ))}
        </LineChartPro>
      </div>
    </Stack>
  );
}
