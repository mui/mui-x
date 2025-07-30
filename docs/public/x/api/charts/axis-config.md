# AxisConfig API

## Import

```jsx
import { AxisConfig } from '@mui/x-charts-pro'
// or
import { AxisConfig } from '@mui/x-charts'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| id | `AxisId` | - | Yes |  |
| scaleType | `'band'` | - | Yes |  |
| classes | `Partial<ChartsAxisClasses>` | - | No |  |
| colorMap | `OrdinalColorConfig \| ContinuousColorConfig \| PiecewiseColorConfig` | - | No |  |
| data | `readonly V[]` | - | No |  |
| dataKey | `string` | - | No |  |
| disableLine | `boolean` | `false` | No |  |
| disableTicks | `boolean` | `false` | No |  |
| domainLimit | `'nice' \| 'strict' \| ((min: number, max: number) => { min: number; max: number })` | - | No |  |
| fill | `string` | `'currentColor'` | No |  |
| height | `number` | `30` | No |  |
| hideTooltip | `boolean` | - | No |  |
| ignoreTooltip | `boolean` | - | No |  |
| label | `string` | - | No |  |
| labelStyle | `ChartsTextProps['style']` | - | No |  |
| max | `number \| Date` | - | No |  |
| min | `number \| Date` | - | No |  |
| offset | `number` | `0` | No |  |
| position | `'top' \| 'bottom' \| 'none'` | - | No |  |
| reverse | `boolean` | - | No |  |
| slotProps | `Partial<ChartsAxisSlotProps>` | `{}` | No |  |
| slots | `Partial<ChartsAxisSlots>` | `{}` | No |  |
| stroke | `string` | `'currentColor'` | No |  |
| sx | `SxProps` | - | No |  |
| tickInterval | `'auto' \| ((value: any, index: number) => boolean) \| any[]` | `'auto'` | No |  |
| tickLabelInterval | `'auto' \| ((value: any, index: number) => boolean)` | `'auto'` | No |  |
| tickLabelPlacement | `'middle' \| 'tick'` | `'middle'` | No |  |
| tickLabelStyle | `ChartsTextProps['style']` | - | No |  |
| tickMaxStep | `number` | - | No |  |
| tickMinStep | `number` | - | No |  |
| tickNumber | `number` | - | No |  |
| tickPlacement | `'start' \| 'end' \| 'middle' \| 'extremities'` | `'extremities'` | No |  |
| tickSize | `number` | `6` | No |  |
| valueFormatter | `<TScaleName extends S>(value: V, context: AxisValueFormatterContext<TScaleName>) => string` | - | No |  |
| zoom | `boolean \| ZoomOptions` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.