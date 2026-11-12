---
title: Charts and Scheduler integration
---

# Charts - Scheduler integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Learn how to show charts of the events of the Scheduler in its side panel.</p>

MUI X Charts integrate with the [Event Calendar](/x/react-scheduler/) to show cards about the visible events, which follow the date range, the resource visibility and the metric of the calendar. Clicking a bar or a slice highlights the matching events.

This integration is possible via the `createChartsFeature()` function from the `@mui/x-scheduler-premium` package, and the `<ChartsRenderer />` component from the `@mui/x-charts-premium` package.

Check [Event Calendar - Charts](/x/react-scheduler/event-calendar/charts/) for more information and examples.

The demo below shows how to implement all of the elements mentioned above:

{{"demo": "../../scheduler/event-calendar/charts/BasicCharts.js", "bg": "inline"}}
