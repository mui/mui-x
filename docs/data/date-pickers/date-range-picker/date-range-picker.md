---
productId: x-date-pickers
title: React Date Range Picker component
components: DateRangePicker, DesktopDateRangePicker, MobileDateRangePicker, StaticDateRangePicker, DateRangeCalendar, DateRangePickerDay
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Date Range Picker lets the user select a range of dates.</p>

## Basic usage

{{"demo": "BasicDateRangePicker.js"}}

## Component composition

The component is built using the `MultiInputDateRangeField` for the keyboard editing and the `DateRangeCalendar` for the view editing.

Check-out their documentation page for more information:

- [Date Range Field](/x/react-date-pickers/date-range-field/)
- [Date Range Calendar](/x/react-date-pickers/date-range-calendar/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/date-range-picker/#props).
Some [MultiInputDateRangeField props](/x/api/date-pickers/multi-input-date-range-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DateRangePickerValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Available components

The component is available in four variants:

- The `DesktopDateRangePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The `MobileDateRangePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values with the keyboard in the field.

- The `DateRangePicker` component which renders `DesktopDateRangePicker` or `MobileDateRangePicker` depending on the device it runs on.

- The `StaticDateRangePicker` component which renders without the popover/modal and field.

{{"demo": "ResponsiveDateRangePickers.js"}}

By default, the `DateRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component supports the `disabled`, `readOnly` and `name` form props:

{{"demo": "FormPropsDateRangePickers.js"}}

:::success
The `name` prop is not available when using the Date Range Picker with the Multi Input Date Range Field.
:::

## Customization

### Render 1 to 3 months

You can render up to 3 months at the same time using the `calendars` prop.

:::info
This prop will be ignored on the mobile picker.
:::

{{"demo": "DateRangePickerCalendarProp.js"}}

### Use a multi input field

You can pass the `MultiInputDateRangeField` component to the Date Range Picker to use it for keyboard editing.
In such case the Picker component can pass the `name` prop to the input.

{{"demo": "MultiInputDateRangePicker.js"}}

:::info
You can find more information in a [dedicated documentation page section](/x/react-date-pickers/custom-field/#usage-inside-a-range-picker).
:::

### Add shortcuts

To simplify range selection, you can add [shortcuts](/x/react-date-pickers/shortcuts/#range-shortcuts).

{{"demo": "BasicRangeShortcuts.js", "bg": "inline", "defaultCodeOpen": false}}

### Customize the field

You can find the documentation in the [Custom field page](/x/react-date-pickers/custom-field/).

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.

## Month Range Picker 🚧

:::warning
This component isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/4995) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

The Month Range Picker would let users select a range of months.
