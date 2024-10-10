import * as React from 'react';
import Box from '@mui/material/Box';
import { RadarChart } from '@mui/x-charts/RadarChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

export default function DemoRadarNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Alert"
      data={[
        {
          propName: 'startAngle',
          knob: 'number',
          defaultValue: 0,
          min: -180,
          max: 180,
        },

        {
          propName: 'divisionNumber',
          knob: 'number',
          defaultValue: 5,
          min: 0,
          max: 20,
        },
      ]}
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
            radar={{
              max: 120,
              startAngle: props.startAngle,
              divisionNumber: props.divisionNumber,
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
          `import { RadarChart } from '@mui/x-charts/RadarChart';`,
          '',
          `<RadarChart`,
          '  {/** ... */}',
          `  radar={{`,
          `    startAngle: ${props.startAngle},`,
          `    divisionNumber: ${props.divisionNumber},`,
          '  }}',
          '/>',
        ].join('\n')
      }
    />
  );
}
