---
productId: x-date-pickers
title: React Time Range Picker component
components: TimeRangePicker, DesktopTimeRangePicker, MobileTimeRangePicker, DigitalClock, MultiSectionDigitalClock, TimeRangePickerTabs, TimeRangePickerToolbar
githubLabel: 'component: TimeRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Time Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Time Range Picker lets users select a range of time values.</p>

## Basic usage

{{"demo": "BasicTimeRangePicker.js"}}

## Component composition

The component is built using the `SingleInputTimeRangeField` for the keyboard editing and the `DigitalClock` for the view editing.

Check-out their documentation page for more information:

- [Time Range Field](/x/react-date-pickers/time-range-field/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "TimeRangePickerValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Available components

The component is available in three variants:

- The `DesktopTimeRangePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The `MobileTimeRangePicker` component which works best for touch devices and small screens.
  It renders the views inside a modal and and a field for keyboard editing.

- The `TimeRangePicker` component which renders `DesktopTimeRangePicker` or `MobileTimeRangePicker` depending on the device it runs on.

{{"demo": "ResponsiveTimeRangePickers.js"}}

By default, the `TimeRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component supports the `disabled`, `readOnly` and `name` props:

{{"demo": "FormPropsTimeRangePickers.js"}}

:::success
The `name` prop is not available when using the Time Range Picker with the Multi Input Time Range Field.
:::

## Customization

### Use a multi input field

You can pass the `MultiInputTimeRangeField` component to the Time Range Picker to use it for keyboard editing:

{{"demo": "MultiInputTimeRangePicker.js"}}

:::info
You can find more information in a [dedicated documentation page section](/x/react-date-pickers/custom-field/#usage-inside-a-range-picker).
:::

### Change end time label

The below demo shows how to add a custom label on the end time view showing the selected time range duration.

It replaces the default `digitalClockItem` slot component with a different one calculating the duration of the range when selecting the end time.

{{"demo": "CustomizedBehaviorTimeRangePicker.js"}}

### Customize the field

You can find the documentation in the [Custom field page](/x/react-date-pickers/custom-field/).

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).
