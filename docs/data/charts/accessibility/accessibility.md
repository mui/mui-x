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
Clicks outside of any axis only give the chart focus, keeping the item that was focused before.

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
