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
          defaultValue: 'row',
          options: ['row', 'column'],
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
      renderDemo={(props) => (
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
              top: props.direction === 'row' ? 50 : 20,
              right: props.direction === 'row' ? 20 : 50,
            }}
            slotProps={{ legend: { hidden: true } }}
          >
            <ChartsReferenceLine y={0} />
            <ContinuousColorLegend
              axisDirection="y"
              position={
                props.direction === 'row'
                  ? { vertical: 'top', horizontal: 'middle' }
                  : { vertical: 'middle', horizontal: 'right' }
              }
              direction={props.direction}
              length={`${props.length}%`}
              thickness={props.thickness}
              align={props.align}
              labelStyle={{ fontSize: props.fontSize }}
            />
          </LineChart>
        </div>
      )}
      getCode={({ props }) => {
        return [
          `import { LineChart } from '@mui/x-charts/LineChart';`,
          `import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';`,
          '',
          `<LineChart`,
          `  margin={{ top: ${props.direction === 'row' ? 50 : 20}, right: ${
            props.direction === 'row' ? 20 : 50
          } }}`,
          '  {/** ... */}',
          '>',
          `  <ContinuousColorLegend`,
          `      axisDirection="x"`,
          `      position={${
            props.direction === 'row'
              ? `{ vertical: 'top', horizontal: 'middle' }`
              : `{ vertical: 'middle', horizontal: 'right' }`
          }}`,
          `      direction="${props.direction}"`,
          `      length="${props.length}%"`,
          `      thickness={${props.thickness}}`,
          `      align="${props.align}"`,
          `      labelStyle={{ fontSize: ${props.fontSize} }}`,
          `    />`,
          '</LineChart>',
        ].join('\n');
      }}
    />
  );
}
