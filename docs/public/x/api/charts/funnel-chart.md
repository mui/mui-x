# FunnelChart API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Charts - Export
- Charts - Funnel 🧪
- Charts - Pyramid 🧪

## Import

```jsx
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
// or
import { FunnelChart } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| series | `Array<object>` | - | Yes |  |
| axisHighlight | `{ x?: 'band' \| 'line' \| 'none', y?: 'band' \| 'line' \| 'none' }` | - | No |  |
| categoryAxis | `{ categories?: Array<string>, disableLine?: bool, disableTicks?: bool, id?: number \| string, position?: 'bottom' \| 'left' \| 'none' \| 'right' \| 'top', scaleType?: 'band', size?: number, tickLabelStyle?: object, tickSize?: number } \| { categories?: Array<string>, disableLine?: bool, disableTicks?: bool, id?: number \| string, position?: 'bottom' \| 'left' \| 'none' \| 'right' \| 'top', scaleType?: 'log', size?: number, tickLabelStyle?: object, tickSize?: number } \| { categories?: Array<string>, disableLine?: bool, disableTicks?: bool, id?: number \| string, position?: 'bottom' \| 'left' \| 'none' \| 'right' \| 'top', scaleType?: 'pow', size?: number, tickLabelStyle?: object, tickSize?: number } \| { categories?: Array<string>, disableLine?: bool, disableTicks?: bool, id?: number \| string, position?: 'bottom' \| 'left' \| 'none' \| 'right' \| 'top', scaleType?: 'sqrt', size?: number, tickLabelStyle?: object, tickSize?: number } \| { categories?: Array<string>, disableLine?: bool, disableTicks?: bool, id?: number \| string, position?: 'bottom' \| 'left' \| 'none' \| 'right' \| 'top', scaleType?: 'time', size?: number, tickLabelStyle?: object, tickSize?: number } \| { categories?: Array<string>, disableLine?: bool, disableTicks?: bool, id?: number \| string, position?: 'bottom' \| 'left' \| 'none' \| 'right' \| 'top', scaleType?: 'utc', size?: number, tickLabelStyle?: object, tickSize?: number } \| { categories?: Array<string>, disableLine?: bool, disableTicks?: bool, id?: number \| string, position?: 'bottom' \| 'left' \| 'none' \| 'right' \| 'top', scaleType?: 'linear', size?: number, tickLabelStyle?: object, tickSize?: number }` | `{ position: 'none' }` | No |  |
| colors | `Array<string> \| func` | `rainbowSurgePalette` | No |  |
| disableAxisListener | `bool` | `false` | No |  |
| gap | `number` | `0` | No |  |
| height | `number` | - | No |  |
| hideLegend | `bool` | `false` | No |  |
| highlightedItem | `{ dataIndex?: number, seriesId: number \| string }` | - | No |  |
| id | `string` | - | No |  |
| loading | `bool` | `false` | No |  |
| localeText | `object` | - | No |  |
| margin | `number \| { bottom?: number, left?: number, right?: number, top?: number }` | - | No |  |
| onAxisClick | `function(event: MouseEvent, data: null \| ChartsAxisData) => void` | - | No |  |
| onHighlightChange | `function(highlightedItem: HighlightItemData \| null) => void` | - | No |  |
| onItemClick | `function(event: React.MouseEvent<SVGElement, MouseEvent>, funnelItemIdentifier: FunnelItemIdentifier) => void` | - | No |  |
| skipAnimation | `bool` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| width | `number` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (SVGSVGElement).

> Any other props supplied will be provided to the root element (native element).

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| axisLabel | `ChartsText` | - | Custom component for axis label. |
| axisLine | `'line'` | - | Custom component for the axis main line. |
| axisTick | `'line'` | - | Custom component for the axis tick. |
| axisTickLabel | `ChartsText` | - | Custom component for tick label. |
| baseButton | `undefined` | - |  |
| baseIconButton | `undefined` | - |  |
| funnelSection | `FunnelSection` | - | Custom component for funnel section. |
| funnelSectionLabel | `FunnelSectionLabel` | - | Custom component for funnel section label. |
| legend | `ChartsLegend` | - | Custom rendering of the legend. |
| loadingOverlay | `ChartsLoadingOverlay` | - | Overlay component rendered when the chart is in a loading state. |
| noDataOverlay | `ChartsNoDataOverlay` | - | Overlay component rendered when the chart has no data to display. |
| toolbar | `ChartsToolbar` | - | Custom component for the toolbar. |
| tooltip | `ChartsTooltipRoot` | - | Custom component for the tooltip popper. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts-pro/src/FunnelChart/FunnelChart.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts-pro/src/FunnelChart/FunnelChart.tsx)