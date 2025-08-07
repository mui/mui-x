# RadarChartPro API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Charts - Export
- [Charts - Radar](/x/react-charts/radar/)

## Import

```jsx
import { RadarChartPro } from '@mui/x-charts-pro/RadarChartPro';
// or
import { RadarChartPro } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| radar | `{ labelFormatter?: func, labelGap?: number, max?: number, metrics: Array<string> \| Array<{ max?: number, min?: number, name: string }>, startAngle?: number }` | - | Yes |  |
| series | `Array<object>` | - | Yes |  |
| colors | `Array<string> \| func` | `rainbowSurgePalette` | No |  |
| disableAxisListener | `bool` | `false` | No |  |
| divisions | `number` | `5` | No |  |
| height | `number` | - | No |  |
| hideLegend | `bool` | - | No |  |
| highlight | `'axis' \| 'none' \| 'series'` | `'axis'` | No |  |
| highlightedItem | `{ dataIndex?: number, seriesId: number \| string }` | - | No |  |
| id | `string` | - | No |  |
| loading | `bool` | `false` | No |  |
| localeText | `object` | - | No |  |
| margin | `number \| { bottom?: number, left?: number, right?: number, top?: number }` | - | No |  |
| onAreaClick | `function(event: React.MouseEvent<SVGPathElement, MouseEvent>, radarItemIdentifier: RadarItemIdentifier) => void` | - | No |  |
| onAxisClick | `function(event: MouseEvent, data: null \| ChartsAxisData) => void` | - | No |  |
| onHighlightChange | `function(highlightedItem: HighlightItemData \| null) => void` | - | No |  |
| onMarkClick | `function(event: React.MouseEvent<SVGPathElement, MouseEvent>, radarItemIdentifier: RadarItemIdentifier) => void` | - | No |  |
| shape | `'circular' \| 'sharp'` | `'sharp'` | No |  |
| showToolbar | `bool` | `false` | No |  |
| skipAnimation | `bool` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| stripeColor | `function(index: number) => string` | `(index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'` | No |  |
| width | `number` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| baseButton | `undefined` | - |  |
| baseDivider | `undefined` | - |  |
| baseIconButton | `undefined` | - |  |
| baseMenuItem | `undefined` | - |  |
| baseMenuList | `undefined` | - |  |
| basePopper | `undefined` | - |  |
| baseTooltip | `undefined` | - |  |
| exportIcon | `ChartsExportIcon` | - | Icon displayed on the toolbar's export button. |
| legend | `ChartsLegend` | - | Custom rendering of the legend. |
| loadingOverlay | `ChartsLoadingOverlay` | - | Overlay component rendered when the chart is in a loading state. |
| noDataOverlay | `ChartsNoDataOverlay` | - | Overlay component rendered when the chart has no data to display. |
| toolbar | `ChartsToolbar` | - | Custom component for the toolbar. |
| tooltip | `ChartsTooltipRoot` | - | Custom component for the tooltip popper. |
| zoomInIcon | `ChartsZoomInIcon` | - | Icon displayed on the toolbar's zoom in button. |
| zoomOutIcon | `ChartsZoomOutIcon` | - | Icon displayed on the toolbar's zoom out button. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts-pro/src/RadarChartPro/RadarChartPro.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts-pro/src/RadarChartPro/RadarChartPro.tsx)