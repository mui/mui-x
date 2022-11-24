---
product: date-pickers
title: React Date Range Picker component
components: NextDateRangePicker, DesktopNextDateRangePicker, MobileNextDateRangePicker, StaticNextDateRangePicker, DateRangeCalendar, DateRangePickerDay
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

<p class="description">The date range picker let the user select a range of dates.</p>

:::warning
The new date range pickers are unstable.
They might receive breaking changes on their props to have the best component possible by the time of the stable release.

They will be renamed at the end of the v6 beta phase to have the same name as the current legacy pickers
(`NextDateRangePicker` will become `DateRangePicker`, ...)
:::

:::info
You can pass almost any prop from [NextDatePicker](/x/react-date-pickers/date-picker/) to the Date Range Picker.
:::

## Basic usage

{{"demo": "BasicDateRangePicker.js"}}

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "DateRangePickerValue.js"}}

## Responsiveness

The date range picker component is designed to be optimized for the device it runs on.

- The `MobileNextDateRangePicker` component works best for touch devices and small screens.
- The `DesktopNextDateRangePicker` component works best for mouse devices and large screens.

By default, the `NextDateRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

There are certain caveats when testing pickers, please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for more information.

{{"demo": "ResponsiveDateRangePicker.js"}}

## Static mode

It is also possible to render any date range picker without the modal/popover and text field.
This will enable building custom popover/modal containers.

{{"demo": "StaticDateRangePickerDemo.js", "bg": true}}

## Form props

The date range picker component can be disabled or read-only.

{{"demo": "FormPropsDateRangePickers.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)

## Different number of months

Note that the `calendars` prop only works in desktop mode.

{{"demo": "CalendarsDateRangePicker.js"}}

## Custom input component

You can customize the rendering of the input with the `Input` component slot.
Make sure to spread `inputProps` correctly to the custom input component.

{{"demo": "CustomInputs.js"}}

## Customized day rendering

The displayed days are customizable with the `Day` component slot.
You can take advantage of the internal [DateRangePickerDay](/x/api/date-pickers/date-range-picker-day/) component.

{{"demo": "CustomDateRangePickerDay.js"}}

## 🚧 Pre-defined range shortcuts

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4563](https://github.com/mui/mui-x/issues/4563) if you want to see it land faster.
:::

Range shortcuts allows your users to select a commonly-used range in one click (eg: last week, last month, …)

## 🚧 Month range Picker

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4995](https://github.com/mui/mui-x/issues/4995) if you want to see it land faster.
:::

Month range picker allows setting date ranges by picking months only.
