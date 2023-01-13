---
product: date-pickers
title: React Date Range Picker component
components: NextDateRangePicker, DesktopNextDateRangePicker, MobileNextDateRangePicker, StaticNextDateRangePicker, DateRangeCalendar, DateRangePickerDay
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

<p class="description">The Date Range Picker let the user select a range of dates.</p>

:::warning
These components will be renamed in the next release to have the same name as the v5 equivalent pickers
(`NextDateRangePicker` will become `DateRangePicker`, ...)
:::

## Basic usage

{{"demo": "BasicDateRangePicker.js"}}

## Component composition

The component is built using the `MultiInputDateRangeField` for the keyboard editing and the `DateRangeCalendar` for the view editing.
All the documented props of those two components can also be passed to the Date Range Picker component.

Check-out their documentation page for more information:

- [Date Range Field](/x/react-date-pickers/date-range-field/)
- [Date Range Calendar](/x/react-date-pickers/date-range-calendar/)

## Uncontrolled vs. Controlled

The component can be uncontrolled or controlled

{{"demo": "DateRangePickerValue.js"}}

## Available components

The component is available in four variants:

- The `DesktopNextDateRangePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileNextDateRangePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `NextDateRangePicker` component which renders `DesktopNextDateRangePicker` or `MobileNextDateRangePicker` depending on the device it runs on.

- The `StaticDateRangePicker` component which renders without the popover/modal and field.

{{"demo": "ResponsiveDateRangePickers.js"}}

By default, the `NextDateRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/getting-started/#testing-caveats) for solutions.
:::

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsDateRangePickers.js"}}

## Customization

### Render 1 to 3 months

You can render up to 3 months at the same time using the `calendar` prop.

:::info
This prop will be ignored on the mobile picker.
:::

{{"demo": "DateRangePickerCalendarProp.js"}}

### Custom input component

You can customize the rendering of the input with the `TextField` component slot.
Make sure to spread `inputProps` correctly to the custom input component.

{{"demo": "CustomInputs.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)

## 🚧 Pre-defined range shortcuts

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4563](https://github.com/mui/mui-x/issues/4563) if you want to see it land faster.
:::

Range shortcuts allows your users to select a commonly-used range in one click (eg: last week, last month, …)

## 🚧 Month Range Picker

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4995](https://github.com/mui/mui-x/issues/4995) if you want to see it land faster.
:::

The Month Range Picker allows setting a range of months.
