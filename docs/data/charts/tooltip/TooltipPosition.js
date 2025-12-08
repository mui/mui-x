import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  height: 300,
};

export default function TooltipPosition() {
  return (
    <ChartsUsageDemo
      componentName="Tooltip"
      data={{
        anchor: {
          knob: 'select',
          defaultValue: 'node',
          options: ['undefined', 'pointer', 'node'],
        },
        position: {
          knob: 'select',
          defaultValue: 'top',
          options: ['undefined', 'top', 'bottom', 'left', 'right'],
        },
        placement: {
          knob: 'select',
          defaultValue: 'undefined',
          options: [
            'undefined',
            'top',
            'bottom',
            'left',
            'right',
            'top-start',
            'top-end',
            'bottom-start',
            'bottom-end',
          ],
        },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Monthly precipitation
          </Typography>
          <BarChart
            dataset={dataset}
            xAxis={[
              {
                dataKey: 'month',
                label: 'months',
                height: 50,
                valueFormatter: (value, ctx) =>
                  ctx.location === 'tick' ? value.slice(0, 1) : value,
              },
            ]}
            series={[
              { dataKey: 'london', label: 'London', valueFormatter },
              { dataKey: 'paris', label: 'Paris', valueFormatter },
              { dataKey: 'newYork', label: 'New York', valueFormatter },
              { dataKey: 'seoul', label: 'Seoul', valueFormatter },
            ]}
            slotProps={{
              tooltip: {
                trigger: 'item',
                anchor: props.anchor === 'undefined' ? undefined : props.anchor,
                position:
                  props.position === 'undefined' ? undefined : props.position,
                placement:
                  props.placement === 'undefined' ? undefined : props.placement,
              },
            }}
            enableKeyboardNavigation
            {...chartSetting}
          />
        </Box>
      )}
      getCode={({ props }) => `import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  // ...
  slotProps={{
    tooltip: {
      trigger: 'item',${
        props.anchor === 'undefined'
          ? ''
          : `
        anchor: '${props.anchor}',`
      }${
        props.position === 'undefined'
          ? ''
          : `
        position: '${props.position}',`
      }${
        props.placement === 'undefined'
          ? ''
          : `
        placement: '${props.placement}',`
      }
      },
    }}
/>`}
    />
  );
}
