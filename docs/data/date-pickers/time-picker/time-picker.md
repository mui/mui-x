---
productId: x-date-pickers
title: React Time Picker component
components: TimePicker, DesktopTimePicker, MobileTimePicker, StaticTimePicker, DigitalClock, MultiSectionDigitalClock, TimeClock
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/time-pickers
---

# Time Picker

<p class="description">The Time Picker component lets the user select a time.</p>

## Basic usage

{{"demo": "BasicTimePicker.js"}}

## Component composition

The component is built using the `TimeField` for the keyboard editing, the `DigitalClock` for the desktop view editing, and the `TimeClock` for the mobile view editing.

Check-out their documentation page for more information:

- [Time Field](/x/react-date-pickers/time-field/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)
- [Time Clock](/x/react-date-pickers/time-clock/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/time-picker/#props).
Some [TimeField props](/x/api/date-pickers/time-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "TimePickerValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Available components

The component is available in four variants:

- The `DesktopTimePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileTimePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `TimePicker` component which renders `DesktopTimePicker` or `MobileTimePicker` depending on the device it runs on.

- The `StaticTimePicker` component which renders without the popover/modal and field.

{{"demo": "ResponsiveTimePickers.js"}}

By default, the `TimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Views

The component supports three views: `hours`, `minutes` and `seconds`.

By default, the `hours` and `minutes` views are enabled.
Use the `views` prop to change this behavior:

{{"demo": "TimePickerViews.js"}}

By default, the `MobileTimePicker` component renders the `hours` view on mount.
Use the `openTo` prop to change this behavior:

{{"demo": "TimePickerOpenTo.js"}}

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow.
:::

## Landscape orientation

By default, the Time Picker component automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

:::info
You can find more information about the layout customization in the [custom layout page](/x/react-date-pickers/custom-layout/).
:::

## Choose time view renderer

You can use the `viewRenderers` prop to change the view that is used for rendering a view.
You might be interested in using the [Time Clock](/x/react-date-pickers/time-clock/) instead of the [Digital Clock](/x/react-date-pickers/digital-clock/) on desktop as well as mobile.

{{"demo": "TimePickerViewRenderers.js"}}

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
