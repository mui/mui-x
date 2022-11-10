---
product: date-pickers
title: React Date Picker component
components: DateCalendar, DatePicker, DayCalendarSkeleton, DesktopDatePicker, MobileDatePicker, MonthCalendar, PickersDay, StaticDatePicker, YearCalendar
githubLabel: 'component: DatePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Picker

<p class="description">The date picker let the user select a date.</p>

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

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)

## Localization

Use `LocalizationProvider` to change the date-library locale that is used to render the date picker.
See the documentation page [about localization](/x/react-date-pickers/date-picker/#localization) for more details.

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

Some lower-level sub-components (`DateCalendar`, `MonthCalendar`, and `YearCalendar`) are also exported.

{{"demo": "SubComponentsCalendars.js"}}

## Custom input component

You can customize the rendering of the input with the `renderInput` prop. Make sure to spread `ref` and `inputProps` correctly to the custom input component.

{{"demo": "CustomInput.js"}}

## Customized day rendering

The displayed days are customizable with the `Day` component slot.
You can take advantage of the [PickersDay](/x/api/date-pickers/pickers-day/) component.

{{"demo": "CustomDay.js"}}

## Customize month layout

You can customize the month layout with some props.

### Show additional days

To shows all days of displayed weeks, included those outside of the current month, use `showDaysOutsideCurrentMonth`.

By default, only weeks of the current month are displayed, but you can provide a total number of week to display with `fixedWeekNumber` prop.
This value is usually set to `6` for Gregorian calendars, because months display can vary between 4 and 6 weeks.

{{"demo": "CustomMonthLayout.js"}}

### Add week number

To display week number, use the `displayWeekNumber`.
If you use a `dateAdapter` imported from outside of our library, you will have to provide the method `getWeekNumber`.
It takes the first day of the week as an input and returns the week number.

To customize the string displayed, use the localization key`localeText.calendarWeekNumberText`.

{{"demo": "AddWeekNumber.js"}}

## Dynamic data

Sometimes it may be necessary to display additional info right in the calendar. Here's an example of prefetching and displaying server-side data using the `onMonthChange`, `loading`, and `components.Day` props.

{{"demo": "ServerRequestDatePicker.js"}}

## Helper text

You can show a helper text with the date format accepted.

{{"demo": "HelperText.js"}}
