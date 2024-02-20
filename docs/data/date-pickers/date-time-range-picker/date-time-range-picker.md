---
productId: x-date-pickers
title: React Date Time Range Picker component
githubLabel: 'component: DateTimeRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Range Picker [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

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
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4547](https://github.com/mui/mui-x/issues/4547) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this component, or if you are facing a pain point with your current solution.
:::
