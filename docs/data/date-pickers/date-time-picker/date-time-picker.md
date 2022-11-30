---
product: date-pickers
title: React Date Time Picker component
components: DateTimePicker,DesktopDateTimePicker,MobileDateTimePicker,StaticDateTimePicker
githubLabel: 'component: DateTimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Picker

<p class="description">This component combines the date & time pickers.</p>

:::warning
The new date time pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextDateTimePicker` will become `DateTimePicker`, ...)
:::

It allows the user to select both date and time with the same control.

Note that this component is the [NextDatePicker](/x/react-date-pickers/date-picker/) and [NextTimePicker](/x/react-date-pickers/time-picker/)
component combined, so any of these components' props can be passed to the DateTimePicker.

## Basic usage

Allows choosing date then time. There are 4 steps available (year, date, hour, and minute), so tabs are required to visually distinguish date/time steps.

{{"demo": "BasicDateTimePicker.js"}}

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "DateTimePickerValue.js"}}

## Responsiveness

The `NextDateTimePicker` component is designed and optimized for the device it runs on.

- The `MobileNextDateTimePicker` component works best for touch devices and small screens.
- The `DesktopNextDateTimePicker` component works best for mouse devices and large screens.

By default, the `NextDateTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.

{{"demo": "ResponsiveDateTimePickers.js"}}

## Static mode

It is also possible to render any date time picker without the modal/popover and text field.
This will enable building custom popover/modal containers.

{{"demo": "StaticDateTimePickerDemo.js", "bg": true}}

## Form props

The date time picker component can be disabled or read-only.

{{"demo": "FormPropsDateTimePickers.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)

## Customization

Here are some examples of heavily customized date & time pickers:

{{"demo": "CustomDateTimePicker.js"}}
