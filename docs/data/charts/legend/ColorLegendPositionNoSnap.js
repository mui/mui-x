import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsColorScaleLegend } from '@mui/x-charts/ChartsLegend';
import { dataset } from './tempAnomaly';

export default function ColorLegendPositionNoSnap() {
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
          propName: 'padding',
          knob: 'number',
          defaultValue: 0,
        },
        // {
        //   propName: 'itemsNumber',
        //   knob: 'number',
        //   defaultValue: 5,
        //   min: 1,
        //   max: data.length,
        // },
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
                colorMap: {
                  type: 'piecewise',
                  thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
                  colors: ['blue', 'gray', 'red'],
                },
              },
            ]}
            yAxis={[{ disableLine: true, valueFormatter: (value) => `${value}°` }]}
            height={300}
            {...(props.direction === 'row'
              ? {
                  margin: {
                    bottom: 30,
                    top: 50,
                    right: 20,
                  },
                }
              : {
                  margin: {
                    bottom: 30,
                    top: 20,
                    right: 150,
                  },
                })}
            slotProps={{ legend: { hidden: true } }}
          >
            <ChartsColorScaleLegend
              axisDirection="x"
              position={
                props.direction === 'row'
                  ? { vertical: 'top', horizontal: 'middle' }
                  : { vertical: 'middle', horizontal: 'right' }
              }
              direction={props.direction}
              spacing={10}
            />
          </LineChart>
        </div>
      )}
      getCode={({ props }) => {
        return [
          `import { LineChart } from '@mui/x-charts/LineChart';`,
          '',
          `<LineChart`,
          '  margin={{ top: 100, bottom: 100, left: 100, right:100 }}',
          '  {/** ... */}',
          `  slotProps={{`,
          `    legend: {`,
          `      direction: '${props.direction}',`,
          `      position: { vertical: '${props.vertical}', horizontal: '${props.horizontal}' },`,
          `      padding: ${props.padding},`,
          `    },`,
          `  }}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
