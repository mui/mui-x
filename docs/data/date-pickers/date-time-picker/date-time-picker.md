---
product: date-pickers
title: React Date Time Picker component
components: DateTimePicker,DesktopDateTimePicker,MobileDateTimePicker,StaticDateTimePicker
githubLabel: 'component: DateTimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://material.io/components/date-pickers
---

# Date time picker

<p class="description">This component combines the date & time pickers.</p>

It allows the user to select both date and time with the same control.

Note that this component is the [DatePicker](/x/react-date-pickers/date-picker/) and [TimePicker](/x/react-date-pickers/time-picker/)
component combined, so any of these components' props can be passed to the DateTimePicker.

## Basic usage

Allows choosing date then time. There are 4 steps available (year, date, hour and minute), so tabs are required to visually distinguish date/time steps.

{{"demo": "BasicDateTimePicker.js"}}

## Responsiveness

The `DateTimePicker` component is designed and optimized for the device it runs on.

- The `MobileDateTimePicker` component works best for touch devices and small screens.
- The `DesktopDateTimePicker` component works best for mouse devices and large screens.

By default, the `DateTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

{{"demo": "ResponsiveDateTimePickers.js"}}

## Form props

The date time picker component can be disabled or read-only.

{{"demo": "FormPropsDateTimePickers.js"}}

## Date and time validation

It is possible to restrict date and time selection in two ways:

- by using `minDateTime`/`maxDateTime` its possible to restrict time selection to before or after a particular moment in time
- using `minTime`/`maxTime`, you can disable selecting times before or after a certain time each day respectively

{{"demo": "DateTimeValidation.js"}}

## Static mode

It's possible to render any date & time picker inline. This will enable building custom popover/modal containers.

{{"demo": "StaticDateTimePickerDemo.js", "bg": true}}

## Customization

Here are some examples of heavily customized date & time pickers:

{{"demo": "CustomDateTimePicker.js"}}
