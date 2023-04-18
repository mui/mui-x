import * as React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

import { DEFAULT_X_AXIS_KEY } from '@mui/x-charts/constants';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = Array.from({ length: 200 }, (index) => ({
  id: index,
  x: -25 + Math.floor(Math.random() * 50),
  y: -25 + Math.floor(Math.random() * 50),
}));

const defaultXAxis = {
  disableLine: false,
  disableTicks: false,
  fill: 'currentColor',
  fontSize: 12,
  label: '',
  labelFontSize: 14,
  stroke: 'currentColor',
  tickSize: 6,
};

// TODO: This is a Proof of Concept.
// The interaction should be redisigned and improved a bit like Joy is doing is in their lovely component `JoyUsageDemo`

export default function AxisCustomization() {
  const [bottomAxis, setBottomAxis] = React.useState({
    axisId: DEFAULT_X_AXIS_KEY,
    ...defaultXAxis,
    label: 'bottom axis',
  });
  return (
    <Stack direction="column" sx={{ p: 0, width: '100%' }}>
      <Stack direction="row" sx={{ p: 0, width: '100%' }}>
        <Paper sx={{ minWidth: 300, p: 2 }}>
          <Stack direction="column">
            {/* disableTicks */}
            <FormControl
              size="small"
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FormLabel>disableTicks</FormLabel>
              <Switch
                checked={Boolean(bottomAxis.disableTicks)}
                onChange={(event) =>
                  setBottomAxis((latestProps) => ({
                    ...latestProps,
                    disableTicks: event.target.checked,
                  }))
                }
              />
            </FormControl>
            {/* disableLine */}
            <FormControl
              size="small"
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FormLabel>disableLine</FormLabel>
              <Switch
                checked={Boolean(bottomAxis.disableLine)}
                onChange={(event) =>
                  setBottomAxis((latestProps) => ({
                    ...latestProps,
                    disableLine: event.target.checked,
                  }))
                }
              />
            </FormControl>

            {/* tickSize */}
            <FormControl
              size="small"
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              disabled={Boolean(bottomAxis.disableTicks)}
            >
              <FormLabel>tickSize</FormLabel>
              <Slider
                sx={{ maxWidth: 100 }}
                min={1}
                max={15}
                value={bottomAxis.tickSize ?? 6}
                // @ts-ignore
                onChange={(event, newValue) =>
                  setBottomAxis((latestProps) => ({
                    ...latestProps,
                    tickSize: newValue,
                  }))
                }
              />
            </FormControl>

            {/* labelFontSize */}
            <FormControl
              size="small"
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FormLabel>labelFontSize</FormLabel>
              <Slider
                sx={{ maxWidth: 100 }}
                min={5}
                max={25}
                value={bottomAxis.labelFontSize ?? 14}
                // @ts-ignore
                onChange={(event, newValue) =>
                  setBottomAxis((latestProps) => ({
                    ...latestProps,
                    labelFontSize: newValue,
                  }))
                }
              />
            </FormControl>

            {/* label */}
            <FormControl
              size="small"
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FormLabel>label</FormLabel>
              <Input
                sx={{ maxWidth: 150 }}
                value={bottomAxis.label}
                onChange={(event) =>
                  setBottomAxis((latestProps) => ({
                    ...latestProps,
                    label: event.target.value,
                  }))
                }
              />
            </FormControl>
          </Stack>
        </Paper>
        <ScatterChart
          series={[
            {
              type: 'scatter',
              id: 'linear',
              data,
            },
          ]}
          leftAxis={null}
          bottomAxis={{
            ...bottomAxis,
          }}
          width={400}
          height={300}
        />
      </Stack>
      <HighlightedCode
        code={[
          `import { ScatterChart } from '@mui/x-charts/ScatterChart';`,
          '',
          `<ScatterChart`,
          '  {/** ... */}',
          `  bottomAxis={{`,
          ...Object.keys(defaultXAxis)
            .filter((prop) => bottomAxis[prop] !== defaultXAxis[prop])
            .map(
              (prop) =>
                `    ${prop}: ${
                  typeof bottomAxis[prop] === 'string'
                    ? `"${bottomAxis[prop]}"`
                    : bottomAxis[prop]
                },`,
            ),
          '  }}',
          '/>',
        ].join('\n')}
        language="jsx"
        sx={{ display: { xs: 'none', md: 'block' } }}
      />
    </Stack>
  );
}
