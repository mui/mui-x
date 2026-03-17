import * as React from 'react';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ReferenceArea, ReferenceAreaLabel } from './ReferenceArea';

export default function ReferenceAreaBasic() {
  return (
    <ChartsDataProvider {...chartsConfig}>
      <ChartsWrapper>
        <ChartsLegend />
        <ChartsSurface>
          <ReferenceArea x1={1.6} y1={0.8} y2={1.2} fill="green" fillOpacity={0.5} />
          <ReferenceArea
            y1={0.8}
            y2={1.2}
            x2={1.6}
            stroke="none"
            fill="red"
            fillOpacity={0.5}
          />
          <ReferenceAreaLabel
            y1={0.8}
            y2={1.2}
            x1={1.6}
            dx={5}
            dy={-5}
            stroke="none"
            fill="green"
            dominantBaseline="auto"
          >
            Error &lt; 10%
          </ReferenceAreaLabel>

          <ChartsReferenceLine
            x={0}
            label="command starts"
            labelAlign="start"
            lineStyle={{ strokeDasharray: '10 5' }}
            labelStyle={{ fontSize: '1rem', fontStyle: 'italic' }}
          />
          <ChartsReferenceLine
            x={1.6}
            label="stability"
            labelAlign="start"
            lineStyle={{ strokeDasharray: '10 5' }}
            labelStyle={{ fontSize: '1rem', fontStyle: 'italic' }}
          />
          <LinePlot />
          <ChartsAxisHighlight x="line" />
          <LineHighlightPlot />
          <ChartsXAxis />
          <ChartsYAxis />
        </ChartsSurface>
        <ChartsTooltip trigger="axis" />
      </ChartsWrapper>
    </ChartsDataProvider>
  );
}

const N = 120;
const tValues = Array.from({ length: N + 1 }, (_, i) => -0.1 + (i * 3) / N);
const commandValues = tValues.map((t) => (t < 0 ? 0 : 1));
const zValues = tValues.map((t) =>
  t < 0 ? 0 : 1 - 1 * Math.exp(-t) * (Math.cos(8 * t) - 0.5 * Math.sin(8 * t)),
);

const IntlNumber = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});
const valueFormatter = (value) => (value === null ? '' : IntlNumber.format(value));

const chartsConfig = {
  height: 300,
  xAxis: [{ scaleType: 'linear', data: tValues, valueFormatter }],
  series: [
    {
      type: 'line',
      data: commandValues,
      label: 'command',
      curve: 'stepAfter',
      valueFormatter,
    },
    {
      type: 'line',
      data: zValues,
      showMark: false,
      label: 'response',
      valueFormatter,
    },
  ],
};
