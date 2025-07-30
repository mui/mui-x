# HeatmapTooltip API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Charts - Heatmap

## Import

```jsx
import { HeatmapTooltip } from '@mui/x-charts-pro/Heatmap';
// or
import { HeatmapTooltip } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| anchorEl | `HTML element \| object \| func` | - | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| component | `elementType` | - | No |  |
| components (deprecated) | `{ Root?: elementType }` | `{}` | No | ⚠️ use the `slots` prop instead. This prop will be removed in a future major release. [How to migrate](/material-ui/migration/migrating-from-deprecated-apis/). |
| componentsProps (deprecated) | `{ root?: func \| object }` | `{}` | No | ⚠️ use the `slotProps` prop instead. This prop will be removed in a future major release. [How to migrate](/material-ui/migration/migrating-from-deprecated-apis/). |
| container | `(props, propName) => { if (props[propName] == null) { return new Error(`Prop '${propName}' is required but wasn't specified`); } if (typeof props[propName] !== 'object' \|  \| props[propName].nodeType !== 1) { return new Error(`Expected prop '${propName}' to be of type Element`); } return null; } \| func` | - | No |  |
| disablePortal | `bool` | `false` | No |  |
| keepMounted | `bool` | `false` | No |  |
| modifiers | `Array<{ data?: object, effect?: func, enabled?: bool, fn?: func, name?: any, options?: object, phase?: 'afterMain' \| 'afterRead' \| 'afterWrite' \| 'beforeMain' \| 'beforeRead' \| 'beforeWrite' \| 'main' \| 'read' \| 'write', requires?: Array<string>, requiresIfExists?: Array<string> }>` | - | No |  |
| open | `bool` | - | No |  |
| placement | `'auto-end' \| 'auto-start' \| 'auto' \| 'bottom-end' \| 'bottom-start' \| 'bottom' \| 'left-end' \| 'left-start' \| 'left' \| 'right-end' \| 'right-start' \| 'right' \| 'top-end' \| 'top-start' \| 'top'` | `'bottom'` | No |  |
| popperOptions | `{ modifiers?: array, onFirstUpdate?: func, placement?: 'auto-end' \| 'auto-start' \| 'auto' \| 'bottom-end' \| 'bottom-start' \| 'bottom' \| 'left-end' \| 'left-start' \| 'left' \| 'right-end' \| 'right-start' \| 'right' \| 'top-end' \| 'top-start' \| 'top', strategy?: 'absolute' \| 'fixed' }` | `{}` | No |  |
| popperRef | `func \| { current?: { destroy: func, forceUpdate: func, setOptions: func, state: { attributes: object, elements: object, modifiersData: object, options: object, orderedModifiers: Array<object>, placement: 'auto-end' \| 'auto-start' \| 'auto' \| 'bottom-end' \| 'bottom-start' \| 'bottom' \| 'left-end' \| 'left-start' \| 'left' \| 'right-end' \| 'right-start' \| 'right' \| 'top-end' \| 'top-start' \| 'top', rects: object, reset: bool, scrollParents: object, strategy: 'absolute' \| 'fixed', styles: object }, update: func } }` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| transition | `bool` | `false` | No |  |
| trigger | `'item' \| 'none'` | `'item'` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | axisValueCell | Styles applied to the axisValueCell element. Only available for axis tooltip. |
| - | cell | Styles applied to the cell element. |
| - | labelCell | Styles applied to the labelCell element. |
| - | mark | Styles applied to the mark element. |
| - | markContainer | Styles applied to the markContainer element. |
| - | paper | Styles applied to the paper element. |
| - | root | Styles applied to the root element. |
| - | row | Styles applied to the row element. |
| - | table | Styles applied to the table element. |
| - | valueCell | Styles applied to the valueCell element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts-pro/src/Heatmap/HeatmapTooltip/HeatmapTooltip.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts-pro/src/Heatmap/HeatmapTooltip/HeatmapTooltip.tsx)