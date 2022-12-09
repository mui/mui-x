---
product: date-pickers
title: React Time Picker component
components: NextTimePicker, DesktopNextTimePicker, MobileNextTimePicker, StaticNextTimePicker, TimeClock
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/time-pickers
---

# Time Picker

<p class="description">Time pickers allow the user to select a single time.</p>

:::warning
The new time pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextTimePicker` will become `TimePicker`, ...)
:::

The selected time is indicated by the filled circle at the end of the clock hand.

## Basic usage

The time picker is rendered as a modal dialog on mobile, and in the field on desktop.

{{"demo": "BasicTimePicker.js"}}

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "TimePickerValue.js"}}

## Responsiveness

The time picker component is designed and optimized for the device it runs on.

- The `MobileNextTimePicker` component works best for touch devices and small screens.
- The `DesktopNextTimePicker` component works best for mouse devices and large screens.

By default, the `NextTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.

{{"demo": "ResponsiveTimePickers.js"}}

## Static mode

It is also possible to render any time picker without the modal/popover and text field.
This will enable building custom popover/modal containers.

{{"demo": "StaticTimePickerDemo.js", "bg": true}}

## Form props

The time picker component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)

## Landscape

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

## Sub-components

Some lower-level sub-components (`ClockPicker`) are also exported.

{{"demo": "SubComponentsTimeCalendars.js"}}

## Seconds

The seconds input can be used for selection of a precise time point.

{{"demo": "SecondsTimePicker.js"}}
