// @ts-check
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import { dataset } from './tempAnomaly';

export default function ContinuousInteractiveDemoNoSnap() {
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
          propName: 'length',
          knob: 'number',
          defaultValue: 50,
          min: 10,
          max: 80,
        },
        {
          propName: 'thickness',
          knob: 'number',
          defaultValue: 5,
          min: 1,
          max: 20,
        },
        {
          propName: 'align',
          knob: 'select',
          defaultValue: 'middle',
          options: ['start', 'middle', 'end'],
        },
        {
          propName: 'fontSize',
          knob: 'number',
          defaultValue: 10,
          min: 8,
          max: 20,
        },
      ]}
      renderDemo={(
        /** @type {{ direction: "horizontal" | "vertical"; length: number; thickness: number; align: "start" | "middle" | "end"; fontSize: number }} */
        props,
      ) => (
        <div style={{ width: '100%' }}>
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
              },
            ]}
            yAxis={[
              {
                disableLine: true,
                disableTicks: true,
                valueFormatter: (value) => `${value}°`,
                colorMap: {
                  type: 'continuous',
                  min: -0.5,
                  max: 1.5,
                  color: (t) => interpolateRdYlBu(1 - t),
                },
              },
            ]}
            grid={{ horizontal: true }}
            height={300}
            margin={{
              top: props.direction === 'horizontal' ? 50 : 20,
              right: props.direction === 'horizontal' ? 20 : 50,
            }}
            legendPosition={
              props.direction === 'horizontal'
                ? { vertical: 'top', horizontal: 'middle' }
                : { vertical: 'middle', horizontal: 'right' }
            }
            slotProps={{
              legend: {
                direction: props.direction,
                axisDirection: 'y',
              },
            }}
            slots={{
              legend: ContinuousColorLegend,
            }}
            sx={{}}
          >
            <ChartsReferenceLine y={0} />
          </LineChart>
        </div>
      )}
      getCode={(
        /** @type {{props: { direction: "horizontal" | "vertical"; length: number; thickness: number; align: "start" | "middle" | "end"; fontSize: number }}} */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        { props },
      ) => {
        return [
          `import { LineChart } from '@mui/x-charts/LineChart';`,
          `import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';`,
          '',
          `<LineChart`,
          '</LineChart>',
        ].join('\n');
      }}
    />
  );
}
