import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const otherProps = {
  width: 400,
  height: 200,
  sx: {
    [`.${legendClasses.root}`]: {
      transform: 'translate(20px, 0)',
    },
  },
};

const data = [
  { team: 'Amber Ants', rank: 3, points: 31 },
  { team: 'Eagle Warriors', rank: 1, points: 50 },
  { team: 'Elephant Trunk', rank: 4, points: 18 },
  { team: 'Jaguars', rank: 2, points: 37 },
  { team: 'Smooth Pandas', rank: 5, points: 6 },
];

export default function SeriesFormatter() {
  return (
    <PieChart
      series={[
        {
          data: data.map((d) => ({ label: d.team, id: d.team, value: d.points })),
          valueFormatter: (v, { dataIndex }) => {
            const { rank } = data[dataIndex];
            return `has ${v.value} points and is ranked ${rank}.`;
          },
        },
      ]}
      {...otherProps}
    />
  );
}
