---
productId: x-date-pickers
title: Date and Time Pickers - Custom field
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
components: PickersSectionList, PickersTextField
---

# Custom field

<p class="description">The Date and Time Pickers let you customize the field by passing props or custom components.</p>

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Customize the default field

### Customize the `TextField`

You can use the `textField` slot to pass custom props to the `TextField`:

{{"demo": "TextFieldSlotProps.js"}}

### Customize the separator of multi input range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

You can use the `fieldSeparator` slot to pass custom props to the `Typography` rendered between the two `TextField`:

{{"demo": "MultiInputFieldSeparatorSlotProps.js"}}

### Customize the `start` and `end` fields differently [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

You can pass conditional props to the `textField` slot to customize the input styling based on the `position`.

{{"demo": "MultiInputFieldTextFieldProps.js"}}

### Use single input fields on range pickers [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

You can pass the single input fields to the range picker to use it for keyboard editing:

{{"demo": "SingleInputDateRangePicker.js"}}

If you want to create a wrapper around the field, make sure to set the `fieldType` static property to `'single-input'`.
Otherwise, the picker won't know your field is a single input one and use the multi input event listeners:

{{"demo": "SingleInputDateRangePickerWrapped.js", "defaultCodeOpen": false}}

You can manually add an `endAdornment` if you want your range picker to look exactly like on a simple picker:

{{"demo": "SingleInputDateRangePickerWithAdornment.js"}}

:::info
This adornment is purely decorative, the focus remains on the field when the picker is opened.
:::

### Change the separator of range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

You can use the `dateSeparator` prop to change the separator rendered between the start and end dates:

{{"demo": "RangeFieldDateSeparator.js"}}

### Change the format density

You can control the field format spacing using the `formatDensity` prop.
Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.

{{"demo": "FieldFormatDensity.js"}}

## With Material UI

### Wrapping `PickersTextField`

You can import the `PickersTextField` component to create custom wrappers:

{{"demo": "MaterialV7FieldWrapped.js"}}

:::success
This approach is only recommended if you need complex customizations on your `PickersTextField`.

If you just need to set some default props, you can use [the `slotProps` prop](/x/react-date-pickers/custom-field/#customize-the-textfield).
:::

### Using Material `TextField`

Pass the `enableAccessibleFieldDOMStructure={false}` to any Field or Picker component to use an `<input />` for the editing instead of the new accessible DOM structure:

{{"demo": "MaterialV6Field.js"}}

:::warning
The non-accessible DOM structure will be deprecated in a follow up minor version and remove in `v9.x`.
If you are unable to migrate for some reason, please open an issue to describe what is missing from the new DOM structure so that we can improve it before dropping the old one.
:::

## With another Design System

### Using a custom input

:::warning
You will need to use a component that supports the `sx` prop as a wrapper for your input
to be able to benefit from the **hover** and **focus** behavior of the clear button.
You will have access to the `clearable` and `onClear` props using native HTML elements,
but the on **focus** and **hover** behavior depends on styles applied via the `sx` prop.
:::

{{"demo": "BrowserV7Field.js", "defaultCodeOpen": false}}

{{"demo": "BrowserV7SingleInputRangeField.js", "defaultCodeOpen": false}}

{{"demo": "BrowserV7MultiInputRangeField.js", "defaultCodeOpen": false}}

### Using Joy UI

You can use the [Joy UI](https://mui.com/joy-ui/getting-started/) components instead of the Material UI ones:

{{"demo": "JoyV6Field.js", "defaultCodeOpen": false}}

{{"demo": "JoyV6SingleInputRangeField.js", "defaultCodeOpen": false}}

{{"demo": "JoyV6MultiInputRangeField.js", "defaultCodeOpen": false}}

:::warning
All the Joy UI examples use the non-accessible DOM structure.
The new accessible DOM structure will become compatible with Joy UI in the future.
:::

## With a custom editing experience

### Using an Autocomplete

If your user can only select a value in a small list of available dates, you can replace the field with the [Autocomplete](/material-ui/react-autocomplete/) component to list those dates:

{{"demo": "behavior-autocomplete/MaterialDatePicker.js", "defaultCodeOpen": false}}

### Using a masked Text Field

If you want to use a simple mask approach for the field editing instead of the built-in logic, you can replace the default field with the [TextField](/material-ui/react-text-field/) component using a masked input value built with the [rifm](https://github.com/realadvisor/rifm) package.

{{"demo": "behavior-masked-text-field/MaskedMaterialTextField.js", "defaultCodeOpen": false}}

### Using a read-only Text Field

If you want users to select a value exclusively through the views
but you still want the UI to look like a Text Field, you can replace the field with a read-only [Text Field](/material-ui/react-text-field/) component:

{{"demo": "behavior-read-only-text-field/MaterialDatePicker.js", "defaultCodeOpen": false}}

### Using a Button

If you want users to select a value exclusively through the views
and you don't want the UI to look like a Text Field, you can replace the field with the [Button](/material-ui/react-button/) component:

{{"demo": "behavior-button/MaterialDatePicker.js", "defaultCodeOpen": false}}

The same logic can be applied to any Range Picker:

{{"demo": "behavior-button/MaterialDateRangePicker.js", "defaultCodeOpen": false}}

## How to build a custom field

The main challenge when building a custom field, is to make sure that all the relevant props passed by the pickers are correctly handled.

On the examples below, you can see that the typing of the props received by a custom field always have the same shape:

```tsx
interface JoyDateFieldProps
  extends UseDateFieldProps<Dayjs, true>, // The headless field props
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      true, // `false` for `enableAccessibleFieldDOMStructure={false}`
      DateValidationError
    > {} // The DOM field props

interface JoyDateTimeFieldProps
  extends UseDateTimeFieldProps<Dayjs, true>, // The headless field props
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      true, // `false` for `enableAccessibleFieldDOMStructure={false}`
      DateTimeValidationError
    > {} // The DOM field props
```

### The headless field props

This interface depends on which type of field you are building (`UseDateField` for date field, `UseTimeField` for a time field, `UseDateRangeFieldProps` for a date range field, etc.).

It contains:

- the basic props common to all the fields (`value`, `onChange`, `format`, `readOnly`, etc.)
- the validation props for this type of field (`minDate`, `maxDate`, `shouldDisableDate`, etc.)

:::info
If you are building a custom field that doesn't have any input editing (e.g: the _Button field_), you can ignore most of those props.
:::

### The DOM field props

This interface contains the props the pickers pass to its field in order to customize the rendering.

These props are shaped to be received by the built-in fields which are using the `TextField` from `@mui/material`.
When used with another type of input (or no input at all), you will have to manually pass them to the relevant component.

You can have a look at the `BaseSingleInputFieldProps` and `BaseMultiInputFieldProps` interfaces to know exactly what those interfaces contain.
