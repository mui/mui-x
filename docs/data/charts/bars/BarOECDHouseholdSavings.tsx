import * as React from 'react';
import { BarChart, BarChartProps, barElementClasses } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { countryData } from '../dataset/countryData';
import householdSavings from '../dataset/oecdHouseholdSavings2024.json';

/* Source: https://www.oecd.org/en/data/indicators/household-savings.html */
const savings = Object.entries(householdSavings)
  .map(([country, value]) => ({
    country,
    value,
  }))
  .sort((a, b) => a.value - b.value);

const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const settings = {
  height: 600,
  xAxis: [{ label: 'Household Savings (%)' }],
  layout: 'horizontal',
  hideLegend: true,
} satisfies Partial<BarChartProps>;

export default function BarOECDHouseholdSavings() {
  const [gradientUnits, setGradientUnits] = React.useState<
    'objectBoundingBox' | 'userSpaceOnUse'
  >('userSpaceOnUse');

  return (
    <Stack width="100%">
      <Typography variant="h6" textAlign="center">
        Household Savings in OECD Countries (2016)
      </Typography>

      <FormControl fullWidth>
        <FormLabel id="gradient-units-label">Gradient Units</FormLabel>
        <RadioGroup
          row
          aria-labelledby="gradient-units-label"
          name="gradient-units"
          value={gradientUnits}
          onChange={(event) =>
            setGradientUnits(
              event.target.value as 'objectBoundingBox' | 'userSpaceOnUse',
            )
          }
        >
          <FormControlLabel
            value="objectBoundingBox"
            control={<Radio />}
            label="objectBoundingBox (default)"
          />
          <FormControlLabel
            value="userSpaceOnUse"
            control={<Radio />}
            label="userSpaceOnUse"
          />
        </RadioGroup>
      </FormControl>

      <BarChart
        {...settings}
        yAxis={[
          {
            data: savings.map((v) => v.country),
            valueFormatter: (value: keyof typeof countryData) =>
              countryData[value].country,
            width: 100,
          },
        ]}
        series={[
          {
            label: 'Household Savings',
            data: savings.map((v) => v.value),
            color: 'url(#savings-gradient)',
            valueFormatter: (value) => percentageFormatter.format(value! / 100),
          },
        ]}
        sx={
          gradientUnits === 'userSpaceOnUse'
            ? {
                [`.${barElementClasses.root}`]: {
                  fill: 'url(#savings-gradient-user-space)',
                },
              }
            : undefined
        }
      >
        <Gradient id="savings-gradient" x1="0" x2="100%" />
        <Gradient
          id="savings-gradient-user-space"
          gradientUnits="userSpaceOnUse"
          x1="150"
          x2="100%"
        />
      </BarChart>
      <Typography variant="caption">Source: Our World in Data</Typography>
    </Stack>
  );
}

function Gradient(props: React.SVGProps<SVGLinearGradientElement>) {
  return (
    <linearGradient x1="0" y1="0%" x2="100%" y2="0%" {...props}>
      <stop offset="0" stopColor="#ff2f1b" />
      <stop offset="0.5" stopColor="#fce202" />
      <stop offset="1" stopColor="#02b32b" />
    </linearGradient>
  );
}
