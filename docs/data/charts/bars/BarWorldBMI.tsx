import * as React from 'react';
import { BarChart, BarChartProps, barElementClasses } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
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

const bmiFormatter = (value: number | null) => value!.toFixed(2);

const settings = {
  height: 600,
  xAxis: [{ label: 'Body Mass Index', min: 0, max: 30 }],
  layout: 'horizontal',
  hideLegend: true,
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
  const [gradientUnits, setGradientUnits] = React.useState<
    'objectBoundingBox' | 'userSpaceOnUse'
  >('objectBoundingBox');

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
            data: (gender === 'male' ? menSortedBmi : womenSortedBmi).map(
              (v) => v.country,
            ),
            valueFormatter: (value: keyof typeof countryData) =>
              countryData[value].country,
            width: 100,
          },
        ]}
        series={gender === 'male' ? menSeries : womenSeries}
        sx={
          gradientUnits === 'userSpaceOnUse'
            ? {
                [`.${barElementClasses.root}`]: {
                  fill: 'url(#bmi-gradient-user-space)',
                },
              }
            : undefined
        }
      >
        <Gradient id="bmi-gradient" x1="0" x2="100%" />
        <Gradient
          id="bmi-gradient-user-space"
          gradientUnits="userSpaceOnUse"
          x1="200"
          x2="600"
        />
      </BarChart>
      <Typography variant="caption">Source: Our World in Data</Typography>
    </Stack>
  );
}

function Gradient(props: React.SVGProps<SVGLinearGradientElement>) {
  return (
    <linearGradient x1="0" y1="0%" x2="100%" y2="0%" {...props}>
      <stop offset="0" stopColor="#00f260" />
      <stop offset="1" stopColor="#0575e6" />
    </linearGradient>
  );
}
