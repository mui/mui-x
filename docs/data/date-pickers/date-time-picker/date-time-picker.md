---
productId: x-date-pickers
title: React Date Time Picker component
components: DateTimePicker, DesktopDateTimePicker, MobileDateTimePicker, StaticDateTimePicker, DigitalClock, MultiSectionDigitalClock, TimeClock
githubLabel: 'component: DateTimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Time Picker

<p class="description">The Date Time Picker component lets users select a date and time.</p>

## Basic usage

{{"demo": "BasicDateTimePicker.js"}}

## Component composition

The component is built using the `DateTimeField` for the keyboard editing, the `DateCalendar` for the date view editing, the `DigitalClock` for the desktop view editing, and the `TimeClock` for the mobile time view editing.

Check-out their documentation page for more information:

- [Date Field](/x/react-date-pickers/date-field/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)
- [Digital Clock](/x/react-date-pickers/digital-clock/)
- [Time Clock](/x/react-date-pickers/time-clock/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/date-time-picker/#props).
Some [DateTimeField props](/x/api/date-pickers/date-time-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DateTimePickerValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Available components

The component is available in four variants:

- The `DesktopDateTimePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileDateTimePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `DateTimePicker` component which renders `DesktopDateTimePicker` or `MobileDateTimePicker` depending on the device it runs on.

- The `StaticDateTimePicker` component which renders without the popover/modal and field.

{{"demo": "ResponsiveDateTimePickers.js"}}

By default, the `DateTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsDateTimePickers.js"}}

## Views

The component supports six views: `day`, `month`, `year`, `hours`, `minutes` and `seconds`.

By default, the `year`, `day`, `hours`, and `minutes` views are enabled.
Use the `views` prop to change this behavior:

{{"demo": "DateTimePickerViews.js"}}

By default, the component renders the `day` view on mount.
Use the `openTo` prop to change this behavior:

{{"demo": "DateTimePickerOpenTo.js"}}

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow
(for example view the default behaviors, the `year` is only accessible when clicking on the toolbar).
:::

## Landscape orientation

By default, the Date Time Picker component automatically sets the orientation based on the `window.orientation` value.

You can force a specific orientation using the `orientation` prop.

{{"demo": "StaticDateTimePickerLandscape.js", "bg": true}}

:::info
You can find more information about the layout customization in the [custom layout page](/x/react-date-pickers/custom-layout/).
:::

## Choose time view renderer

You can use the `viewRenderers` prop to change the view that is used for rendering a view.
You might be interested in using the [Time Clock](/x/react-date-pickers/time-clock/) instead of the [Digital Clock](/x/react-date-pickers/digital-clock/) or removing the time view rendering altogether in favor of only using the field to input the time.

{{"demo": "DateTimePickerViewRenderers.js"}}

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.
