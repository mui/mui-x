---
productId: x-charts
title: Charts - Accessibility
packageName: '@mui/x-charts'
---

# Charts - Accessibility

<p class="description">Learn how the Charts implement accessibility features and guidelines, including keyboard navigation that follows international standards.</p>

:::info
A common misconception about accessibility is to only consider blind people and the screen reader.
But there are other disability to consider, like:

- **Color blindness**, making it hard to distinguish different series, or low contrast elements.
- **Motion disability**, making it hard to open the tooltip on a given item.
- **Cognitive disability**, making it hard to focus your attention on some details.
- **Vestibular dysfunction**, making you uncomfortable with animations.

:::

## Guidelines

Common conformance guidelines for accessibility include:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en) (European Accessibility Act)

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what this library aims to support.

The WAI-ARIA Authoring Practices includes examples on [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).

## Animation

Some charts have animations when rendering or when data updates.
For users with vestibular motion disorders those animations can be problematic.
By default animations are toggled based on the [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) media feature.

## Keyboard support

:::warning
This feature is under development.
The way keyboard interaction is visualized will evolve.

For example the element highlight, or tooltip will be impacted by the feature.
Those modifications will not be considered as breaking changes and so be added during minor or patch versions.
:::

The keyboard navigation is enabled by default on all charts.
You can disable it by setting `disableKeyboardNavigation` to `true`.
You can also disable it globally using [theme default props](/material-ui/customization/theme-components/#theme-default-props)

```js
components: {
  MuiChartsDataProvider: {
    defaultProps: {
      disableKeyboardNavigation: true
    },
  },
}
```

{{"demo": "KeyboardNavigation.js"}}

This feature is currently supported by the following charts: line, bar, pie, scatter, sparkline, funnel, radar, heatmap, sankey, map, radial bar, radial line, and range bar.

This makes the SVG component focusable thanks to [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex).
When focused, the chart highlights a value item that can be modified with arrow navigation.

|                                                                  Keys | Description                   |
| --------------------------------------------------------------------: | :---------------------------- |
| <kbd class="key">Arrow Left</kbd>, <kbd class="key">Arrow Right</kbd> | Moves focus inside the series |
|    <kbd class="key">Arrow Up</kbd>, <kbd class="key">Arrow Down</kbd> | Move focus between series     |

### Start from a clicked item

Clicking an item makes it the item keyboard navigation resumes from, so users can jump straight to a distant data point instead of tabbing into the chart and pressing an arrow key repeatedly.
Screen readers announce the clicked item right away.

A click that lands on no item is resolved from the axis under the pointer, so clicking the empty space above a bar still focuses that bar's column.
The item is taken from the series being navigated, or from the first series when none is focused yet.
Clicks that resolve to no item at all are ignored, so clicking next to a pie leaves the focus where it was.

How the focus indicator behaves depends on how the user got there:

- If the chart was not being navigated with the keyboard, the click gives the chart focus but the indicator stays hidden. It appears on the next key press, on the item next to the one clicked.
- If the focus indicator is already visible, the click moves it to the clicked item and keeps it visible.

Set `focusItemOnClick` to show the indicator immediately on every click:

```jsx
<BarChart focusItemOnClick series={series} />
```

It can also be set globally using [theme default props](/material-ui/customization/theme-components/#theme-default-props):

```js
components: {
  MuiChartsDataProvider: {
    defaultProps: {
      focusItemOnClick: true
    },
  },
}
```

### Activating the focused item

Charts can trigger their click callbacks from the keyboard, so mouse-only interactions such as drill-down or filtering stay available to keyboard users ([WCAG 2.1 SC 2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)).

It is opt-in on every chart, so existing callbacks keep receiving pointer events only:

```jsx
<BarChart
  experimentalFeatures={{ keyboardActivation: true }}
  onItemClick={(event, item) => {}}
  {...otherProps}
/>
```

Pressing <kbd class="key">Enter</kbd> or <kbd class="key">Space</kbd> on the focused item then calls `onItemClick` with the same payload a click provides.

The `event` argument is the `KeyboardEvent` that triggered the activation.
The callback types keep describing the pointer event to avoid a breaking change, so opt into the wider type with a module augmentation:

```ts
import type {} from '@mui/x-charts/moduleAugmentation/keyboardActivation';
```

The click callbacks then receive `MouseEvent | KeyboardEvent`, and you can narrow with `event instanceof KeyboardEvent` before reading pointer-only properties such as `clientX`.
Both become the default in v10.

{{"demo": "KeyboardActivation.js"}}

When a chart exposes several item callbacks, activation fires the one a pointer would reach first on the focused data point: line charts try `onMarkClick`, then `onLineClick`, then `onAreaClick`; radar charts try `onMarkClick`, then `onAreaClick`; and Sankey charts call `onNodeClick` or `onLinkClick` depending on the focused element. Only one of them fires.

Activation acts on the visible focus indicator.
A click sets the item keyboard navigation resumes from without revealing it, so <kbd class="key">Enter</kbd> and <kbd class="key">Space</kbd> do nothing until a key press makes the focus visible.

## Screen reader compatibility

Charts use a proxy strategy to support screen reader when user navigate with keyboard navigation.

The description of the focused element is localized.
You can customize it by using [localization key](/x/react-charts/localization/#localize-text).
The `[type]Description` localization keys are functions for a given series type, for example, `pieDescription` for pie charts.
These functions receives values related to the focused item, and should return the description to display.

### Composition

The focus highlight is done with a dedicated SVG element.
When using composition, you've to add this component to make the focus visible.

Each series type has its own component:

```js
import { FocusedBar } from '@mui/x-charts/BarChart';
import { FocusedPieArc } from '@mui/x-charts/PieChart';
import { FocusedLineMark } from '@mui/x-charts/LineChart';
import { FocusedScatterMark } from '@mui/x-charts/ScatterChart';
import { FocusedRadarMark } from '@mui/x-charts/RadarChart';
import { FocusedHeatmapCell } from '@mui/x-charts-pro/Heatmap';
import { FocusedFunnelSection } from '@mui/x-charts-pro/FunnelChart';
import { FocusedSankeyLink, FocusedSankeyNode } from '@mui/x-charts-pro/SankeyChart';
```

### Custom components

Click-to-focus reads the item the pointer is over, which every series already reports for the tooltip and the highlight.
A custom component rendered through a slot inherits that for free, as long as it forwards the interaction props to the rendered element:

```jsx
function CustomMarker({
  x,
  y,
  color,
  seriesId,
  dataIndex,
  isHighlighted,
  isFaded,
  ...other
}) {
  // `other` carries the pointer handlers that report the item.
  return (
    <path d={shape} transform={`translate(${x}, ${y})`} fill={color} {...other} />
  );
}
```

When building a plot from scratch rather than through a slot, `useInteractionItemProps` returns those handlers for an item:

```jsx
import { useInteractionItemProps } from '@mui/x-charts/internals';

function CustomPlotItem({ seriesId, dataIndex }) {
  return <rect {...useInteractionItemProps({ type: 'bar', seriesId, dataIndex })} />;
}
```
