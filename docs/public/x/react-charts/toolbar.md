---
title: Charts - Toolbar
productId: x-charts
components: Toolbar, ToolbarButton, ChartsToolbarPro, ChartsToolbarZoomInTrigger, ChartsToolbarZoomOutTrigger, ChartsToolbarPrintExportTrigger, ChartsToolbarImageExportTrigger
---

# Charts - Toolbar 🧪

Charts can display a toolbar for easier access to certain functionality.

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

Charts provide a toolbar that can be enabled to give users quick access to certain features.

The toolbar is available on scatter, bar, line, pie, and radar charts.

To enable the toolbar, set the `showToolbar` prop to `true` on the chart component.

:::info
The toolbar is only displayed if there are actions available.

For example, if the chart is not zoomable, the zoom buttons will not be displayed.
:::

```tsx
import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { data } from './randomData';

const series = [
  {
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
  },
  {
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
  },
];

export default function ChartsToolbar() {
  return (
    <ScatterChartPro
      xAxis={[{ zoom: true }]}
      yAxis={[{ zoom: true }]}
      height={300}
      series={series}
      showToolbar
    />
  );
}

```

## Customization

The toolbar is highly customizable, built to integrate with any design system.

### Slots

You can customize basic components, such as buttons and tooltips, by passing custom elements to the `slots` prop of the chart.
You can use this to replace the default buttons with components from your design system.

If you're creating a chart using [composition](/x/react-charts/composition/), these basic components can be provided as slots to the `ChartDataProvider`.

```tsx
import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ChartBaseIconButtonProps } from '@mui/x-charts/models';
import Button from '@mui/material/Button';
import { chartsToolbarClasses } from '@mui/x-charts/Toolbar';
import { data } from './randomData';

const params = {
  height: 300,
  series: [
    {
      label: 'Series A',
      data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    },
    {
      label: 'Series B',
      data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
    },
  ],
};

const CustomIconButton = React.forwardRef<
  HTMLButtonElement,
  ChartBaseIconButtonProps
>(function CustomIconButton(props, ref) {
  return <Button ref={ref} {...props} variant="contained" />;
});

export default function ChartsToolbarCustomElements() {
  return (
    <ScatterChartPro
      {...params}
      xAxis={[{ zoom: true }]}
      yAxis={[{ zoom: true }]}
      showToolbar
      slots={{ baseIconButton: CustomIconButton }}
      sx={{
        [`& .${chartsToolbarClasses.root}`]: {
          gap: 1,
          padding: 1,
          minHeight: 52,
        },
      }}
    />
  );
}

```

### Render prop

The `render` prop can be used to customize the rendering of the toolbar's elements.

You can pass a React element to the `render` prop of the `ToolbarButton` component to replace the default button with your own component.

This is useful when you want to render a custom component but want to use the toolbar's [accessibility](#accessibility) features, such as keyboard navigation and ARIA attributes, without having to implement them yourself.

```tsx
<ToolbarButton render={<MyButton />} />
```

Alternatively, you can pass a function to the `render` prop, which receives the props and state as arguments.

```tsx
<ToolbarButton render={(props, state) => <MyButton {...props} />} />
```

