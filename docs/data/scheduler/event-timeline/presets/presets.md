---
productId: x-scheduler
title: React Scheduler component
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline - Presets

<p class="description">Choose a time-scale preset to display events at daily, weekly, monthly, or yearly granularity.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

## Day and hour preset

The `dayAndHour` preset displays a few days with hourly granularity—ideal for scheduling tasks within specific hours.

{{"demo": "DayAndHourPreset.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `presetConfig` prop to limit the hours displayed for each day. The prop is keyed by preset name, and only the `dayAndHour` preset supports an hour range: `presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}` displays the 8:00 AM–8:00 PM window (`startTime` is inclusive, `endTime` exclusive: the last rendered hour cell is 7:00 PM, and an event ending exactly at 8:00 PM is still fully visible).

{{"demo": "DayAndHourStartEndTime.js", "bg": "inline", "defaultCodeOpen": false}}

Events that fall entirely within the hidden hours are not rendered at all. An event whose start or end falls inside the hidden hours is clipped to the window edge and flagged with the `data-starting-before-edge` / `data-ending-after-edge` attributes, like an event overflowing the visible date range. An event that only spans the hidden hours (for example a multi-day rental) keeps both edges and renders as a single continuous bar, with the hidden hours simply removed from the axis.

:::warning
`startTime` and `endTime` must be whole hours (integers between `0` and `24`) with `startTime` lower than `endTime`. Minute-level precision isn't supported yet. An invalid range falls back to the full day and logs a warning in development.
:::

The [Event Calendar's day and week views](/x/react-scheduler/event-calendar/views/) support the same hour range through their `viewConfig` prop.

## Day and month preset

The `dayAndMonth` preset displays several weeks with daily granularity grouped by month—ideal for bookings and short-term planning.

{{"demo": "DayAndMonthPreset.js", "bg": "inline", "defaultCodeOpen": false}}

## Day and week preset

The `dayAndWeek` preset displays several months with weekly granularity—ideal for project planning and sprint tracking.

{{"demo": "DayAndWeekPreset.js", "bg": "inline", "defaultCodeOpen": false}}

## Month and year preset

The `monthAndYear` preset displays several years with monthly granularity—ideal for long-term roadmaps and strategic planning.

{{"demo": "MonthAndYearPreset.js", "bg": "inline", "defaultCodeOpen": false}}

## Year preset

The `year` preset displays decades with yearly granularity—ideal for high-level overviews of multi-year initiatives.

{{"demo": "YearPreset.js", "bg": "inline", "defaultCodeOpen": false}}

## Zoom in and out 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21596) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to zoom in and out of the timeline to adjust the visible time range.
