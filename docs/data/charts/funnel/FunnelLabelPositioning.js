// @ts-check
import * as React from 'react';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';

export default function FunnelLabelPositioning() {
  return (
    <ChartsUsageDemo
      componentName="Funnel label positioning"
      data={{
        horizontal: {
          knob: 'select',
          defaultValue: 'start',
          options: ['start', 'center', 'end'],
        },
        vertical: {
          knob: 'select',
          defaultValue: 'top',
          options: ['top', 'middle', 'bottom'],
        },
        textAnchor: {
          knob: 'select',
          defaultValue: 'end',
          options: ['start', 'middle', 'end'],
        },
        dominantBaseline: {
          knob: 'select',
          defaultValue: 'middle',
          options: [
            'auto',
            'baseline',
            'hanging',
            'middle',
            'central',
            'text-after-edge',
            'text-before-edge',
          ],
        },
        offsetX: {
          knob: 'slider',
          defaultValue: -10,
          min: -50,
          max: 50,
        },
        offsetY: {
          knob: 'slider',
          defaultValue: 15,
          min: -50,
          max: 50,
        },
        hide: {
          knob: 'switch',
        },
      }}
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <FunnelChart
            series={[
              {
                layout: 'vertical',
                data: [
                  { value: 200, label: 'A' },
                  { value: 180, label: 'B' },
                  { value: 90, label: 'C' },
                  { value: 50, label: 'D' },
                ],
                sectionLabel: props.hide
                  ? false
                  : {
                      position: {
                        horizontal: props.horizontal,
                        vertical: props.vertical,
                      },
                      textAnchor: props.textAnchor,
                      dominantBaseline: props.dominantBaseline,
                      offset: {
                        x: props.offsetX,
                        y: props.offsetY,
                      },
                    },
              },
            ]}
            xAxis={[{ min: -300, max: 300 }]}
            height={300}
            slotProps={{ legend: { direction: 'vertical' } }}
          />
        </Stack>
      )}
      getCode={({ props }) => {
        if (props.hide) {
          return `import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  series={[
    {
      sectionLabel: false
    }
  ]}
/>
`;
        }

        return `import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  // Space to display the labels
  xAxis={[{ min: -300, max: 300 }]}
  series={[
    {
      sectionLabel: {
        position: {
          horizontal: '${props.horizontal}',
          vertical: '${props.vertical}'
        },
        textAnchor: '${props.textAnchor}',
        dominantBaseline: '${props.dominantBaseline}',
        offset: {
          x: ${props.offsetX},
          y: ${props.offsetY}
        }
      }
    }
  ]}
/>
`;
      }}
    />
  );
}
