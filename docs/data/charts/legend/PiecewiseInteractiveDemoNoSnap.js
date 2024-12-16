// @ts-check
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { LineChart } from '@mui/x-charts/LineChart';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { dataset } from './tempAnomaly';

export default function PiecewiseInteractiveDemoNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        {
          propName: 'hideFirst',
          knob: 'switch',
        },
        {
          propName: 'direction',
          knob: 'select',
          defaultValue: 'horizontal',
          options: ['horizontal', 'vertical'],
        },
        {
          propName: 'padding',
          knob: 'number',
          defaultValue: 0,
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
        /** @type {{ direction: "vertical" | "horizontal"; padding: any; fontSize: any; hideFirst: any; }} */
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
            margin={{
              top: props.direction === 'horizontal' ? 50 : 20,
              right: props.direction === 'horizontal' ? 20 : 150,
            }}
            legendPosition={
              props.direction === 'horizontal'
                ? { vertical: 'top', horizontal: 'middle' }
                : { vertical: 'middle', horizontal: 'right' }
            }
            slots={{
              legend: PiecewiseColorLegend,
            }}
            slotProps={{
              legend: {
                axisDirection: 'x',
                direction: props.direction,
              },
            }}
          >
            <ChartsReferenceLine y={0} />
          </LineChart>
        </div>
      )}
      getCode={(
        /** @type {{props:{ direction: "vertical" | "horizontal"; padding: any; fontSize: any; hideFirst: any; }}} */
        { props },
      ) => {
        return [
          `import { LineChart } from '@mui/x-charts/LineChart';`,
          `import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';`,
          '',
          `<LineChart`,
          `  margin={{ top: ${props.direction === 'horizontal' ? 50 : 20}, right: ${
            props.direction === 'horizontal' ? 20 : 150
          } }}`,
          '  {/** ... */}',
          '>',
          `  <PiecewiseColorLegend`,
          `      axisDirection="x"`,
          `      position={${
            props.direction === 'horizontal'
              ? `{ vertical: 'top', horizontal: 'middle' }`
              : `{ vertical: 'middle', horizontal: 'right' }`
          }}`,
          `      direction="${props.direction}"`,
          ...(props.hideFirst ? ['      hideFirst'] : []),
          `      padding={${props.padding}}`,
          `      labelStyle={{ fontSize: ${props.fontSize} }}`,
          `    />`,
          '</LineChart>',
        ].join('\n');
      }}
    />
  );
}
