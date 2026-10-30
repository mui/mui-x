---
productId: x-date-pickers
title: React Date Calendar component
components: DateCalendar, MonthCalendar, YearCalendar, PickerDay, DayCalendarSkeleton
githubLabel: 'component: DatePicker'
packageName: '@mui/x-date-pickers'
---

# Date Calendar

<p class="description">The Date Calendar component lets users select a date without any input or popper / modal.</p>

## Basic usage

{{"component": "file://./demos/basic-date-calendar/index.ts"}}

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"component": "file://./demos/date-calendar-value/index.ts"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Form props

The component can be disabled or read-only.

{{"component": "file://./demos/date-calendar-form-props/index.ts"}}

## Views

The component can contain three views: `day`, `month`, and `year`.
By default, only the `day` and `year` views are enabled.

You can customize the enabled views using the `views` prop.
Views will appear in the order they're included in the `views` array.

{{"component": "file://./demos/date-calendar-views/index.ts"}}

## Choose the initial year / month

If `value` or `defaultValue` contains a valid date, this date will be used to choose which month to render in the `day` view and which year to render in the `month` view.
If both `value` and `defaultValue` contain no valid date, the component will try to find a month and year that satisfies the validation rules.

You can override this date using the `referenceDate`, in the example below the calendar renders April 2022 even though no date is visually selected:

{{"component": "file://./demos/date-calendar-reference-date/index.ts"}}

:::success
Learn more about the `referenceDate` in the [dedicated doc section](/x/react-date-pickers/base-concepts/#reference-date-when-no-value-is-defined).
:::

## Month and Year Calendar

If you only need the `year` view or the `month` view, you can use the `YearCalendar` / `MonthCalendar` components:

{{"component": "file://./demos/year-month-calendar/index.ts", "collapseToEmpty": true}}

### Order of years

By default, years are displayed in ascending order, chronologically from the minimum year to the maximum.
Set the `yearsOrder` prop to `desc` to show the years in descending order.

{{"component": "file://./demos/years-order-descending-calendar/index.ts", "collapseToEmpty": true}}

## Day view customization

### Show additional days

To show all days of displayed weeks, including those outside of the current month, use `showDaysOutsideCurrentMonth`.

By default, only weeks of the current month are displayed, but you can provide a total number of weeks to display with `fixedWeekNumber` prop.
This value is usually set to `6` for Gregorian calendars, because month display can vary between 4 and 6 weeks.

{{"component": "file://./demos/custom-month-layout/index.ts"}}

### Display week number

To display week numbers, use the `displayWeekNumber` prop.
You can customize the calendar week header by using the localization key `localeText.calendarWeekNumberHeaderText`.
You can also customize what's rendered as a calendar week number, using a callback for the localization key `localeText.calendarWeekNumberText`.

{{"component": "file://./demos/add-week-number/index.ts"}}

### Week picker

You can select the whole week using the `day` component slot:

{{"component": "file://./demos/week-picker/index.ts"}}

## Dynamic data

Sometimes it may be necessary to display additional info right in the calendar.
The following demo shows how to add a badge on some day based on server-side data:

{{"component": "file://./demos/date-calendar-server-request/index.ts"}}

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
