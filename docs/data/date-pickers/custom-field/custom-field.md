---
product: date-pickers
title: Date and Time pickers - Custom field
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Custom field

<p class="description">The Date and Time Pickers let you customize the field by passing props or custom components</p>

## Customize the default field

### Customize the `TextField`

You can use the `textField` slot to pass custom props to the `TextField`:

{{"demo": "TextFieldSlotProps.js"}}

### Customize the separator of multi input fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

You can use the `fieldSeparator` slot to pass custom props to the `Typography` rendered between the two `TextField`:

{{"demo": "MultiInputFieldSeparatorSlotProps.js"}}

### Use single input fields on range pickers [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

You can pass the single input fields to the range picker to use it for keyboard editing:

{{"demo": "SingleInputDateRangePicker.js"}}

If you want to create a wrapper around the field, make sure to set the `fieldType` static property to `'single-input'`.
Otherwise, the picker won't know your field is a single input one and use the multi input event listeners:

{{"demo": "WrappedSingleInputDateRangePicker.js", "defaultCodeOpen": false}}

You can manually add an `endAdornment` if you want your range picker to look exactly like on a simple picker:

{{"demo": "SingleInputDateRangePickerWithAdornment.js"}}

:::info
This adornment is purely decorative, the focus remains on the field when the picker is opened.
:::

### Change the format density

You can control the field format spacing using the `formatDensity` prop.
Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.

{{"demo": "FieldFormatDensity.js"}}

## Commonly used custom field

### Using another input

#### With the Joy input

You can use the [_Joy UI_](https://mui.com/joy-ui/getting-started/overview/) components instead of the _Material UI_ ones:

:::info
A higher-level solution for _Joy UI_ will be provided in the near future for even simpler usage.
:::

{{"demo": "PickerWithJoyField.js", "defaultCodeOpen": false}}

#### With the browser input

You can also use any other input:

{{"demo": "PickerWithBrowserField.js", "defaultCodeOpen": false}}

### Using an `Autocomplete`

If your user can only select a value in a small list of available dates,
you can replace the field with an `Autocomplete` listing those dates:

{{"demo": "PickerWithAutocompleteField.js", "defaultCodeOpen": false}}

### Using a `Button`

If you only want to allow the user to pick a value through the views,
you can replace the field with a `Button`:

{{"demo": "PickerWithButtonField.js", "defaultCodeOpen": false}}

## How to build a custom field

The main challenge when building a custom field, is to make sure that all the relevant props passed by the pickers are correctly handled.

On the examples below, you can see that the typing of the props received by a custom field always have the same shape:

```tsx
interface JoyDateFieldProps
  extends UseDateFieldProps<Dayjs>, // The headless field props
    BaseSingleInputFieldProps<Dayjs | null, FieldSection, DateValidationError> {} // The DOM field props

interface JoyDateTimeFieldProps
  extends UseDateTimeFieldProps<Dayjs>, // The headless field props
    BaseSingleInputFieldProps<Dayjs | null, FieldSection, DateTimeValidationError> {} // The DOM field props
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
