---
product: date-pickers
title: React Date Range Picker component
components: NextDateRangePicker, DesktopNextDateRangePicker, MobileNextDateRangePicker, StaticNextDateRangePicker, DateRangeCalendar, DateRangePickerDay
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers-pro'
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

## Customization

### Render 1 to 3 months

You can render up to 3 months at the same time using the `calendar` prop.

:::info
This prop will be ignored on the mobile picker.
:::

{{"demo": "DateRangePickerCalendarProp.js"}}

### Custom input component

You can customize the rendering of the input with the `Input` component slot.
Make sure to spread `inputProps` correctly to the custom input component.

{{"demo": "CustomInputs.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/)
