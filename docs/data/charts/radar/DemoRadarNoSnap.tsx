import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

export default function DemoRadarNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="RadarChart"
      data={{
        startAngle: {
          knob: 'number',
          defaultValue: 30,
          min: -180,
          max: 180,
        },
        divisionNumber: {
          knob: 'number',
          defaultValue: 10,
          min: 0,
          max: 20,
        },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <RadarChart
            height={250}
            margin={{ top: 20 }}
            series={[
              {
                // label: 'Lisa',
                data: [120, 98, 86, 99, 85, 65],
              },
            ]}
            divisionNumber={props.divisionNumber}
            radar={{
              max: 120,
              startAngle: props.startAngle,
              metrics: [
                'Math',
                'Chinese',
                'English',
                'Geography',
                'Physics',
                'History',
              ],
            }}
          />
        </Box>
      )}
      getCode={({ props }) =>
        [
          `import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';`,
          '',
          `<RadarChart`,
          '  {/** ... */}',
          `  divisionNumber={${props.divisionNumber}}`,
          `  radar={{`,
          `    startAngle: ${props.startAngle},`,
          `    metrics: [...],`,
          '  }}',
          '/>',
        ].join('\n')
      }
    />
  );
}
