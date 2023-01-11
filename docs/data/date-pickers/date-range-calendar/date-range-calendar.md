---
product: date-pickers
title: React Date Range Calendar component
components: DateRangeCalendar
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers-pro'
---

# Date Calendar [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

<p class="description">The Date Range Calendar lets the user select a range of dates without any input or popper / modal.</p>

## Basic usage

{{"demo": "BasicDateRangeCalendar.js"}}

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "DateRangeCalendarValue.js"}}

## Form props

The component can be disabled or read-only.

{{"demo": "DateRangeCalendarFormProps.js"}}

## Customization

### Render 1 to 3 months

You can render up to 3 months at the same time using the `calendar` prop:

{{"demo": "DateRangeCalendarCalendarProp.js"}}

### Custom day rendering

The displayed days are customizable with the `Day` component slot.
You can take advantage of the [DateRangePickerDay](/x/api/date-pickers/date-range-picker-day/) component.

{{"demo": "CustomDateRangePickerDay.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).

## Localization

You can find the documentation about localization in the [Date localization](/x/react-date-pickers/adapters-locale/) and [Component localization](/x/react-date-pickers/localization/).
