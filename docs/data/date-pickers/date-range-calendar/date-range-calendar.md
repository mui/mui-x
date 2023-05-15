---
product: date-pickers
title: React Date Range Calendar component
components: DateRangeCalendar
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers-pro'
---

# Date Range Calendar [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

<p class="description">The Date Range Calendar lets the user select a range of dates without any input or popper / modal.</p>

## Basic usage

{{"demo": "BasicDateRangeCalendar.js"}}

The value of the component can be uncontrolled or controlled.

{{"demo": "DateRangeCalendarValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Form props

The component can be disabled or read-only.

{{"demo": "DateRangeCalendarFormProps.js"}}

## Customization

### Render 1 to 3 months

You can render up to 3 months at the same time using the `calendars` prop:

{{"demo": "DateRangeCalendarCalendarProp.js"}}

### Custom day rendering

The displayed days are customizable with the `Day` component slot.
You can take advantage of the [DateRangePickerDay](/x/api/date-pickers/date-range-picker-day/) component.

{{"demo": "CustomDateRangePickerDay.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).

## Localization

You can find the documentation about localization in the [Date localization](/x/react-date-pickers/adapters-locale/) and [Component localization](/x/react-date-pickers/localization/).
