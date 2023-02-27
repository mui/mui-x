---
product: date-pickers
title: Date and Time pickers - Custom field
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Custom layout

<p class="description">The Date and Time Pickers let you pass custom fields to your pickers</p>

## Custom text field

:::info
This demo demonstrates how to take advantage of the field smart behaviors with any input (even third party ones).
For Joy, we will provide an higher level solution in the coming months for an even simpler usage.
:::

{{"demo": "PickerWithJoyField.js", "defaultCodeOpen": false}}

## Autocomplete field

{{"demo": "PickerWithAutocompleteField.js", "defaultCodeOpen": false}}

## Button field

{{"demo": "PickerWithButtonField.js", "defaultCodeOpen": false}}

## How to build a custom field

The main challenge when building a custom field, is to make sure that all the relevant props passed by the pickers are correctly handled.

On the examples below, you can see that the typing of the props received by a custom field always have the same shape:

```tsx
interface JoyDateFieldProps
  // The headless field props
  extends UseDateFieldProps<Dayjs>,
    // The DOM field props
    BaseSingleInputFieldProps<Dayjs | null, DateValidationError> {}
```

### The headless field props

This interface depend on which type of field you are building (`UseDateField` for date field, `UseTimeField` for a time field, `UseDateRangeFieldProps` for a date range field, ...).

It contains:

- the basic props common to all the fields (`value`, `onChange`, `format`, `readOnly`, ...)
- the validation props for this type of field (`minDate`, `maxDate`, `shouldDisableDate`, ...)

:::info
If you are building a custom field that don't have any input editing (e.g: the _Button field_), you can ignore most of those props.
:::

### The DOM field props

This interface contains the props the pickers passes to its field in order to customize the rendering.

These props are shaped to be received by our built-in fields which are using the `TextField` from `@mui/material`.
When used with another type of input (or no input at all), you will have to manually re-attribute them to the relevant component.

You can have a look at the `BaseSingleInputFieldProps` and `BaseMultiInputFieldProps` interfaces for more information.
