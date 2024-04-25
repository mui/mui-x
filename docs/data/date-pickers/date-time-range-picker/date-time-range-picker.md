---
productId: x-date-pickers
title: React Date Time Range Picker component
components: DateTimeRangePicker, DesktopDateTimeRangePicker, MobileDateTimeRangePicker, DateRangeCalendar, DateRangePickerDay, DigitalClock, MultiSectionDigitalClock, DateTimeRangePickerTabs, DateTimeRangePickerToolbar
githubLabel: 'component: DateTimeRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Date Time Range Picker lets the user select a range of dates with an explicit starting and ending time.</p>

## Basic usage

{{"demo": "BasicDateTimeRangePicker.js"}}

## Component composition

The component is built using the `MultiInputDateTimeRangeField` for the keyboard editing, the `DateRangeCalendar` for the date view editing and `DigitalClock` for the time view editing.

Check-out their documentation page for more information:

- [Date Time Range Field](/x/react-date-pickers/date-time-range-field/)
- [Date Range Calendar](/x/react-date-pickers/date-range-calendar/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/date-time-range-picker/#props).
Some [MultiInputDateTimeRangeField props](/x/api/date-pickers/multi-input-date-time-range-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DateTimeRangePickerValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Available components

The component is available in three variants:

- The `DesktopDateTimeRangePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileDateTimeRangePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `DateTimeRangePicker` component which renders `DesktopDateTimeRangePicker` or `MobileDateTimeRangePicker` depending on the device it runs on.

{{"demo": "ResponsiveDateTimeRangePickers.js"}}

By default, the `DateTimeRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsDateTimeRangePickers.js"}}

## Customization

### Render 1 to 3 months

You can render up to 3 months at the same time using the `calendars` prop.

:::info
This prop will be ignored on the mobile picker.
:::

{{"demo": "DateTimeRangePickerCalendarProp.js"}}

### Use a single input field

You can pass the `SingleInputDateTimeRangeField` component to the Date Time Range Picker to use it for keyboard editing:

{{"demo": "SingleInputDateTimeRangePicker.js"}}

:::info
You can find more information in a [dedicated documentation page section](/x/react-date-pickers/custom-field/#use-single-input-fields-on-range-pickers).
:::

### Customize the field

You can find the documentation in the [Custom field page](/x/react-date-pickers/custom-field/).

### Change view renderer

You can pass a different view renderer to the Date Time Range Picker to customize the views.

{{"demo": "DateTimeRangePickerViewRenderer.js"}}

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
