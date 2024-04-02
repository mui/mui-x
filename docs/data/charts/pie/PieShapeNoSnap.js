import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieShapeNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Pie shape"
      data={[
        { propName: `innerRadius`, knob: 'number', defaultValue: 30 },
        { propName: `outerRadius`, knob: 'number', defaultValue: 100 },
        { propName: `paddingAngle`, knob: 'number', defaultValue: 5 },
        { propName: `cornerRadius`, knob: 'number', defaultValue: 5 },
        { propName: `startAngle`, knob: 'number', defaultValue: -90 },
        { propName: `endAngle`, knob: 'number', defaultValue: 180 },
        { propName: `cx`, knob: 'number', defaultValue: 150 },
        { propName: `cy`, knob: 'number', defaultValue: 150 },
      ]}
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              ...props,
              data: [
                { value: 5 },
                { value: 5 },
                { value: 10 },
                { value: 15 },
                { value: 30 },
              ],
            },
          ]}
          width={300}
          height={300}
          margin={{ right: 5 }}
        />
      )}
      getCode={({ props }) => {
        return [
          `import { PieChart } from '@mui/x-charts/PieChart';`,
          '',
          `<PieChart`,
          `  series={[`,
          `    {`,
          `      data: [ ... ],`,
          `      innerRadius: ${props.innerRadius},`,
          `      outerRadius: ${props.outerRadius},`,
          `      paddingAngle: ${props.paddingAngle},`,
          `      cornerRadius: ${props.cornerRadius},`,
          `      startAngle: ${props.startAngle},`,
          `      endAngle: ${props.endAngle},`,
          `      cx: ${props.cx},`,
          `      cy: ${props.cy},`,
          `    }`,
          `  ]}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
