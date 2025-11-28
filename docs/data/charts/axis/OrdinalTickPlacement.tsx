import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { BarSeriesType, XAxis, YAxis, ZoomOptions } from '@mui/x-charts-pro/models';
import { TicksFrequency } from '@mui/x-charts/models';
import alphabetStock from '../dataset/GOOGL.json';
import SelectTimeFrequency from './SelectTimeFrequency';

const tickFrequencies: TicksFrequency[] = [
  'years',
  'quarterly',
  'months',
  'biweekly',
  'weeks',
  'days',
  'hours',
];

export default function OrdinalTickPlacement() {
  const [timeOrdinalTicks, setTimeOrdinalTicks] =
    React.useState<FilteredTicksState>(defaultTicks);
  const [tickNumber, setTickNumber] = React.useState(5);

  return (
    <Box sx={{ width: '100%' }}>
      <SelectTimeFrequency
        tickFrequencies={tickFrequencies}
        timeOrdinalTicks={timeOrdinalTicks}
        setTimeOrdinalTicks={setTimeOrdinalTicks}
        tickNumber={tickNumber}
        setTickNumber={setTickNumber}
      />

      <BarChartPro
        {...barSettings}
        xAxis={[
          {
            ...xAxis,
            tickNumber,
            timeOrdinalTicks: tickFrequencies.filter(
              (frequency) =>
                timeOrdinalTicks[frequency as keyof typeof timeOrdinalTicks],
            ),
          },
        ]}
      />
    </Box>
  );
}

type FilteredTicksState = Record<TicksFrequency, boolean>;
const defaultTicks = Object.fromEntries(
  tickFrequencies.map((frequency) => [frequency, true]),
) as FilteredTicksState;

const zoom: ZoomOptions = { minSpan: 1, filterMode: 'discard' };

const xAxis: XAxis = {
  id: 'date',
  data: alphabetStock.map((day) => new Date(day.date)),
  scaleType: 'band',
  zoom,
  valueFormatter: (value) => value.toLocaleDateString(),
  height: 30,
};

const barSettings = {
  height: 200,
  hideLegend: true,
  margin: { bottom: 5 },
  series: [
    {
      type: 'bar',
      yAxisId: 'volume',
      label: 'Volume',
      color: 'lightgray',
      data: alphabetStock.map((day) => day.volume),
    } as BarSeriesType,
  ],
  yAxis: [
    {
      id: 'volume',
      scaleType: 'linear',
      position: 'left',
      valueFormatter: (value) => `${(value / 1000000).toLocaleString()}M`,
      width: 55,
    } as YAxis,
  ],
};
