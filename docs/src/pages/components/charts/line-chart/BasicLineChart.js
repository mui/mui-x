import * as React from 'react';
import LineChart from '@mui/charts/LineChart';
import Line from '@mui/charts/Line';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';

export default function BasicLineChart() {
  return (
    <LineChart data={data} xScaleType="time" tickSpacing={62}>
      <Grid />
      <XAxis />
      <YAxis suffix="kg" />
      <Line stroke="rgb(235,97,97)" markerShape="none" />
    </LineChart>
  );
}

const data = [
  {
    x: new Date(2017, 7, 1),
    y: 13,
  },
  {
    x: new Date(2017, 7, 2),
    y: 22,
  },
  {
    x: new Date(2017, 7, 3),
    y: 23,
  },
  {
    x: new Date(2017, 7, 4),
    y: 20,
  },
  {
    x: new Date(2017, 7, 5),
    y: 17,
  },
  {
    x: new Date(2017, 7, 6),
    y: 16,
  },
  {
    x: new Date(2017, 7, 7),
    y: 18,
  },
  {
    x: new Date(2017, 7, 8),
    y: 21,
  },
  {
    x: new Date(2017, 7, 9),
    y: 26,
  },
  {
    x: new Date(2017, 7, 10),
    y: 24,
  },
  {
    x: new Date(2017, 7, 11),
    y: 29,
  },
  {
    x: new Date(2017, 7, 12),
    y: 32,
  },
  {
    x: new Date(2017, 7, 13),
    y: 18,
  },
  {
    x: new Date(2017, 7, 14),
    y: 24,
  },
  {
    x: new Date(2017, 7, 15),
    y: 22,
  },
  {
    x: new Date(2017, 7, 16),
    y: 18,
  },
  {
    x: new Date(2017, 7, 17),
    y: 19,
  },
  {
    x: new Date(2017, 7, 18),
    y: 14,
  },
  {
    x: new Date(2017, 7, 19),
    y: 15,
  },
  {
    x: new Date(2017, 7, 20),
    y: 12,
  },
  {
    x: new Date(2017, 7, 21),
    y: 8,
  },
  {
    x: new Date(2017, 7, 22),
    y: 9,
  },
  {
    x: new Date(2017, 7, 23),
    y: 8,
  },
  {
    x: new Date(2017, 7, 24),
    y: 7,
  },
  {
    x: new Date(2017, 7, 25),
    y: 5,
  },
  {
    x: new Date(2017, 7, 26),
    y: 11,
  },
  {
    x: new Date(2017, 7, 27),
    y: 13,
  },
  {
    x: new Date(2017, 7, 28),
    y: 18,
  },
  {
    x: new Date(2017, 7, 29),
    y: 20,
  },
  {
    x: new Date(2017, 7, 30),
    y: 29,
  },
  {
    x: new Date(2017, 7, 31),
    y: 33,
  },
  {
    x: new Date(2017, 8, 1),
    y: 42,
  },
  {
    x: new Date(2017, 8, 2),
    y: 35,
  },
  {
    x: new Date(2017, 8, 3),
    y: 31,
  },
  {
    x: new Date(2017, 8, 4),
    y: 47,
  },
  {
    x: new Date(2017, 8, 5),
    y: 52,
  },
  {
    x: new Date(2017, 8, 6),
    y: 46,
  },
  {
    x: new Date(2017, 8, 7),
    y: 41,
  },
  {
    x: new Date(2017, 8, 8),
    y: 43,
  },
  {
    x: new Date(2017, 8, 9),
    y: 40,
  },
  {
    x: new Date(2017, 8, 10),
    y: 39,
  },
  {
    x: new Date(2017, 8, 11),
    y: 34,
  },
  {
    x: new Date(2017, 8, 12),
    y: 29,
  },
  {
    x: new Date(2017, 8, 13),
    y: 34,
  },
  {
    x: new Date(2017, 8, 14),
    y: 37,
  },
  {
    x: new Date(2017, 8, 15),
    y: 42,
  },
  {
    x: new Date(2017, 8, 16),
    y: 49,
  },
  {
    x: new Date(2017, 8, 17),
    y: 46,
  },
  {
    x: new Date(2017, 8, 18),
    y: 47,
  },
  {
    x: new Date(2017, 8, 19),
    y: 55,
  },
  {
    x: new Date(2017, 8, 20),
    y: 59,
  },
  {
    x: new Date(2017, 8, 21),
    y: 58,
  },
  {
    x: new Date(2017, 8, 22),
    y: 57,
  },
  {
    x: new Date(2017, 8, 23),
    y: 61,
  },
  {
    x: new Date(2017, 8, 24),
    y: 59,
  },
  {
    x: new Date(2017, 8, 25),
    y: 67,
  },
  {
    x: new Date(2017, 8, 26),
    y: 65,
  },
  {
    x: new Date(2017, 8, 27),
    y: 61,
  },
  {
    x: new Date(2017, 8, 28),
    y: 66,
  },
  {
    x: new Date(2017, 8, 29),
    y: 69,
  },
  {
    x: new Date(2017, 8, 30),
    y: 71,
  },
  {
    x: new Date(2017, 9, 1),
    y: 67,
  },
  {
    x: new Date(2017, 9, 2),
    y: 63,
  },
  {
    x: new Date(2017, 9, 3),
    y: 46,
  },
  {
    x: new Date(2017, 9, 4),
    y: 32,
  },
  {
    x: new Date(2017, 9, 5),
    y: 21,
  },
  {
    x: new Date(2017, 9, 6),
    y: 18,
  },
  {
    x: new Date(2017, 9, 7),
    y: 21,
  },
  {
    x: new Date(2017, 9, 8),
    y: 28,
  },
  {
    x: new Date(2017, 9, 9),
    y: 27,
  },
  {
    x: new Date(2017, 9, 10),
    y: 36,
  },
  {
    x: new Date(2017, 9, 11),
    y: 33,
  },
  {
    x: new Date(2017, 9, 12),
    y: 31,
  },
  {
    x: new Date(2017, 9, 13),
    y: 30,
  },
  {
    x: new Date(2017, 9, 14),
    y: 34,
  },
  {
    x: new Date(2017, 9, 15),
    y: 38,
  },
  {
    x: new Date(2017, 9, 16),
    y: 37,
  },
  {
    x: new Date(2017, 9, 17),
    y: 44,
  },
  {
    x: new Date(2017, 9, 18),
    y: 49,
  },
  {
    x: new Date(2017, 9, 19),
    y: 53,
  },
  {
    x: new Date(2017, 9, 20),
    y: 57,
  },
  {
    x: new Date(2017, 9, 21),
    y: 60,
  },
  {
    x: new Date(2017, 9, 22),
    y: 61,
  },
  {
    x: new Date(2017, 9, 23),
    y: 69,
  },
  {
    x: new Date(2017, 9, 24),
    y: 67,
  },
  {
    x: new Date(2017, 9, 25),
    y: 72,
  },
  {
    x: new Date(2017, 9, 26),
    y: 77,
  },
  {
    x: new Date(2017, 9, 27),
    y: 75,
  },
  {
    x: new Date(2017, 9, 28),
    y: 70,
  },
  {
    x: new Date(2017, 9, 29),
    y: 72,
  },
  {
    x: new Date(2017, 9, 30),
    y: 70,
  },
  {
    x: new Date(2017, 9, 31),
    y: 72,
  },
  {
    x: new Date(2017, 10, 1),
    y: 73,
  },
  {
    x: new Date(2017, 10, 2),
    y: 67,
  },
  {
    x: new Date(2017, 10, 3),
    y: 68,
  },
  {
    x: new Date(2017, 10, 4),
    y: 65,
  },
  {
    x: new Date(2017, 10, 5),
    y: 71,
  },
  {
    x: new Date(2017, 10, 6),
    y: 75,
  },
  {
    x: new Date(2017, 10, 7),
    y: 74,
  },
  {
    x: new Date(2017, 10, 8),
    y: 71,
  },
  {
    x: new Date(2017, 10, 9),
    y: 76,
  },
  {
    x: new Date(2017, 10, 10),
    y: 77,
  },
  {
    x: new Date(2017, 10, 11),
    y: 81,
  },
  {
    x: new Date(2017, 10, 12),
    y: 83,
  },
  {
    x: new Date(2017, 10, 13),
    y: 80,
  },
  {
    x: new Date(2017, 10, 14),
    y: 81,
  },
  {
    x: new Date(2017, 10, 15),
    y: 87,
  },
  {
    x: new Date(2017, 10, 16),
    y: 82,
  },
  {
    x: new Date(2017, 10, 17),
    y: 86,
  },
  {
    x: new Date(2017, 10, 18),
    y: 80,
  },
  {
    x: new Date(2017, 10, 19),
    y: 87,
  },
  {
    x: new Date(2017, 10, 20),
    y: 83,
  },
  {
    x: new Date(2017, 10, 21),
    y: 85,
  },
  {
    x: new Date(2017, 10, 22),
    y: 84,
  },
  {
    x: new Date(2017, 10, 23),
    y: 82,
  },
  {
    x: new Date(2017, 10, 24),
    y: 73,
  },
  {
    x: new Date(2017, 10, 25),
    y: 71,
  },
  {
    x: new Date(2017, 10, 26),
    y: 75,
  },
  {
    x: new Date(2017, 10, 27),
    y: 79,
  },
  {
    x: new Date(2017, 10, 28),
    y: 70,
  },
  {
    x: new Date(2017, 10, 29),
    y: 73,
  },
  {
    x: new Date(2017, 10, 30),
    y: 61,
  },
  {
    x: new Date(2017, 11, 1),
    y: 62,
  },
  {
    x: new Date(2017, 11, 2),
    y: 66,
  },
  {
    x: new Date(2017, 11, 3),
    y: 65,
  },
  {
    x: new Date(2017, 11, 4),
    y: 73,
  },
  {
    x: new Date(2017, 11, 5),
    y: 79,
  },
  {
    x: new Date(2017, 11, 6),
    y: 78,
  },
  {
    x: new Date(2017, 11, 7),
    y: 78,
  },
  {
    x: new Date(2017, 11, 8),
    y: 78,
  },
  {
    x: new Date(2017, 11, 9),
    y: 74,
  },
  {
    x: new Date(2017, 11, 10),
    y: 73,
  },
  {
    x: new Date(2017, 11, 11),
    y: 75,
  },
  {
    x: new Date(2017, 11, 12),
    y: 70,
  },
  {
    x: new Date(2017, 11, 13),
    y: 77,
  },
  {
    x: new Date(2017, 11, 14),
    y: 67,
  },
  {
    x: new Date(2017, 11, 15),
    y: 62,
  },
  {
    x: new Date(2017, 11, 16),
    y: 64,
  },
  {
    x: new Date(2017, 11, 17),
    y: 61,
  },
  {
    x: new Date(2017, 11, 18),
    y: 59,
  },
  {
    x: new Date(2017, 11, 19),
    y: 53,
  },
  {
    x: new Date(2017, 11, 20),
    y: 54,
  },
  {
    x: new Date(2017, 11, 21),
    y: 56,
  },
  {
    x: new Date(2017, 11, 22),
    y: 59,
  },
  {
    x: new Date(2017, 11, 23),
    y: 58,
  },
  {
    x: new Date(2017, 11, 24),
    y: 55,
  },
  {
    x: new Date(2017, 11, 25),
    y: 52,
  },
  {
    x: new Date(2017, 11, 26),
    y: 54,
  },
  {
    x: new Date(2017, 11, 27),
    y: 50,
  },
  {
    x: new Date(2017, 11, 28),
    y: 50,
  },
  {
    x: new Date(2017, 11, 29),
    y: 51,
  },
  {
    x: new Date(2017, 11, 30),
    y: 52,
  },
  {
    x: new Date(2017, 11, 31),
    y: 58,
  },
  {
    x: new Date(2018, 0, 1),
    y: 60,
  },
  {
    x: new Date(2018, 0, 2),
    y: 67,
  },
  {
    x: new Date(2018, 0, 3),
    y: 64,
  },
  {
    x: new Date(2018, 0, 4),
    y: 66,
  },
  {
    x: new Date(2018, 0, 5),
    y: 60,
  },
  {
    x: new Date(2018, 0, 6),
    y: 63,
  },
  {
    x: new Date(2018, 0, 7),
    y: 61,
  },
  {
    x: new Date(2018, 0, 8),
    y: 60,
  },
  {
    x: new Date(2018, 0, 9),
    y: 65,
  },
  {
    x: new Date(2018, 0, 10),
    y: 75,
  },
  {
    x: new Date(2018, 0, 11),
    y: 77,
  },
  {
    x: new Date(2018, 0, 12),
    y: 78,
  },
  {
    x: new Date(2018, 0, 13),
    y: 70,
  },
  {
    x: new Date(2018, 0, 14),
    y: 70,
  },
  {
    x: new Date(2018, 0, 15),
    y: 73,
  },
  {
    x: new Date(2018, 0, 16),
    y: 71,
  },
  {
    x: new Date(2018, 0, 17),
    y: 74,
  },
  {
    x: new Date(2018, 0, 18),
    y: 78,
  },
  {
    x: new Date(2018, 0, 19),
    y: 85,
  },
  {
    x: new Date(2018, 0, 20),
    y: 82,
  },
  {
    x: new Date(2018, 0, 21),
    y: 83,
  },
  {
    x: new Date(2018, 0, 22),
    y: 88,
  },
  {
    x: new Date(2018, 0, 23),
    y: 85,
  },
  {
    x: new Date(2018, 0, 24),
    y: 85,
  },
  {
    x: new Date(2018, 0, 25),
    y: 80,
  },
  {
    x: new Date(2018, 0, 26),
    y: 87,
  },
  {
    x: new Date(2018, 0, 27),
    y: 84,
  },
  {
    x: new Date(2018, 0, 28),
    y: 83,
  },
  {
    x: new Date(2018, 0, 29),
    y: 84,
  },
  {
    x: new Date(2018, 0, 30),
    y: 81,
  },
  {
    x: new Date(2018, 0, 31),
    y: 79,
  },
  {
    x: new Date(2018, 1, 1),
    y: 76,
  },
  {
    x: new Date(2018, 1, 2),
    y: 78,
  },
  {
    x: new Date(2018, 1, 3),
    y: 75,
  },
  {
    x: new Date(2018, 1, 4),
    y: 72,
  },
  {
    x: new Date(2018, 1, 5),
    y: 73,
  },
];
