---
productId: x-date-pickers
title: React Date Calendar component
components: DateCalendar, MonthCalendar, YearCalendar, PickersDay, DayCalendarSkeleton
githubLabel: 'component: DatePicker'
packageName: '@mui/x-date-pickers'
---

# Date Calendar

<p class="description">The Date Calendar component lets the user select a date without any input or popper / modal.</p>

## Basic usage

{{"demo": "BasicDateCalendar.js"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DateCalendarValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Form props

The component can be disabled or read-only.

{{"demo": "DateCalendarFormProps.js"}}

## Views

The component can contain three views: `day`, `month`, and `year`.
By default, only the `day` and `year` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"demo": "DateCalendarViews.js"}}

## Month and Year Calendar

If you only need the `year` view or the `month` view, you can use the `YearCalendar` / `MonthCalendar` components:

{{"demo": "YearMonthCalendar.js", "defaultCodeOpen": false}}

## Day view customization

### Show additional days

To show all days of displayed weeks, including those outside of the current month, use `showDaysOutsideCurrentMonth`.

By default, only weeks of the current month are displayed, but you can provide a total number of week to display with `fixedWeekNumber` prop.
This value is usually set to `6` for Gregorian calendars, because months display can vary between 4 and 6 weeks.

{{"demo": "CustomMonthLayout.js"}}

### Display week number

To display week number, use the `displayWeekNumber`.
You can customize the calendar week header by using the localization key `localeText.calendarWeekNumberHeaderText`.
You can also customize what's rendered as a calendar week number, using a callback for the localization key `localeText.calendarWeekNumberText`.

{{"demo": "AddWeekNumber.js"}}

### Custom day rendering

The displayed days are customizable with the `Day` component slot.
You can take advantage of the [PickersDay](/x/api/date-pickers/pickers-day/) component.

{{"demo": "CustomDay.js"}}

## Dynamic data

Sometimes it may be necessary to display additional info right in the calendar.
The following demo shows how to add a badge on some day based on server side data:

{{"demo": "DateCalendarServerRequest.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).

## Localization

You can find the documentation about localization in the [Date localization](/x/react-date-pickers/adapters-locale/) and [Component localization](/x/react-date-pickers/localization/).