You can see an example in the [composition](#composition) section.

### Composition

If you want to further customize the toolbar's functionality, you can also partially or entirely replace it with a custom implementation.

You can achieve this by providing a custom component to the `toolbar` slot.

Components such as `Toolbar` and `ToolbarButton` can be used to build your own toolbar using the default components as a base, or you can create your own custom toolbar from scratch.

```tsx
import * as React from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PrintIcon from '@mui/icons-material/Print';
import PhotoIcon from '@mui/icons-material/Photo';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import {
  ChartsToolbarZoomInTrigger,
  ChartsToolbarZoomOutTrigger,
  ChartsToolbarPrintExportTrigger,
  ChartsToolbarImageExportTrigger,
} from '@mui/x-charts-pro/ChartsToolbarPro';
import { chartsToolbarClasses, Toolbar, ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartProApiContext, ChartProApi } from '@mui/x-charts-pro/context';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { data } from './randomData';

const VerticalDivider = styled(Divider)(({ theme }) => ({
  height: 20,
  alignSelf: 'center',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const params = {
  height: 300,
  series: [
    {
      label: 'Series A',
      data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    },
    {
      label: 'Series B',
      data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
    },
  ],
};

const ResetZoomButton = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
  function ResetZoomButton(props, ref) {
    const apiRef = useChartProApiContext<ChartProApi<'scatter'>>();

    return (
      <ToolbarButton
        {...props}
        ref={ref}
        onClick={() => {
          apiRef.current.setZoomData((prev) =>
            prev.map((zoom) => ({ ...zoom, start: 0, end: 100 })),
          );
        }}
        render={<Button />}
      />
    );
  },
);

function CustomToolbar() {
  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={1}
      flexWrap="wrap"
    >
      <Typography
        justifyContent="center"
        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        variant="h6"
      >
        Chart with Custom Toolbar
      </Typography>
      <Stack>
        <Toolbar>
          <Tooltip title="Zoom in">
            <ChartsToolbarZoomInTrigger render={<ToolbarButton size="small" />}>
              <ZoomInIcon />
            </ChartsToolbarZoomInTrigger>
          </Tooltip>
          <Tooltip title="Zoom out">
            <ChartsToolbarZoomOutTrigger render={<ToolbarButton size="small" />}>
              <ZoomOutIcon />
            </ChartsToolbarZoomOutTrigger>
          </Tooltip>

          <ResetZoomButton>Reset</ResetZoomButton>
          <VerticalDivider orientation="vertical" />
          <Tooltip title="Print">
            <ChartsToolbarPrintExportTrigger
              render={<ToolbarButton render={<IconButton size="small" />} />}
              options={{ fileName: 'ChartWithCustomToolbar' }}
            >
              <PrintIcon />
            </ChartsToolbarPrintExportTrigger>
          </Tooltip>
          <Tooltip title="Export as PNG">
            <ChartsToolbarImageExportTrigger
              render={<ToolbarButton render={<IconButton size="small" />} />}
              options={{ type: 'image/png', fileName: 'ChartWithCustomToolbar' }}
            >
              <PhotoIcon />
            </ChartsToolbarImageExportTrigger>
          </Tooltip>
        </Toolbar>
      </Stack>
    </Stack>
  );
}

export default function ChartsToolbarCustomToolbar() {
  return (
    <ScatterChartPro
      {...params}
      xAxis={[{ zoom: true }]}
      yAxis={[{ zoom: true }]}
      showToolbar
      slots={{ toolbar: CustomToolbar }}
      sx={{
        [`& .${chartsToolbarClasses.root}`]: {
          width: '100%',
          justifyContent: 'space-between',
          padding: 2,
          flex: 1,
          flexWrap: 'wrap',
          marginBottom: 2,
        },
      }}
    />
  );
}

```

## Accessibility

(WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

The component follows the WAI-ARIA authoring practices.

### ARIA

- The element rendered by the `<Toolbar />` component has the `toolbar` role.
- The element rendered by the `<Toolbar />` component has `aria-orientation` set to `horizontal`.
- You must apply a text label or an `aria-label` attribute to the `<ToolbarButton />`.

### Keyboard

The Toolbar component supports keyboard navigation.
It implements the roving tabindex pattern.

|                                                               Keys | Description                              |
| -----------------------------------------------------------------: | :--------------------------------------- |
|                                         <kbd class="key">Tab</kbd> | Moves focus into and out of the toolbar. |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Tab</kbd></kbd> | Moves focus into and out of the toolbar. |
|                                        <kbd class="key">Left</kbd> | Moves focus to the previous button.      |
|                                       <kbd class="key">Right</kbd> | Moves focus to the next button.          |
|                                        <kbd class="key">Home</kbd> | Moves focus to the first button.         |
|                                         <kbd class="key">End</kbd> | Moves focus to the last button.          |
