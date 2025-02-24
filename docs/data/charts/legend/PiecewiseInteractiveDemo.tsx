import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  piecewiseColorDefaultLabelFormatter,
  PiecewiseColorLegend,
} from '@mui/x-charts/ChartsLegend';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { dataset } from './tempAnomaly';

export default function PiecewiseInteractiveDemo() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={
        {
          direction: {
            knob: 'select',
            defaultValue: 'horizontal',
            options: ['horizontal', 'vertical'],
          },
          labelPosition: {
            knob: 'select',
            defaultValue: 'extremes',
            options: ['start', 'end', 'extremes'],
          },
          markType: {
            knob: 'select',
            defaultValue: 'square',
            options: ['square', 'circle', 'line'],
          },
          onlyShowExtremes: {
            knob: 'switch',
            defaultValue: false,
          },
          padding: {
            knob: 'number',
            defaultValue: 0,
          },
        } as const
      }
      renderDemo={(props) => (
        <LineChart
          dataset={dataset}
          series={[
            {
              label: 'Global temperature anomaly relative to 1961-1990',
              dataKey: 'anomaly',
              showMark: false,
              valueFormatter: (value) => `${value?.toFixed(2)}°`,
            },
          ]}
          xAxis={[
            {
              scaleType: 'time',
              dataKey: 'year',
              disableLine: true,
              valueFormatter: (value) => value.getFullYear().toString(),
              colorMap: {
                type: 'piecewise',
                thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
                colors: ['blue', 'gray', 'red'],
              },
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              valueFormatter: (value) => `${value}°`,
            },
          ]}
          grid={{ horizontal: true }}
          height={300}
          slots={{
            legend: PiecewiseColorLegend,
          }}
          slotProps={{
            legend: {
              axisDirection: 'x',
              direction: props.direction,
              markType: props.markType,
              labelPosition: props.labelPosition,
              labelFormatter: props.onlyShowExtremes
                ? (params) =>
                    params.index === 0 || params.index === params.length
                      ? piecewiseColorDefaultLabelFormatter(params)
                      : ''
                : undefined,
              sx: {
                padding: props.padding,
              },
            },
          }}
        >
          <ChartsReferenceLine y={0} />
        </LineChart>
      )}
      getCode={({ props }) => {
        return `import { 
  PiecewiseColorLegend,
  piecewiseColorDefaultLabelFormatter,
} from '@mui/x-charts/ChartsLegend';

<LineChart
  {/** ... */}
  slots={{ legend: PiecewiseColorLegend }}
  slotProps={{
    legend: {
      axisDirection: 'x',
      direction: '${props.direction}',
      markType: '${props.markType}',
      labelPosition: '${props.labelPosition}',
      sx: { padding: ${props.padding} },${props.onlyShowExtremes ? "\n      labelFormatter: (params) =>\n        params.index === 0 || params.index === params.length\n          ? piecewiseColorDefaultLabelFormatter(params) \n          : ''" : ''}
    },
  }}
/>
`;
      }}
    />
  );
}
