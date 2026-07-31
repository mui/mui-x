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

Use the `presetConfig` prop to limit the hours displayed for each day. The prop is keyed by preset name, and only the `dayAndHour` preset supports an hour range: `presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}` displays 8:00 AM through 7:59 PM (`startTime` is inclusive, `endTime` exclusive).

{{"demo": "DayAndHourStartEndTime.js", "bg": "inline", "defaultCodeOpen": false}}

Events that fall entirely within the hidden hours are not rendered at all. An event that only partially overlaps the hidden hours is clipped to the visible window and flagged with the `data-starting-before-edge` / `data-ending-after-edge` attributes, like an event overflowing the visible date range.

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
