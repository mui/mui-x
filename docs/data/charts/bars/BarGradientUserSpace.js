import * as React from 'react';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/* Source: https://www.businessofapps.com/data/netflix-statistics/ */
const dates = [
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

const data = [
  21.5, 25.71, 35.63, 47.99, 62.71, 79.9, 99.04, 124.35, 151.56, 192.95, 209, 220.6,
  238.3, 277.6,
].map((value) => value * 1_000_000);
const growthData = data.map((value, index) =>
  index === 0 ? 0 : (value - data[index - 1]) / value,
);

const subscribersFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const subscriberGrowthFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const settings = {
  height: 400,
  xAxis: [{ data: dates, valueFormatter: (value) => `${value}` }],
  yAxis: [
    {
      id: 'subscribers',
      label: 'Subscribers',
      valueFormatter: (value) => subscribersFormatter.format(value),
    },
    {
      id: 'growth',
      position: 'right',
      label: 'Subscriber Growth',
      valueFormatter: (value) => subscriberGrowthFormatter.format(value),
    },
  ],
  slotProps: {
    legend: {
      position: { vertical: 'bottom' },
    },
  },
};

export default function BarGradientUserSpace() {
  return (
    <Stack width="100%">
      <Typography variant="h6" textAlign="center">
        Netflix Subscriber Growth (2011-2024)
      </Typography>
      <BarChart
        {...settings}
        series={[
          { label: 'Subscribers', data, yAxisId: 'subscribers' },
          {
            id: 'subscriber-growth',
            label: 'Subscriber Growth',
            data: growthData,
            color: 'url(#subscriber-growth-gradient)',
            yAxisId: 'growth',
            valueFormatter: (value) => subscriberGrowthFormatter.format(value),
          },
        ]}
        sx={{
          [`[data-series="subscriber-growth"] .${barElementClasses.root}`]: {
            fill: 'url(#subscriber-growth-gradient-user-space)',
          },
        }}
      >
        <Gradient id="subscriber-growth-gradient" />
        <Gradient
          id="subscriber-growth-gradient-user-space"
          gradientUnits="userSpaceOnUse"
        />
      </BarChart>
      <Typography variant="caption">Source: businessofapps.com</Typography>
    </Stack>
  );
}

function Gradient(props) {
  return (
    <linearGradient {...props} x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0" stopColor="white" />
      <stop offset="1" stopColor="green" />
    </linearGradient>
  );
}
