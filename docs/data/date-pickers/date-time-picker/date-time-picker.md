---
product: date-pickers
title: React Date Time Picker component
components: NextDateTimePicker, DesktopNextDateTimePicker, MobileNextDateTimePicker, StaticNextDateTimePicker
githubLabel: 'component: DateTimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Picker

<p class="description">The Date Time Picker component let the user select a date and time.</p>

:::warning
The new Date Time Pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextDateTimePicker` will become `DateTimePicker`, ...)
:::

## Basic usage

{{"demo": "BasicDateTimePicker.js"}}

## Component composition

The component is built using the `DateTimeField` for the keyboard editing, the `DateCalendar` for the date view editing and the `TimeClock` for the time view editing.
All the documented props of those three components can also be passed to the Date Time Picker component.

Check-out their documentation page for more information:

- [Date Field](/x/react-date-pickers/date-field/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)
- [Time Clock](/x/react-date-pickers/time-clock/)

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "DateTimePickerValue.js"}}

## Responsiveness

The component is available in three variants:

- The `DesktopNextDateTimePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileNextDateTimePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `NextDateTimePicker` component which will render `DesktopNextDateTimePicker` or `MobileNextDateTimePicker` depending on the device it runs on.

  By default, it renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
  This can be customized with the `desktopModeMediaQuery` prop.

{{"demo": "ResponsiveDateTimePickers.js"}}

:::warning
There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.
:::

## Static mode

It is also possible to render the Date Time Picker component without the popover/modal and field.
This can be helpful when building custom popover/modal containers.

{{"demo": "StaticDateTimePickerDemo.js", "bg": true}}

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsDateTimePickers.js"}}

## Views

The component can contain six views: `day`, `month`, `year`, `hours`, `minutes` and `seconds`.
By default, only the `year`, `day`, `hours`, and `minutes` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"demo": "DateTimePickerViews.js"}}

## Landscape orientation

By default, the Date Time Picker component automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

{{"demo": "StaticDateTimePickerLandscape.js", "bg": true}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)

## Localization

You can find the documentation about localization in the [Date localization](/x/react-date-pickers/adapters-locale/) and [Component localization](/x/react-date-pickers/localization/).
