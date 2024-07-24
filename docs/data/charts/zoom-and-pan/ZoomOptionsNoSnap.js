import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

const knobs = [
  {
    propName: 'panning',
    knob: 'switch',
    defaultValue: true,
  },
  {
    propName: 'minStart',
    knob: 'number',
    defaultValue: 0,
    step: 1,
    min: 0,
    max: 50,
  },
  {
    propName: 'maxEnd',
    knob: 'number',
    defaultValue: 100,
    step: 1,
    min: 50,
    max: 100,
  },
  {
    propName: 'minSpan',
    knob: 'number',
    defaultValue: 10,
    step: 1,
    min: 0,
    max: 100,
  },
  {
    propName: 'maxSpan',
    knob: 'number',
    defaultValue: 100,
    step: 1,
    min: 0,
    max: 100,
  },
  {
    propName: 'step',
    knob: 'number',
    defaultValue: 5,
    step: 1,
    min: 1,
    max: 100,
  },
];

export default function ZoomOptionsNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Zoom Options demo"
      data={knobs}
      renderDemo={(props) => (
        <div style={{ width: '100%', margin: 4 }}>
          <BarChartPro
            height={300}
            xAxis={[
              {
                scaleType: 'band',
                data: data.map((v, i) => i),
                zoom: props,
              },
            ]}
            series={series}
          />
        </div>
      )}
      getCode={({ props }) => {
        return [
          `import { BarChart } from '@mui/x-charts/BarChart';`,
          '',
          `<BarChart`,
          `  // ...`,
          `  xAxis={[`,
          `    {`,
          `      // ...`,
          `      zoom: {`,
          `        minStart: ${props.minStart},`,
          `        maxEnd: ${props.maxEnd},`,
          `        minSpan: ${props.minSpan},`,
          `        maxSpan: ${props.maxSpan},`,
          `        step: ${props.step},`,
          `        panning: ${props.panning},`,
          `      }`,
          `    }`,
          `  ]}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}

const data = [
  {
    y1: 443.28,
    y2: 153.9,
  },
  {
    y1: 110.5,
    y2: 217.8,
  },
  {
    y1: 175.23,
    y2: 286.32,
  },
  {
    y1: 195.97,
    y2: 325.12,
  },
  {
    y1: 351.77,
    y2: 144.58,
  },
  {
    y1: 43.253,
    y2: 146.51,
  },
  {
    y1: 376.34,
    y2: 309.69,
  },
  {
    y1: 31.514,
    y2: 236.38,
  },
  {
    y1: 231.31,
    y2: 440.72,
  },
  {
    y1: 108.04,
    y2: 20.29,
  },
];

const series = [
  {
    label: 'Series A',
    data: data.map((v) => v.y1),
  },
  {
    label: 'Series B',
    data: data.map((v) => v.y2),
  },
];
