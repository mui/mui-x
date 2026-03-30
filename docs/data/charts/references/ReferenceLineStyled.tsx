import * as React from 'react';
import { styled } from '@mui/material/styles';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import {
  ChartsReferenceLine,
  referenceLineClasses,
} from '@mui/x-charts/ChartsReferenceLine';

const StyledReferenceLine = styled(ChartsReferenceLine)(() => ({
  [`& .${referenceLineClasses.line}`]: {
    strokeDasharray: '10 5',
    stroke: 'red',
  },
}));

export default function ReferenceLineStyled() {
  return (
    <LineChart {...chartsConfig}>
      <StyledReferenceLine
        y={6}
        label="Threshold"
        labelAlign="start"
        labelStyle={{ fill: 'red', fontSize: 12 }}
      />
      <ChartsReferenceLine
        x="Apr"
        label="Target"
        lineStyle={{ stroke: 'green', strokeWidth: 2 }}
        labelStyle={{ fill: 'green', fontSize: 12 }}
        labelAlign="end"
      />
    </LineChart>
  );
}
const chartsConfig: LineChartProps = {
  height: 300,
  xAxis: [
    { scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  ],
  series: [{ data: [2, 5, 3, 7, 1, 6, 4] }],
};
