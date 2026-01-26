import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

const ageGroups = [
  '100+ yrs',
  '95-99 yrs',
  '90-94 yrs',
  '85-89 yrs',
  '80-84 yrs',
  '75-79 yrs',
  '70-74 yrs',
  '65-69 yrs',
  '60-64 yrs',
  '55-59 yrs',
  '50-54 yrs',
  '45-49 yrs',
  '40-44 yrs',
  '35-39 yrs',
  '30-34 yrs',
  '25-29 yrs',
  '20-24 yrs',
  '15-19 yrs',
  '10-14 yrs',
  '5-9 yrs',
  '0-4 yrs',
];

const male = [
  1139, 8291, 50323, 201240, 476263, 696606, 1012668, 1478069, 2042614, 2068112,
  2258061, 2061862, 2067075, 1808706, 1796779, 1933726, 1620461, 1183580, 1189663,
  1097221, 766227,
];

const female = [
  5770, 36739, 168603, 445118, 762492, 899933, 1152098, 1585781, 2105499, 2045845,
  2231491, 2000130, 1967944, 1673805, 1593655, 1695058, 1484776, 1104293, 1122176,
  1044863, 727814,
];

const numberFormatter = Intl.NumberFormat('en-US', {
  useGrouping: true,
});
const numberWithSuffixFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});
const valueFormatter = (population) =>
  population ? `${numberFormatter.format(Math.abs(population))}` : '';

export default function PopulationPyramidBarChart() {
  return (
    <Stack width="100%" height={550} sx={{ mx: [0, 4] }}>
      <Typography
        variant="h6"
        component="span"
        textAlign="center"
        data-hide-overview
      >
        South Korea Population Pyramid - 2022
      </Typography>
      <BarChart
        layout="horizontal"
        margin={{ right: 0, left: 0 }}
        series={[
          {
            data: male.map((population) => -population),
            label: 'Male',
            type: 'bar',
            valueFormatter,
            stack: 'stack',
          },
          {
            data: female,
            label: 'Female',
            type: 'bar',
            valueFormatter,
            stack: 'stack',
          },
        ]}
        yAxis={[
          {
            data: ageGroups,
            width: 60,
            tickLabelInterval: (value, index) => index % 2 === 0,
            disableLine: true,
            disableTicks: true,
          },
        ]}
        xAxis={[
          {
            valueFormatter: (population) =>
              numberWithSuffixFormatter.format(Math.abs(population)),
            disableLine: true,
            disableTicks: true,
            domainLimit(min, max) {
              const extremum = Math.max(-min.valueOf(), max.valueOf());
              const roundedExtremum = Math.ceil(extremum / 100_000) * 100_000;
              return { min: -roundedExtremum, max: roundedExtremum };
            },
          },
        ]}
        grid={{ vertical: true }}
      />
      <Typography variant="caption">Source: KOSIS</Typography>
    </Stack>
  );
}
