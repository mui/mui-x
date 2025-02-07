// @ts-check
import * as React from 'react';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';

export default function FunnelLabelPositioningNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Funnel label positioning"
      data={[
        {
          propName: 'horizontal',
          knob: 'select',
          defaultValue: 'start',
          options: ['start', 'center', 'end'],
        },
        {
          propName: 'vertical',
          knob: 'select',
          defaultValue: 'top',
          options: ['top', 'middle', 'bottom'],
        },
        {
          propName: 'textAnchor',
          knob: 'select',
          defaultValue: 'end',
          options: ['start', 'middle', 'end'],
        },
        {
          propName: 'dominantBaseline',
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
        {
          propName: 'margin',
          knob: 'margin',
          defaultValue: { top: 15, right: 0, bottom: 0, left: -10 },
        },
        {
          propName: 'hide',
          knob: 'switch',
        },
      ]}
      renderDemo={(
        /** @type {Omit<import('@mui/x-charts-pro/FunnelChart/funnel.types').FunnelLabelOptions, 'position'> & {horizontal: import('@mui/x-charts/models').Position['horizontal'], vertical: import('@mui/x-charts/models').Position['vertical'], hide: boolean}} */
        props,
      ) => (
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
                      margin: props.margin,
                    },
              },
            ]}
            xAxis={[{ min: -300, max: 300 }]}
            height={300}
            slotProps={{ legend: { direction: 'vertical' } }}
          />
        </Stack>
      )}
      getCode={(
        /** @type {{props: Omit<import('@mui/x-charts-pro/FunnelChart/funnel.types').FunnelLabelOptions, 'position' | 'margin'> & {margin: any ,horizontal: import('@mui/x-charts/models').Position['horizontal'], vertical: import('@mui/x-charts/models').Position['vertical'], hide: boolean}}} */
        { props },
      ) => {
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
        margin: {
          top: ${props.margin.top},
          right: ${props.margin.right},
          bottom: ${props.margin.bottom},
          left: ${props.margin.left}
      }
    }
  ]}
/>
`;
      }}
    />
  );
}
