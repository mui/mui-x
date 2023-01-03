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

## Available components

The component is available in four variants:

- The `DesktopNextTimePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileNextTimePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `NextTimePicker` component which renders `DesktopNextTimePicker` or `MobileNextTimePicker` depending on the device it runs on.

- The `StaticTimePicker` component which renders without the popover/modal and field.

{{"demo": "ResponsiveTimePickers.js"}}

By default, the `NextTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for solutions.
:::

## Static mode

It is also possible to render the Time Picker component without the popover/modal and field.
This will enable building custom popover/modal containers.

{{"demo": "StaticTimePickerDemo.js", "bg": true}}

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Views

The component supports three views: `hours`, `minutes` and `seconds`.

By default, the `hours` and `minutes` views are enabled.
Use the `views` prop to change this behavior:

{{"demo": "TimePickerViews.js"}}

By default, the component renders the `hours` view on mount.
Use the `openTo` prop to change this behavior:

{{"demo": "TimePickerOpenTo.js"}}

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow.
:::

## Landscape orientation

By default, the Time Picker component automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)
