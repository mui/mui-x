---
product: date-pickers
title: React Time Picker component
components: NextTimePicker, DesktopNextTimePicker, MobileNextTimePicker, StaticNextTimePicker
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/time-pickers
---

# Time Picker

<p class="description">The Time Picker component let the user select a time.</p>

:::warning
The new Time Pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextTimePicker` will become `TimePicker`, ...)
:::

## Basic usage

{{"demo": "BasicTimePicker.js"}}

## Component composition

The component is built using the `TimeField` for the keyboard editing and the `TimeClock` for the view editing.
All the documented props of those two components can also be passed to the Time Picker component.

Check-out their documentation page for more information:

- [Time Field](/x/react-date-pickers/time-field/)
- [Time Clock](/x/react-date-pickers/time-clock/)

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "TimePickerValue.js"}}

## Responsiveness

The component is available in three variants:

- The `DesktopNextTimePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileNextTimePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `NextTimePicker` component which will render `DesktopNextTimePicker` or `MobileNextTimePicker` depending on the device it runs on.

  By default, it renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
  This can be customized with the `desktopModeMediaQuery` prop.

{{"demo": "ResponsiveTimePickers.js"}}

:::warning
There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.
:::

## Static mode

It is also possible to render the Time Picker component without the popover/modal and field.
This will enable building custom popover/modal containers.

{{"demo": "StaticTimePickerDemo.js", "bg": true}}

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Views

The component can contain three views: `hours`, `minutes`, and `seconds`.
By default, only the `hours` and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"demo": "TimePickerViews.js"}}

## Landscape orientation

By default, the Time Picker component automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)
