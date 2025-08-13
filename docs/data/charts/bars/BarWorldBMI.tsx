import * as React from 'react';
import { BarChart, BarChartProps, barElementClasses } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { type } from 'doctrine';
import { countryData, oecdCountries } from '../dataset/countryData';
import worldBmi from '../dataset/worldBmi.json';

const oecdBmi = Object.fromEntries(
  Object.entries(worldBmi).filter(([country]) => oecdCountries.includes(country)),
);

/* Source: https://ourworldindata.org/obesity */
const menSortedBmi = Object.entries(oecdBmi)
  .map(([country, value]) => ({
    country,
    bmi: value.male,
  }))
  .sort((a, b) => a.bmi - b.bmi);
const womenSortedBmi = Object.entries(oecdBmi)
  .map(([country, value]) => ({
    country,
    bmi: value.female,
  }))
  .sort((a, b) => a.bmi - b.bmi);
const menCountries = Object.keys(oecdBmi);
const womenCountries = Object.keys(oecdBmi);
const menData = Object.values(oecdBmi).map((value) => value.male);
const womenData = Object.values(oecdBmi).map((value) => value.female);

const bmiFormatter = (value: number | null) => value!.toFixed(2);

const settings = {
  height: 600,
  xAxis: [{ label: 'Body Mass Index', min: 0, max: 30 }],
  layout: 'horizontal',
  slotProps: {
    legend: {
      position: { vertical: 'bottom' },
    },
  },
} satisfies Partial<BarChartProps>;

const menSeries = [
  {
    label: 'Men',
    data: menSortedBmi.map((v) => v.bmi),
    color: 'url(#bmi-gradient)',
    valueFormatter: bmiFormatter,
    stack: 'bmi',
  },
];
const womenSeries = [
  {
    label: 'Women',
    data: womenSortedBmi.map((v) => v.bmi),
    color: 'url(#bmi-gradient)',
    valueFormatter: bmiFormatter,
    stack: 'bmi',
  },
];

export default function BarGradientUserSpace() {
  const [gender, setGender] = React.useState('male');

  return (
    <Stack width="100%">
      <Typography variant="h6" textAlign="center">
        Mean Body Mass Index in OECD Countries (2016)
      </Typography>

      <FormControl fullWidth>
        <FormLabel id="gender-label">Gender</FormLabel>
        <RadioGroup
          row
          aria-labelledby="gender-label"
          name="gender"
          value={gender}
          onChange={(event) => setGender(event.target.value as 'male' | 'female')}
        >
          <FormControlLabel value="male" control={<Radio />} label="Men" />
          <FormControlLabel value="female" control={<Radio />} label="Women" />
        </RadioGroup>
      </FormControl>

      <BarChart
        {...settings}
        yAxis={[
          {
            data: (gender === 'male' ? menSortedBmi : womenSortedBmi).map(
              (v) => v.country,
            ),
            valueFormatter: (value: keyof typeof countryData) =>
              countryData[value].country,
            width: 100,
          },
        ]}
        series={gender === 'male' ? menSeries : womenSeries}
        sx={{
          [`.${barElementClasses.root}`]: {
            fill: 'url(#bmi-gradient-user-space)',
          },
        }}
      >
        <Gradient id="bmi-gradient" />
        <Gradient id="bmi-gradient-user-space" gradientUnits="userSpaceOnUse" />
      </BarChart>
      <Typography variant="caption">Source: Our World in Data</Typography>
    </Stack>
  );
}

function Gradient(props: React.SVGProps<SVGLinearGradientElement>) {
  return (
    <linearGradient {...props} x1="220" y1="0%" x2="600" y2="0%">
      <stop offset="0" stopColor="green" />
      <stop offset="0.61666" stopColor="green" />
      <stop offset="0.61667" stopColor="blue" />
      <stop offset="0.83333" stopColor="blue" />
      <stop offset="0.83334" stopColor="red" />
      <stop offset="1" stopColor="red" />
    </linearGradient>
  );
}
