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

:::warning
NOT READY
:::

The component is available in four variants:

- The `DesktopTimeRangePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileTimeRangePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `TimeRangePicker` component which renders `DesktopTimeRangePicker` or `MobileTimeRangePicker` depending on the device it runs on.

{{"demo": "ResponsiveTimeRangePickers.js"}}

By default, the `TimeRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsTimeRangePickers.js"}}

## Customization

### Use a multi input field

You can pass the `MultiInputTimeRangeField` component to the Time Range Picker to use it for keyboard editing:

{{"demo": "MultiInputTimeRangePicker.js"}}

:::info
For more information, check out the [Custom field](/x/react-date-pickers/custom-field/#usage-inside-a-range-picker) page.
:::

### Change end time label

{{"demo": "CustomizedBehaviorTimeRangePicker.js"}}

## Validation

You can find the documentation in the [Validation page](/x/react-date-pickers/validation/).
