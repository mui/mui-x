---
productId: x-date-pickers
title: React Date Time Range Picker component
components: DateTimeRangePicker, DesktopDateTimeRangePicker, DateRangeCalendar, DateRangePickerDay, DigitalClock, MultiSectionDigitalClock
githubLabel: 'component: DateTimeRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

<p class="description">The Date Time Range Picker let the user select a range of dates with an explicit starting and ending time.</p>

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4547](https://github.com/mui/mui-x/issues/4547) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this component, or if you are facing a pain point with your current solution.
:::

## Basic usage

{{"demo": "BasicDateTimeRangePicker.js"}}

## Alternative views sequence

You can use `sequentialViewOrder` prop to use the pickers with a sequential views order.
In this mode the following views sequence will be used: **start date** -> **start time** -> **end date** -> **end time**.
The default views sequence is: **start date** -> **end date** -> **start time** -> **end time**

{{"demo": "SequentialDateTimeRangePicker.js"}}
