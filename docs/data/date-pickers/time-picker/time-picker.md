---
product: date-pickers
title: React Time Picker component
components: DesktopTimePicker, MobileTimePicker, StaticTimePicker, TimePicker, ClockPicker
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://material.io/components/time-pickers
---

# Time picker

<p class="description">Time pickers allow the user to select a single time.</p>

:::success
This component has received several major improvements on the new **v6 beta**:

- [Fields: the new default input for pickers](https://next.mui.com//x/react-date-pickers/fields/).
- [Improved layout customization](https://next.mui.com//x/react-date-pickers/custom-layout/)

You can also take a look at [the dedicated blog post](https://mui.com/blog/v6-beta-pickers/) and the [new documentation of the TimePicker](https://next.mui.com/x/react-date-pickers/time-picker/) for more information.
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

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.

{{"demo": "ResponsiveTimePickers.js"}}

## Form props

The time picker component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Time validation

{{"demo": "TimeValidationTimePicker.js"}}

## Landscape

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

## Sub-components

Some lower-level sub-components (`ClockPicker`) are also exported. These are rendered without a wrapper or outer logic (masked input, date values parsing and validation, etc.).

{{"demo": "SubComponentsTimePickers.js"}}

## Seconds

The seconds input can be used for selection of a precise time point.

{{"demo": "SecondsTimePicker.js"}}
