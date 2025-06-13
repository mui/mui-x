import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';
import { desktopOS, valueFormatter } from './webUsageStats';

export default function PieShape() {
  return (
    <ChartsUsageDemo
      componentName="Pie shape"
      data={{
        innerRadius: { knob: 'number', defaultValue: 30 },
        outerRadius: { knob: 'number', defaultValue: 100 },
        paddingAngle: { knob: 'number', defaultValue: 5 },
        cornerRadius: { knob: 'number', defaultValue: 5 },
        startAngle: { knob: 'number', defaultValue: -45 },
        endAngle: { knob: 'number', defaultValue: 225 },
        cx: { knob: 'number', defaultValue: 150 },
        cy: { knob: 'number', defaultValue: 150 },
      }}
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              ...props,
              data: desktopOS,
              valueFormatter,
            },
          ]}
          width={300}
          height={300}
          hideLegend
        />
      )}
      getCode={({ props }) => {
        return `import { PieChart } from '@mui/x-charts/PieChart';

<PieChart
  series={[
    {
      data: [ ... ],
      innerRadius: ${props.innerRadius},
      outerRadius: ${props.outerRadius},
      paddingAngle: ${props.paddingAngle},
      cornerRadius: ${props.cornerRadius},
      startAngle: ${props.startAngle},
      endAngle: ${props.endAngle},
      cx: ${props.cx},
      cy: ${props.cy},
    }
  ]}
/>`;
      }}
    />
  );
}
