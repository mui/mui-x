---
product: date-pickers
title: React Date Picker component
components: NextDatePicker, DesktopNextDatePicker, MobileNextDatePicker, StaticNextDatePicker
githubLabel: 'component: DatePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Picker

<p class="description">The date picker let the user select a date.</p>

:::warning
The new date pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextDatePicker` will become `DatePicker`, ...)
:::

Date pickers are displayed with:

- Dialogs on mobile
- Text field dropdowns on desktop

## Basic usage

The date picker is rendered as a modal dialog on mobile, and a textbox with a popup on desktop.

{{"demo": "BasicDatePicker.js"}}

## Component composition

The Date Picker components are built using the `DateField` for the keyboard editing and the `DateCalendar` for the view editing.
All the documented props of those two components can also be passed to the Date Picker components.

Check-out their documentation page for more information:

- [Date Field](/x/react-date-pickers/date-field/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "DatePickerValue.js"}}

## Responsiveness

The date picker component is designed and optimized for the device it runs on.

- The `MobileNextDatePicker` component works best for touch devices and small screens.
- The `DesktopNextDatePicker` component works best for mouse devices and large screens.

By default, the `NextDatePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.

{{"demo": "ResponsiveDatePickers.js"}}

## Static mode

It is also possible to render any date picker without the modal/popover and text field.
This can be helpful when building custom popover/modal containers.

{{"demo": "StaticDatePickerDemo.js", "bg": true}}

## Form props

The date picker component can be disabled or read-only.

{{"demo": "FormPropsDatePickers.js"}}

## Views playground

It's possible to combine `year`, `month`, and `date` selection views.
The views will appear in the order they're included in the `views` array.

{{"demo": "ViewsDatePicker.js"}}

## Landscape orientation

For ease of use, the date picker will automatically change the layout between portrait and landscape by subscription to the `window.orientation` change. You can force a specific layout using the `orientation` prop.

{{"demo": "StaticDatePickerLandscape.js", "bg": true}}

## Helper text

You can show a helper text with the date format accepted.

{{"demo": "HelperText.js"}}

## Custom input component

You can customize the rendering of the input with the `Input` component slot.
Make sure to spread `inputProps` correctly to the custom input component.

{{"demo": "CustomInput.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).

## Localization

You can find the documentation about localization in the [Date localization](/x/react-date-pickers/adapters-locale/) and [Component localization](/x/react-date-pickers/localization/).
