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
- Europe: [EAA](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en) (European Accessibility Act)

WCAG 2.1 has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what this library aims to support.

The WAI-ARIA Authoring Practices includes examples on [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).

## Animation

Some charts have animations when rendering or when data updates.
For users with vestibular motion disorders those animations can be problematic.
By default animations are toggled based on the [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) media feature.

<!--
## Screen reader compatibility

Date and Time Pickers use ARIA roles and robust focus management across the interactive elements to convey the necessary information to users, being optimized for use with assistive technologies.
-->

## Keyboard support

:::warning
This feature is under development.
The way keyboard interaction is visualized will evolve.

For example the element highlight, or tooltip will be impacted by the feature.
Those modifications will not be considered as breaking changes and so be added during minor or patch versions.
:::

Set `enableKeyboardNavigation` to `true` to enable the keyboard navigation on your charts.
You can also enable it globally using [theme default props](/material-ui/customization/theme-components/#theme-default-props)

```js
components: {
  MuiChartDataProvider: {
    defaultProps: {
      enableKeyboardNavigation: true
    },
  },
}
```

{{"demo": "KeyboardNavigation.js"}}

This feature is currently supported by the following charts: line, bar, pie, scatter, sparkline, funnel, radar, heatmap, sankey, and range-bar.

This makes the SVG component focusable thanks to [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex).
When focused, the chart highlights a value item that can be modified with arrow navigation.

|                                                                  Keys | Description                   |
| --------------------------------------------------------------------: | :---------------------------- |
| <kbd class="key">Arrow Left</kbd>, <kbd class="key">Arrow Right</kbd> | Moves focus inside the series |
|    <kbd class="key">Arrow Up</kbd>, <kbd class="key">Arrow Down</kbd> | Move focus between series     |

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
