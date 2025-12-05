import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { BarSeriesType, XAxis, YAxis, ZoomOptions } from '@mui/x-charts-pro/models';
import { TickFrequency } from '@mui/x-charts/models';
import alphabetStock from '../dataset/GOOGL.json';
import SelectTimeFrequency from './SelectTimeFrequency';

const tickFrequencies: TickFrequency[] = [
  'years',
  'quarterly',
  'months',
  'biweekly',
  'weeks',
  'days',
];

export default function OrdinalTickPlacement() {
  const [ordinalTimeTicks, setOrdinalTimeTicks] =
    React.useState<FilteredTicksState>(defaultTicks);
  const [tickNumber, setTickNumber] = React.useState(5);

  return (
    <Box sx={{ width: '100%' }}>
      <SelectTimeFrequency
        tickFrequencies={tickFrequencies}
        ordinalTimeTicks={ordinalTimeTicks}
        setOrdinalTimeTicks={setOrdinalTimeTicks}
        tickNumber={tickNumber}
        setTickNumber={setTickNumber}
      />

      <BarChartPro
        {...barSettings}
        xAxis={[
          {
            ...xAxis,
            tickNumber,
            ordinalTimeTicks: tickFrequencies.filter(
              (frequency) =>
                ordinalTimeTicks[frequency as keyof typeof ordinalTimeTicks],
            ),
          },
        ]}
      />
    </Box>
  );
}

type FilteredTicksState = Record<TickFrequency, boolean>;
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
