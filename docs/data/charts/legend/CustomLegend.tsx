import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useLegend } from '@mui/x-charts/hooks';
import { LineChart } from '@mui/x-charts/LineChart';

type IconProps = {
  color: string;
  size: number;
};

function LineWithMark({ color, size }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
    >
      <path d="M 1 12.5 L 7 12.5 M 17 12.5 L 23 12.5" />
      <circle cx={12} cy={12.5} r={5} />
    </svg>
  );
}

function DashedLine({ color, size }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth={3}
      fill="none"
    >
      <path d="M 1 12.5 L 23 12.5" strokeDasharray="5 3" />
    </svg>
  );
}

function MyCustomLegend() {
  const { items } = useLegend();
  return (
    <Stack direction="row" gap={3}>
      {items.map((item) => {
        const { label, id, color, seriesId } = item;
        return (
          <Box key={id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {seriesId === 'avg' ? (
              <DashedLine color={color} size={20} />
            ) : (
              <LineWithMark color={color} size={20} />
            )}
            <Typography sx={{ display: 'inline-block' }}>{`${label}`}</Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

const dataset = [
  { month: 'Jan', '1991_2020_avg': 4.1, 2023: 3.9 },
  { month: 'Fev', '1991_2020_avg': 4.7, 2023: 8.9 },
  { month: 'Mar', '1991_2020_avg': 7.5, 2023: 9.5 },
  { month: 'Apr', '1991_2020_avg': 10.6, 2023: 11.5 },
  { month: 'May', '1991_2020_avg': 13.8, 2023: 15.5 },
  { month: 'Jun', '1991_2020_avg': 16.7, 2023: 16.4 },
  { month: 'Jul', '1991_2020_avg': 18.9, 2023: 19.5 },
  { month: 'Aug', '1991_2020_avg': 18.8, 2023: 20.5 },
  { month: 'Sep', '1991_2020_avg': 15.8, 2023: 16.4 },
  { month: 'Oct', '1991_2020_avg': 11.9, 2023: 13.2 },
  { month: 'Nov', '1991_2020_avg': 7.6, 2023: 8.1 },
  { month: 'Dec', '1991_2020_avg': 4.7, 2023: 6.1 },
];

export default function CustomLegend() {
  const theme = useTheme();

  return (
    <Box
      sx={{ height: 300, width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <LineChart
        dataset={dataset}
        series={[
          {
            id: 'avg',
            label: 'temp. avg. 1991-2020 (°C)',
            dataKey: '1991_2020_avg',
            showMark: false,
            color: theme.palette.text.primary,
          },
          {
            id: '2023-temp',
            label: 'temp. 2023 (°C)',
            dataKey: '2023',
            color: theme.palette.primary.main,
          },
        ]}
        xAxis={[{ dataKey: 'month', scaleType: 'band', id: 'x-axis' }]}
        sx={{
          [`& .MuiLineElement-series-avg`]: {
            strokeDasharray: '10 5',
          },
        }}
        slots={{ legend: MyCustomLegend }}
      />
    </Box>
  );
}
