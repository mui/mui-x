---
title: React Sparkline chart
productId: x-charts
components: SparkLineChart
---

# Charts - Sparkline

Sparkline chart can provide an overview of data trends.

## Basics

A sparkline is a small chart drawn without axes or coordinates, that presents the general shape of a variation in a simplified way.
The `<SparkLineChart />` requires only the `data` props which is an array of numbers.
You can also switch from line to a bar plot with `plotType="bar"`.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLine() {
  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          plotType="bar"
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          height={100}
        />
      </Box>
    </Stack>
  );
}

```

## Line customization

You can fill the area below the sparkline curve with the `area` prop.
To modify the curve interpolation, use the `curve` prop. Read the full documentation for curves in the [line charts page](/x/react-charts/lines/#interpolation).

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function AreaSparkLine() {
  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart data={[3, -10, -2, 5, 7, -2, 4, 6]} height={100} area />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          data={[3, -10, -2, 5, 7, -2, 4, 6]}
          height={100}
          curve="natural"
          area
        />
      </Box>
    </Stack>
  );
}

```

## Interaction

Compared to line and bar charts, the sparkline has some additional props to simplify interaction configuration.
You can use `showTooltip` and `showHighlight` to display the default tooltip and highlight in your sparkline.

Those are helpers.
If you need more advanced customization, you can provide custom props for `tooltip` and `highlight` as described in the [Tooltip page](/x/react-charts/tooltip/).

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLineCustomization() {
  const [showHighlight, setShowHighlight] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(true);

  const handleHighlightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowHighlight(event.target.checked);
  };

  const handleTooltipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTooltip(event.target.checked);
  };

  return (
    <Stack direction="column" sx={{ width: '100%' }}>
      <Stack direction="row">
        <FormControlLabel
          value="end"
          control={
            <Switch
              color="primary"
              checked={showHighlight}
              onChange={handleHighlightChange}
            />
          }
          label="showHighlight"
          labelPlacement="end"
        />
        <FormControlLabel
          value="end"
          control={
            <Switch
              color="primary"
              checked={showTooltip}
              onChange={handleTooltipChange}
            />
          }
          label="showTooltip"
          labelPlacement="end"
        />
      </Stack>
      <Stack direction="row" sx={{ width: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={[1, 4, 2, 5, 7, 2, 4, 6]}
            height={100}
            showHighlight={showHighlight}
            showTooltip={showTooltip}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            plotType="bar"
            data={[1, 4, 2, 5, 7, 2, 4, 6]}
            height={100}
            showHighlight={showHighlight}
            showTooltip={showTooltip}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

```

## Axis management

### X-axis data

By default, the sparkline assigns `xAxis` values as an ascending integer sequence starting from 0 (0, 1, 2,...). These values are, in this case, hidden in the tooltip.
You can override this behavior if your data are not evenly distributed, or if you need to label them.

To do so, use the `xAxis` prop.
Notice that sparkline does not manage multiple axes, so `xAxis` prop takes an axis configuration object.
Whereas most of the other charts expect an array of axis configuration objects.

```jsx
<SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} xAxis={{ scaleType, data }} />
```

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function CustomAxis() {
  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          xAxis={{
            scaleType: 'time',
            data: [
              new Date(2022, 5, 1),
              new Date(2022, 5, 2),
              new Date(2022, 5, 5),
              new Date(2022, 5, 6),
              new Date(2022, 5, 7),
              new Date(2022, 5, 8),
              new Date(2022, 5, 11),
              new Date(2022, 5, 12),
            ],
            valueFormatter: (value) => value.toISOString().slice(0, 10),
          }}
          height={100}
          showTooltip
          showHighlight
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          plotType="bar"
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          height={100}
          showTooltip
          showHighlight
          xAxis={{
            scaleType: 'band',
            data: [
              new Date(2016, 0, 1),
              new Date(2017, 0, 1),
              new Date(2018, 0, 1),
              new Date(2019, 0, 1),
              new Date(2020, 0, 1),
              new Date(2021, 0, 1),
              new Date(2022, 0, 1),
              new Date(2023, 0, 1),
            ],
            valueFormatter: (value) => value.getFullYear(),
          }}
        />
      </Box>
    </Stack>
  );
}

```

### Y-axis range

You can fix the y-range of the sparkline by providing `min`/`max` values to the `yAxis` configuration.

The following demo shows two sparklines, one with small and another with large values.
The first row has the default y-axis values, while on the second row a fixed range from `0` to `100` has been set.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const settings = {
  valueFormatter: (value: number | null) => `${value}%`,
  height: 100,
  showTooltip: true,
  showHighlight: true,
} as const;

const smallValues = [0, 2, 3, 4, 6, 8, 7, 9, 15, 6, 8, 7, 12];
const largeValues = [60, 65, 66, 68, 87, 82, 83, 89, 92, 75, 76, 77, 91];
export default function CustomYAxis() {
  return (
    <Stack sx={{ width: '100%' }}>
      <Typography>Without fixed y-range</Typography>
      <Stack sx={{ width: '100%', mb: 2 }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart data={smallValues} color="red" {...settings} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart data={largeValues} {...settings} />
        </Box>
      </Stack>
      <Typography>With y-range fixed to [0, 100]</Typography>
      <Stack sx={{ width: '100%' }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={smallValues}
            yAxis={{
              min: 0,
              max: 100,
            }}
            color="red"
            {...settings}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={largeValues}
            yAxis={{
              min: 0,
              max: 100,
            }}
            {...settings}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

```

You can adjust the y-axis range of a sparkline relatively to its data by using the `domainLimit` option in the `yAxis` configuration.
See the [axis docs page](/x/react-charts/axis/#relative-axis-subdomain) for more information.

The demo below shows different ways to set the y-axis range.
They always display the same data, going from -15 to 92, but with different `domainLimit` settings.

```tsx
import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const settings = {
  valueFormatter: (value: number | null) => `${value}%`,
  height: 100,
  showTooltip: true,
  showHighlight: true,
  data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91],
  margin: { top: 10, bottom: 20, left: 5, right: 5 },
  sx: (theme: Theme) => ({
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  }),
};

// Extend a value to match a multiple of the step.
function extend(value: number, step: number) {
  if (value > 0) {
    // If >0 go to the next step
    return step * Math.ceil(value / step);
  }
  // If <0 go to the previous step
  return step * Math.floor(value / step);
}

const yRange = {
  nice: '-100, 100',
  strict: '-15, 92',
  function: '-20, 100',
};
export default function CustomDomainYAxis() {
  const [domainLimitKey, setDomainLimitKey] = React.useState<
    'nice' | 'strict' | 'function'
  >('nice');

  const domainLimit =
    domainLimitKey === 'function'
      ? (min: number, max: number) => ({
          min: extend(min, 10),
          max: extend(max, 10),
        })
      : domainLimitKey;
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Stack direction="row" alignItems="baseline" justifyContent="space-between">
        <TextField
          select
          value={domainLimitKey}
          onChange={(event) =>
            setDomainLimitKey(event.target.value as 'nice' | 'strict' | 'function')
          }
          label="domain limit"
          sx={{ minWidth: 150, mb: 2 }}
        >
          <MenuItem value="nice">nice</MenuItem>
          <MenuItem value="strict">strict</MenuItem>
          <MenuItem value="function">function</MenuItem>
        </TextField>
        <Typography>y-axis range: {yRange[domainLimitKey]}</Typography>
      </Stack>
      <Stack
        sx={{
          width: '100%',
        }}
        direction="row"
        spacing={2}
      >
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart {...settings} yAxis={{ domainLimit }} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart plotType="bar" {...settings} yAxis={{ domainLimit }} />
        </Box>
      </Stack>
    </Box>
  );
}

```

## Color customization

You can customize the color of the sparkline by providing a color to the `color` prop.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const settings = {
  height: 100,
  yAxis: { min: 0, max: 20 },
} as const;

const values = [0, 2, 3, 4, 6, 8, 7, 9, 15, 6, 8, 7, 12];

export default function ColorCustomization() {
  return (
    <Stack sx={{ width: '100%', maxWidth: 300 }}>
      <SparkLineChart data={values} color="green" {...settings} />
    </Stack>
  );
}

```

The `color` prop also accepts a function that is called with the mode (`'light'` or `'dark'`), so you can adapt the color to user preferences.

The following example shows a white line if this page is in dark mode, or a black one if it is in light mode.

```tsx
import * as React from 'react';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import Paper from '@mui/material/Paper';

const settings = {
  height: 100,
  yAxis: { min: 0, max: 20 },
} as const;

const values = [0, 2, 3, 4, 6, 8, 7, 9, 15, 6, 8, 7, 12];

export default function ColorCustomizationMode() {
  return (
    <DarkModeWrapper>
      <SparkLineChart
        data={values}
        color={(mode) => (mode === 'light' ? 'black' : 'white')}
        {...settings}
      />
    </DarkModeWrapper>
  );
}

function DarkModeWrapper(props: React.PropsWithChildren) {
  const theme = useTheme();
  const [colorMode, setColorMode] = React.useState(theme.palette.mode);

  const newTheme = createTheme({ palette: { mode: colorMode } });
  return (
    <ThemeProvider theme={newTheme}>
      <Stack>
        <Button
          onClick={() =>
            setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'))
          }
          color="inherit"
          endIcon={colorMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        >
          {colorMode} mode
        </Button>
        <Paper sx={{ p: 2, width: '100%', maxWidth: 300 }}>{props.children}</Paper>
      </Stack>
    </ThemeProvider>
  );
}

```

## Line Width

Lines in Sparkline have a stroke width of 2px by default.
When clipping is enabled and the line is drawn on the edge of the chart, it might be partially clipped.

By default, the sparkline has clipping enabled, but the `clipAreaOffset` prop defaults to 1 to prevent clipping.
You can disable clipping by setting `disableClipping` to `true`.

The example below shows how the line's stroke width, `disableClipping` and `clipAreaOffset` affect the sparkline rendering.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart, SparkLineChartProps } from '@mui/x-charts/SparkLineChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';

const values = [8, 7, 9, 0, 0, 5, 20, 20, 7];

const settings = {
  data: values,
  height: 100,
  showHighlight: true,
  showTooltip: true,
} satisfies Partial<SparkLineChartProps>;

export default function SparklineLineWidth() {
  const [strokeWidth, setStrokeWidth] = React.useState<number>(2);
  const [disableClipping, setDisableClipping] = React.useState(false);
  const [clipAreaOffset, setClipAreaOffset] = React.useState<number>(1);

  return (
    <Stack sx={{ width: '100%' }} direction="column" gap={1}>
      <Stack direction="row">
        <FormControlLabel
          checked={disableClipping}
          control={
            <Checkbox
              onChange={(event) => setDisableClipping(event.target.checked)}
            />
          }
          label="Disable Clipping"
          labelPlacement="end"
        />
        <FormControlLabel
          value={strokeWidth}
          control={
            <Slider
              aria-label="Stroke Width"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
              onChange={(event, value) => setStrokeWidth(value)}
            />
          }
          label="Stroke Width"
          labelPlacement="top"
        />

        <FormControlLabel
          value={clipAreaOffset}
          disabled={disableClipping}
          control={
            <Slider
              aria-label="Clip Area Offset"
              valueLabelDisplay="auto"
              disabled={disableClipping}
              step={1}
              marks
              min={0}
              max={5}
              onChange={(event, value) => setClipAreaOffset(value)}
            />
          }
          label="Clip Area Offset"
          labelPlacement="top"
        />
      </Stack>

      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          {...settings}
          yAxis={{ min: 0 }}
          disableClipping={disableClipping}
          clipAreaOffset={{
            top: clipAreaOffset,
            bottom: clipAreaOffset,
            left: clipAreaOffset,
            right: clipAreaOffset,
          }}
          slotProps={{
            line: { strokeWidth },
          }}
        />
      </Box>
    </Stack>
  );
}

```
