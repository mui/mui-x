---
product: date-pickers
title: React Time Clock component
components: TimeClock
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Time Clock

<p class="description">The Time Clock lets the user select a time without any input or popper / modal.</p>

## Basic usage

{{"demo": "BasicTimeClock.js"}}

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "TimeClockValue.js"}}

## Form props

The component can be disabled or read-only.

{{"demo": "TimeClockFormProps.js"}}

## Views

The component can contain three views: `hours`, `minutes`, and `seconds`.
By default, only the `hours` and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"demo": "TimeClockViews.js"}}

## 12h/24h format

By default, the component uses the hour format of the locale's time setting, i.e. the 12-hour or 24-hour format.

You can force a specific format using the `ampm` prop.

You can find more information about 12h/24h format in the [Date localization page](/x/react-date-pickers/adapters-locale/#12h-24h-format).

{{"demo": "TimeClockAmPm.js"}}
