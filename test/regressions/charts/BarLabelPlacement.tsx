import { XAxis, YAxis } from '@mui/x-charts/models';
import { BarChart, BarSeries } from '@mui/x-charts/BarChart';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

const bandAxis = { data: ['2', '1', '4', '0', 'null', '-1', '-4'] } satisfies XAxis;
const linearAxis = { id: 'linear', width: 30, min: -4, max: 4 } satisfies YAxis;
const seriesVertical = [
  { data: [2, 1, 4, 0, null, -1, -4], barLabel: 'value', barLabelPlacement: 'outside' },
  { data: [2, 1, 4, 0, null, -1, -4], barLabel: 'value', barLabelPlacement: 'center' },
  { data: [2, 1, 4, 0, null, -1, -4], barLabel: 'value', barLabelPlacement: undefined },
] satisfies BarSeries[];
const seriesHorizontal = [
  {
    data: [2, 1, 4, 0, null, -1, -4],
    barLabel: 'value',
    layout: 'horizontal',
    barLabelPlacement: 'outside',
  },
  {
    data: [2, 1, 4, 0, null, -1, -4],
    barLabel: 'value',
    layout: 'horizontal',
    barLabelPlacement: 'center',
  },
  {
    data: [2, 1, 4, 0, null, -1, -4],
    barLabel: 'value',
    layout: 'horizontal',
    barLabelPlacement: undefined,
  },
] satisfies BarSeries[];

export default function BarLabelPlacement() {
  return (
    <div style={{ display: 'grid', gap: 2, gridTemplateColumns: 'auto repeat(2, 1fr)' }}>
      <div />
      <Typography sx={{ justifySelf: 'center' }}>Layout: Vertical</Typography>
      <Typography sx={{ justifySelf: 'center' }}>Layout: Horizontal</Typography>
      <Typography
        sx={{
          writingMode: 'vertical-lr',
          rotate: '180deg',
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      >
        Reverse: false
      </Typography>
      <BarChart xAxis={[bandAxis]} yAxis={[linearAxis]} series={seriesVertical} height={400}>
        <ChartsReferenceLine axisId="linear" y={0} />
      </BarChart>
      <BarChart xAxis={[linearAxis]} yAxis={[bandAxis]} series={seriesHorizontal} height={400}>
        <ChartsReferenceLine axisId="linear" x={0} />
      </BarChart>
      <Typography
        sx={{
          writingMode: 'vertical-lr',
          rotate: '180deg',
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      >
        Reverse: true
      </Typography>
      <BarChart
        xAxis={[bandAxis]}
        yAxis={[{ ...linearAxis, reverse: true }]}
        series={seriesVertical}
        height={400}
      >
        <ChartsReferenceLine axisId="linear" y={0} />
      </BarChart>
      <BarChart
        xAxis={[{ ...linearAxis, reverse: true }]}
        yAxis={[bandAxis]}
        series={seriesHorizontal}
        height={400}
      >
        <ChartsReferenceLine axisId="linear" x={0} />
      </BarChart>
    </div>
  );
}
