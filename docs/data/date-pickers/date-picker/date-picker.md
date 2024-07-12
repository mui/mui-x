---
productId: x-date-pickers
title: React Date Picker component
components: DatePicker, DesktopDatePicker, MobileDatePicker, StaticDatePicker, DateCalendar
githubLabel: 'component: DatePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Picker

<p class="description">The Date Picker component lets users select a date.</p>

## Basic usage

{{"demo": "BasicDatePicker.js"}}

## Component composition

The component is built using the `DateField` for the keyboard editing and the `DateCalendar` for the view editing.

Check-out their documentation page for more information:

- [Date Field](/x/react-date-pickers/date-field/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/date-picker/#props).
Some [DateField props](/x/api/date-pickers/date-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

{{"demo": "DatePickerValue.js"}}

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Available components

The component is available in four variants:

- The `DesktopDatePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The `MobileDatePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

- The `DatePicker` component which renders `DesktopDatePicker` or `MobileDatePicker` depending on the device it runs on.

- The `StaticDatePicker` component which renders without the popover/modal and field.

{{"demo": "ResponsiveDatePickers.js"}}

By default, the `DatePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

## Form props

The component can be disabled or read-only.

{{"demo": "FormPropsDatePickers.js"}}

## Views

The component supports three views: `day`, `month`, and `year`.

By default, the `day` and `year` views are enabled.
Use the `views` prop to change this behavior:

{{"demo": "DatePickerViews.js"}}

By default, the component renders the `day` view on mount.
Use the `openTo` prop to change this behavior:

{{"demo": "DatePickerOpenTo.js"}}

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow
(for example view the default behaviors, the `year` is only accessible when clicking on the toolbar).
:::

## Landscape orientation

By default, the Date Picker component automatically sets the orientation based on the `window.orientation` value.
You can force a specific orientation using the `orientation` prop:

{{"demo": "StaticDatePickerLandscape.js", "bg": true}}

:::info
You can find more information about the layout customization in the [custom layout page](/x/react-date-pickers/custom-layout/).
:::

## Helper text

You can show a helper text with the date format accepted:

{{"demo": "HelperText.js"}}

## Clearing the value

You can enable the clearable behavior:

{{"demo": "ClearableProp.js"}}

:::info
See [Field components—Clearable behavior](/x/react-date-pickers/fields/#clearable-behavior) for more details.
:::

:::warning
The clearable prop is not supported yet by the mobile Picker variants.

See discussion [in this GitHub issue](https://github.com/mui/mui-x/issues/10842#issuecomment-1951887408) for more information.
:::

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.

## Customization

You can check out multiple examples of how to customize the date pickers and their subcomponents.

{{"demo": "CustomizationExamplesNoSnap.js", "hideToolbar": true, "bg": "inline"}}
