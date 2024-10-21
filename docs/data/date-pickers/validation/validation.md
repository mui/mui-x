---
productId: x-date-pickers
components: DatePicker, DesktopDatePicker, MobileDatePicker, StaticDatePicker, TimePicker, DesktopTimePicker, MobileTimePicker, StaticTimePicker, DateTimePicker, DesktopDateTimePicker, MobileDateTimePicker, StaticDateTimePicker, DateRangePicker, DesktopDateRangePicker, MobileDateRangePicker, StaticDateRangePicker, DateTimeRangePicker, DesktopDateTimeRangePicker, MobileDateTimeRangePicker, DateCalendar
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Date and Time Pickers - Validation

<p class="description">Add custom validation to user inputs.</p>

All the date and time pickers have an API for adding validation constraints.
By default, they provide visual feedback if the component value doesn't meet the validation criteria.

:::info
The validation props are showcased for each type of picker component using the responsive pickers (`DatePicker`, `TimePicker`, `DateTimePicker`, and `DateRangePicker`, etc.).

But the same props are available on:

- all the other variants of this picker;

  For example, the validation props showcased with `DatePicker` are also available on:

  - `DesktopDatePicker`
  - `MobileDatePicker`
  - `StaticDatePicker`

- the field used by this picker;

  For example, the validation props showcased with `DatePicker` are also available on `DateField`.

- the view components;

  For example, the validation props showcased with `TimePicker` are also available on `TimeClock` and `DigitalClock`.

:::

## Invalid values feedback

On the field, it enables its error state.

{{"demo": "ValidationBehaviorInput.js", "defaultCodeOpen": false}}

On the calendar and clock views, the invalid values are displayed as disabled to prevent their selection.

{{"demo": "ValidationBehaviorView.js", "defaultCodeOpen": false}}

## Past and future validation

All pickers support the past and future validation.

The `disablePast` prop prevents the selection all values before today for date pickers and the selection of all values before the current time for time pickers.
For date time pickers, it will combine both.

- On the `day` view, all the days before today won't be selectable.
- On the `month` and `year` views, all the values ending before today won't be selectable.
- On the `hours` and `minutes` views, all the values ending before the current time won't be selectable.
- On the `seconds` view, all the values before the current second won't be selectable.

{{"demo": "DateValidationDisablePast.js", "defaultCodeOpen": false}}

The `disableFuture` prop prevents the selection all values after today for date pickers and the selection of all values after the current time for time pickers.
For date time pickers, it will combine both.

- On the `day` view, all the days after today won't be selectable.
- On the `month` and `year` views, all the values beginning after today won't be selectable.
- On the `hours` and `minutes` views, all the values beginning after the current time won't be selectable.
- On the `seconds` view, all the values after the current second won't be selectable.

{{"demo": "DateValidationDisableFuture.js", "defaultCodeOpen": false}}

:::info
The current time is computed during the first render of the `LocalizationProvider`.
It will not change during the lifetime of the component.
:::

## Date validation

All the props described below are available on all the components supporting date edition.

### Minimum and maximum date

The `minDate` prop prevents the selection of all values before `props.minDate`.

- On the `day` view, all the days before the `minDate` won't be selectable.
- On the `month` and `year` views, all the values ending before the `minDate` won't be selectable.

{{"demo": "DateValidationMinDate.js", "defaultCodeOpen": false}}

:::info
The default value of `minDate` is `1900-01-01`.
:::

The `maxDate` prop prevents the selection of all values after `props.maxDate`.

- On the `day` view, all the days after the `maxDate` won't be selectable.
- On the `month` and `year` views, all the values starting after the `maxDate` won't be selectable.

{{"demo": "DateValidationMaxDate.js", "defaultCodeOpen": false}}

:::info
The default value of `maxDate` is `2099-12-31`.
:::

### Disable specific dates

The `shouldDisableDate` prop prevents the selection of all dates for which it returns `true`.

In the example below, the weekends are not selectable:

{{"demo": "DateValidationShouldDisableDate.js", "defaultCodeOpen": false}}

:::warning
`shouldDisableDate` only prevents the selection of disabled dates on the `day` view.
For performance reasons, when rendering the `month` view, we are not calling the callback for every day of each month to see which one should be disabled (same for the `year` view).

