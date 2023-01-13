---
product: date-pickers
title: React Time Picker component
components: DesktopTimePicker, MobileTimePicker, StaticTimePicker, TimePicker
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/time-pickers
---

# Time Picker

<p class="description">Time pickers allow the user to select a single time.</p>

:::warning
This page describes how the legacy time pickers work.
If you are already using the v6 alpha or beta, we recommend you to try the [new time pickers](/x/react-date-pickers/time-picker/).

At the end of the v6 beta phase, the legacy time pickers will be removed and replaced the new time pickers
(which will be renamed to match the current name of the legacy pickers).
:::

The selected time is indicated by the filled circle at the end of the clock hand.

## Basic usage

The time picker is rendered as a modal dialog on mobile, and a textbox with a popup on desktop.

{{"demo": "BasicTimePicker.js"}}

## Static mode

It's possible to render any time picker inline. This will enable building custom popover/modal containers.

{{"demo": "StaticTimePickerDemo.js", "bg": true}}

## Responsiveness

The time picker component is designed and optimized for the device it runs on.

- The `MobileTimePicker` component works best for touch devices and small screens.
- The `DesktopTimePicker` component works best for mouse devices and large screens.

By default, the `TimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/introduction/#testing-caveats) for more information.

{{"demo": "ResponsiveTimePickers.js"}}

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
