---
product: date-pickers
title: React Date Picker component
components: NextDatePicker, DesktopNextDatePicker, MobileNextDatePicker, StaticNextDatePicker
githubLabel: 'component: DatePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Picker

<p class="description">The Date Picker component let the user select a date.</p>

:::warning
The new Date Pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextDatePicker` will become `DatePicker`, ...)
:::

## Basic usage

{{"demo": "BasicDatePicker.js"}}

## Component composition

The component is built using the `DateField` for the keyboard editing and the `DateCalendar` for the view editing.
All the documented props of those two components can also be passed to the Date Picker component.

Check-out their documentation page for more information:

- [Date Field](/x/react-date-pickers/date-field/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "DatePickerValue.js"}}

## Available components

The component is available in four variants:

- The `DesktopNextDatePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileNextDatePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `NextDatePicker` component which renders `DesktopNextDatePicker` or `MobileNextDatePicker` depending on the device it runs on.

- The `StaticDatePicker` component which renders without the popover/modal and field.

{{"demo": "ResponsiveDatePickers.js"}}

By default, the `NextDatePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/introduction/#testing-caveats) for solutions.
:::

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsDatePickers.js"}}

## Views

The component supports three views: `day`, `month`, and `year`.

By default, the `day` and `year` views are enabled.
Use the `views` prop to change this behavior:

{{"demo": "DatePickerViews.js"}}

By default, the component renders the `day` view on mount.
Use the `openTo` prop to change this behavior:

{{"demo": "DatePickerOpenTo.js"}}

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow
(e.g. view the default behaviors, the `year` is only accessible when clicking on the toolbar).
:::

## Landscape orientation

By default, the Date Picker component automatically sets the orientation based on the `window.orientation` value.
You can force a specific orientation using the `orientation` prop:

{{"demo": "StaticDatePickerLandscape.js", "bg": true}}

## Helper text

You can show a helper text with the date format accepted:

{{"demo": "HelperText.js"}}

## Custom input component

You can customize the rendering of the input with the `TextField` component slot.
Make sure to spread `inputProps` correctly to the custom input component.

{{"demo": "CustomInput.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).

## Localization

You can find the documentation about localization in the [Date localization](/x/react-date-pickers/adapters-locale/) and [Component localization](/x/react-date-pickers/localization/).
