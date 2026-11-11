---
productId: x-scheduler
title: React Scheduler component - Charts
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: EventCalendarPremium
---

# Event Calendar - Charts [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Show charts of the visible events in the side panel, and highlight the events behind a bar or a slice.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

The charts feature adds cards under the resources tree of the side panel.
The cards follow the visible date range, the resource visibility and the metric you pick.
They are drawn by the [MUI X Charts](/x/react-charts/) package, which is not a dependency of the Scheduler: you pass the chart renderer to the feature, the same way you pass it to the [Data Grid](/x/react-data-grid/charts-integration/).

## Basic usage

Import `createChartsFeature` from `@mui/x-scheduler-premium/charts` and `ChartsRenderer` from `@mui/x-charts-premium/ChartsRenderer`, then enable the feature through the `features` prop of the Event Calendar.

```tsx
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';

const features = { charts: createChartsFeature({ renderer: ChartsRenderer }) };

<EventCalendarPremium features={features} />;
```

By default the feature shows two cards:

- **Hours per day**: a stacked column chart with one series per resource.
- **Share by resource**: a donut with one slice per resource.

Click a bar segment or a slice to highlight its events in the calendar and dim the others.
Click it again, press <kbd class="key">Esc</kbd>, click anywhere else, or navigate to another date to clear the highlight.

{{"demo": "BasicCharts.js", "bg": "inline"}}

:::info
The `features` prop is read once, when the component mounts.
Define the features outside of the component (or memoize them) and pass the same object on every render.
:::

The cards are only shown in the side panel of the Event Calendar: the standalone views and the compact layout, which has no side panel, ignore the feature.

## Cards and metric

Use `cards` to pick the cards to show and their order, and `metric` to count events instead of summing their hours.
All-day events have no hours, so use `metric: 'count'` for datasets made of all-day events.

```tsx
const features = {
  charts: createChartsFeature({
    renderer: ChartsRenderer,
    cards: ['shareByResource'],
    metric: 'count',
  }),
};
```

{{"demo": "ConfiguredCards.js", "bg": "inline"}}

## Nested resources

When the resources are nested, the share by resource card draws two rings: the root resources inside, and the resources the events belong to outside.
Click a root slice to highlight the events of all its descendants.
The dataset below is made of all-day events, hence `metric: 'count'`.

{{"demo": "NestedResources.js", "bg": "inline"}}

## Custom cards 🚧

:::warning
This feature isn't available yet, but it is planned.
:::
