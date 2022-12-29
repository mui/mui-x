---
product: date-pickers
title: React Time Picker component
components: NextTimePicker, DesktopNextTimePicker, MobileNextTimePicker, StaticNextTimePicker
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/time-pickers
---

# Time Picker

<p class="description">Time Picker let the user select a time.</p>

:::warning
The new Time Pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextTimePicker` will become `TimePicker`, ...)
:::

The selected time is indicated by the filled circle at the end of the clock hand.

## Basic usage

The Time Picker is rendered as a modal dialog on mobile, and in the field on desktop.

{{"demo": "BasicTimePicker.js"}}

## Component composition

The Time Picker components are built using the `TimeField` for the keyboard editing and the `TimeClock` for the view editing.
All the documented props of those two components can also be passed to the Time Picker components.

Check-out their documentation page for more information:

- [Time Field](/x/react-date-pickers/time-field/)
- [Time Clock](/x/react-date-pickers/time-clock/)

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "TimePickerValue.js"}}

## Responsiveness

The Time picker Component is designed and optimized for the device it runs on.

- The `MobileNextTimePicker` component works best for touch devices and small screens.
- The `DesktopNextTimePicker` component works best for mouse devices and large screens.

By default, the `NextTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.

{{"demo": "ResponsiveTimePickers.js"}}

## Static mode

It is also possible to render any Time Picker without the modal/popover and text field.
This will enable building custom popover/modal containers.

{{"demo": "StaticTimePickerDemo.js", "bg": true}}

## Form props

The Time Picker component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Views

The component can contain three views: `hours`, `minutes`, and `seconds`.
By default, only the `hours` and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"demo": "TimePickerViews.js"}}

## Landscape orientation

By default, the Time Picker automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)
