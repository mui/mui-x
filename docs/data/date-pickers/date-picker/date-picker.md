---
product: date-pickers
title: React Date Picker component
components: CalendarPicker, CalendarPickerSkeleton, DatePicker, DesktopDatePicker, MobileDatePicker, MonthPicker, PickersDay, StaticDatePicker, YearPicker
githubLabel: 'component: DatePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://material.io/components/date-pickers
---

# Date picker

<p class="description">The date picker let the user select a date.</p>

:::success
This component has received several major improvements on the new **v6 beta**:

- [Fields: the new default input for pickers](https://next.mui.com//x/react-date-pickers/fields/).
- [Improved layout customization](https://next.mui.com//x/react-date-pickers/custom-layout/)
- [Shortcuts for picking specific dates in a calendar](https://next.mui.com//x/react-date-pickers/shortcuts/)

You can also take a look at [the dedicated blog post](https://mui.com/blog/v6-beta-pickers/) and the [new documentation of the DatePicker](https://next.mui.com/x/react-date-pickers/date-picker/) for more information.
:::

Date pickers are displayed with:

- Dialogs on mobile
- Text field dropdowns on desktop

## Basic usage

The date picker is rendered as a modal dialog on mobile, and a textbox with a popup on desktop.

{{"demo": "BasicDatePicker.js"}}

## Static mode

It's possible to render any date picker without the modal/popover and text field. This can be helpful when building custom popover/modal containers.

{{"demo": "StaticDatePickerDemo.js", "bg": true}}

## Responsiveness

The date picker component is designed and optimized for the device it runs on.

- The `MobileDatePicker` component works best for touch devices and small screens.
- The `DesktopDatePicker` component works best for mouse devices and large screens.

By default, the `DatePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.

{{"demo": "ResponsiveDatePickers.js"}}

## Form props

The date picker component can be disabled or read-only.

{{"demo": "FormPropsDatePickers.js"}}

## Localization

Use `LocalizationProvider` to change the date-library locale that is used to render the date picker.
See the documentation page [about localization](/x/react-date-pickers/localization/) for more details.

## Jalali calendar system

Install `date-fns-jalali` and use `@date-io/date-fns-jalali` adapter to support [Jalali calendar](https://en.wikipedia.org/wiki/Jalali_calendar).

{{"demo": "JalaliDatePicker.js"}}

## Views playground

It's possible to combine `year`, `month`, and `date` selection views. Views will appear in the order they're included in the `views` array.

{{"demo": "ViewsDatePicker.js"}}

## Landscape orientation

For ease of use, the date picker will automatically change the layout between portrait and landscape by subscription to the `window.orientation` change. You can force a specific layout using the `orientation` prop.

{{"demo": "StaticDatePickerLandscape.js", "bg": true}}

## Sub-components

Some lower-level sub-components (`CalendarPicker`, `MonthPicker`, and `YearPicker`) are also exported. These are rendered without a wrapper or outer logic (masked input, date values parsing and validation, etc.).

{{"demo": "SubComponentsPickers.js"}}

## Custom input component

You can customize the rendering of the input with the `renderInput` prop. Make sure to spread `ref` and `inputProps` correctly to the custom input component.

{{"demo": "CustomInput.js"}}

## Customized day rendering

The displayed days are customizable with the `renderDay` function prop.
You can take advantage of the [PickersDay](/x/api/date-pickers/pickers-day/) component.

{{"demo": "CustomDay.js"}}

## Dynamic data

Sometimes it may be necessary to display additional info right in the calendar. Here's an example of prefetching and displaying server-side data using the `onMonthChange`, `loading`, and `renderDay` props.

{{"demo": "ServerRequestDatePicker.js"}}

## Helper text

You can show a helper text with the date format accepted.

{{"demo": "HelperText.js"}}