If you know that all days of some months are disabled, you can provide the [`shouldDisableMonth`](#disable-specific-months) prop to disable them in the `month` view.
Same with the [`shouldDisableYear`](#disable-specific-years) prop for the `year` view.
:::

:::success
Please note that `shouldDisableDate` will execute on every date rendered in the `day` view. Expensive computations in this validation function can impact performance.
:::

#### Disable specific dates in range components [<span class="pro-premium"></span>](/x/introduction/licensing/#pro-plan)

For components supporting date range edition (`DateRangePicker`, `DateTimeRangePicker`), the `shouldDisableDate` prop receives a second argument to differentiate the start and the end date.

In the example below, the start date cannot be in the weekend but the end date can.

{{"demo": "DateRangeValidationShouldDisableDate.js", "defaultCodeOpen": false}}

### Disable specific months

The `shouldDisableMonth` prop prevents the selection of all dates in months for which it returns `true`.

{{"demo": "DateValidationShouldDisableMonth.js", "defaultCodeOpen": false}}

:::warning
`shouldDisableMonth` only prevents the selection of disabled months on the `day` and `month` views.
For performance reasons, when rendering the `year` view, we are not calling the callback for every month of each year to see which one should be disabled.

If you know that all months of some years are disabled, you can provide the [`shouldDisableYear`](#disable-specific-years) prop to disable them in the `year` view.
:::

### Disable specific years

The `shouldDisableYear` prop prevents the selection of all dates in years for which it returns `true`.

{{"demo": "DateValidationShouldDisableYear.js", "defaultCodeOpen": false}}

## Time validation

### Minimum and maximum time

The `minTime` prop prevents the selection of all values between midnight and `props.minTime`.

{{"demo": "TimeValidationMinTime.js", "defaultCodeOpen": false}}

The `maxTime` prop prevents the selection of all values between `props.maxTime` and midnight.

{{"demo": "TimeValidationMaxTime.js", "defaultCodeOpen": false}}

:::info
The validation only uses the time part of this prop value. It ignores the day / month / year.
The simplest way to use it is to pass today's date and only care about the hour / minute / seconds.

For example to disable the afternoon in `dayjs` you can pass `dayjs().set('hour', 12).startOf('hour')`.
:::

### Disable specific time

The `shouldDisableTime` prop prevents the selection of all values for which it returns `true`.

This callback receives the current view and the value to be tested:

```tsx
// Disables the hours between 12 AM and 3 PM.
shouldDisableTime={(value, view) =>
  view === 'hours' && value.hour() > 12 && value.hour() < 15
}

// Disables the last quarter of each hour.
shouldDisableTime={(value, view) => view === 'minutes' && value.minute() >= 45}

// Disables the second half of each minute.
shouldDisableTime={(value, view) => view === 'seconds' && value.second() > 30}

// Disable the hours before 10 AM every 3rd day
shouldDisableTime={(value, view) =>
  view === 'hours' && value.hour() < 10 && value.date() % 3 === 0
}
```

In the example below, the last quarter of each hour is not selectable.

{{"demo": "TimeValidationShouldDisableTime.js", "defaultCodeOpen": false}}

## Date and time validation

### Minimum and maximum date time

The `minDateTime` prop prevents the selection of all values before `props.minDateTime`.

{{"demo": "DateTimeValidationMinDateTime.js", "defaultCodeOpen": false}}

The `maxDateTime` prop prevents the selection of all values after `props.maxDateTime`.

{{"demo": "DateTimeValidationMaxDateTime.js", "defaultCodeOpen": false}}

:::warning
If you want to put time boundaries independent of the date, use the [`time boundaries`](#set-time-boundaries) instead.

For now, you cannot use `maxDateTime` and `maxTime` together.
`maxDateTime` will override the `maxTime` behavior, and the same goes for `minDateTime` and `minTime`.

```tsx
// Disable the values between 6 PM and midnight for every day
// (tomorrow 5 PM is not disabled).
<DateTimePicker maxTime={dayjs().set('hour', 18).startOf('hour')} />

// Disable the values after today 6 PM (tomorrow 5 PM is disabled).
<DateTimePicker maxDateTime={dayjs().set('hour', 18).startOf('hour')} />

// Disable the values between midnight and 6 PM for every day
// (yesterday 5 PM is not disabled).
<DateTimePicker minTime={dayjs().set('hour', 18).startOf('hour')} />

// Disable the values before today 6 PM (yesterday 5 PM is disabled).
<DateTimePicker minDateTime={dayjs().set('hour', 18).startOf('hour')} />
```

:::

## Show the error

To render the current error, you can subscribe to the `onError` callback which is called every time the error changes.
You can then use the `helperText` prop of the `TextField` to pass your error message to your input as shown below.

Try to type a date that is inside the first quarter of 2022—the error will go away.

{{"demo": "RenderErrorUnderField.js"}}
