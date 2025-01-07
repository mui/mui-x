// @ts-check
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  piecewiseColorDefaultLabelFormatter,
  PiecewiseColorLegend,
} from '@mui/x-charts/ChartsLegend';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { dataset } from './tempAnomaly';

export default function PiecewiseInteractiveDemoNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        {
          propName: 'direction',
          knob: 'select',
          defaultValue: 'horizontal',
          options: ['horizontal', 'vertical'],
        },
        {
          propName: 'labelPosition',
          knob: 'select',
          defaultValue: 'extremes',
          options: ['start', 'end', 'extremes'],
        },
        {
          propName: 'markType',
          knob: 'select',
          defaultValue: 'square',
          options: ['square', 'circle', 'line'],
        },
        {
          propName: 'onlyShowExtremes',
          knob: 'switch',
          defaultValue: false,
        },
        {
          propName: 'padding',
          knob: 'number',
          defaultValue: 0,
        },
      ]}
      renderDemo={(
        /** @type {{ direction: "vertical" | "horizontal"; markType: 'square' | 'circle' | 'line'; labelPosition:  'start' | 'end' | 'extremes'; padding: number; onlyShowExtremes: boolean; }} */
        props,
      ) => (
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
          margin={{ top: 20, right: 20 }}
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
      getCode={(
        /** @type {{props:{ direction: "vertical" | "horizontal"; markType: 'square' | 'circle' | 'line'; labelPosition:  'start' | 'end' | 'extremes'; padding: number; onlyShowExtremes: boolean; }}} */
        { props },
      ) => {
        return `
import { 
  PiecewiseColorLegend,
  piecewiseColorDefaultLabelFormatter,
} from '@mui/x-charts/ChartsLegend';

<LineChart
  {/** ... */}
  margin={{ top: 20, right: 20 }}
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
