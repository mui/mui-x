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

### Change the separator of range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

You can use the `dateSeparator` prop to change the separator rendered between the start and end dates:

{{"demo": "RangeFieldDateSeparator.js"}}

### Change the format density

You can control the field format spacing using the `formatDensity` prop.
Setting `formatDensity` to `"spacious"` adds space before and after each `/`, `-` and `.` character.

{{"demo": "FieldFormatDensity.js"}}

## Multi input range field [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

### Usage inside a range picker

You can pass the multi input fields to the range picker to use it for keyboard editing:

{{"demo": "MultiInputDateRangePicker.js"}}

If you want to create a wrapper around the field, make sure to set the `fieldType` static property to `'multi-input'`.
Otherwise, the picker will throw an error because it won't know how to adapt to this custom field:

{{"demo": "MultiInputDateRangePickerWrapped.js", "defaultCodeOpen": false}}

### Customize the `start` and `end` fields differently

You can pass conditional props to the `textField` slot to customize the input styling based on the `position`.

{{"demo": "MultiInputFieldTextFieldProps.js"}}

### Customize the separator

You can use the `separator` slot to pass custom props to the `Typography` rendered between the two Text Fields:

{{"demo": "MultiInputFieldSeparatorSlotProps.js"}}

:::success
When used inside a picker, the `separator` slot is not available directly and must be accessed using `slotProps.field.slotProps.separator`.
:::

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

### Using a read-only Text Field on mobile

If you want to keep the default behavior on desktop but have a read-only TextField on mobile, you can conditionally render the custom field presented in the previous section:

{{"demo": "behavior-read-only-mobile-text-field/MaterialDatePicker.js", "defaultCodeOpen": false}}

### Using a Button

If you want users to select a value exclusively through the views
and you don't want the UI to look like a Text Field, you can replace the field with the [Button](/material-ui/react-button/) component:

{{"demo": "behavior-button/MaterialDatePicker.js", "defaultCodeOpen": false}}

The same logic can be applied to any Range Picker:

{{"demo": "behavior-button/MaterialDateRangePicker.js", "defaultCodeOpen": false}}

## Build your own custom field

:::success
The sections below show how to build a field for your Picker.
Unlike the field components exposed by `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`, those fields are not suitable for a standalone usage.
:::

### Typing

Each Picker component exposes an interface describing the props it passes to its field.
You can import it from the same endpoint as the Picker component and use it to type the props of your field:

```ts
import { DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';
import { DateRangePickerFieldProps } from '@mui/x-date-pickers-pro/DateRangePicker';

function CustomDateField(props: DatePickerFieldProps) {
  // Your custom field
}

function CustomDateRangeField(props: DateRangePickerFieldProps) {
  // Your custom field
}
```

#### Import

|       Picker component | Field props interface           |
| ---------------------: | :------------------------------ |
|            Date Picker | `DatePickerFieldProps`          |
|            Time Picker | `TimePickerFieldProps`          |
|       Date Time Picker | `DateTimePickerFieldProps`      |
|      Date Range Picker | `DateRangePickerFieldProps`     |
| Date Time Range Picker | `DateTimeRangePickerFieldProps` |

### Validation

You can use the `useValidation` hook to check if the current value passed to your field is valid or not:

```js
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

const {
  // The error associated with the current value.
  // For example: "minDate" if `props.value < props.minDate`.
  validationError,
  // `true` if the value is invalid.
  // On range Pickers it is true if the start date or the end date is invalid.
  hasValidationError,
  // Imperatively get the error of a value.
  getValidationErrorForNewValue,
} = useValidation({
  // If you have a value in an internal state, you should pass it here.
  // Otherwise, you can pass the value returned by `usePickerContext()`.
  value,
  timezone,
  props,
  validator: validateDate,
});
```

#### Import

Each Picker component has a validator adapted to its value type:

|       Picker component | Import validator                                                             |
| ---------------------: | :--------------------------------------------------------------------------- |
|            Date Picker | `import { validateDate } from '@mui/x-date-pickers/validation'`              |
|            Time Picker | `import { validateTime } from '@mui/x-date-pickers/validation'`              |
|       Date Time Picker | `import { validateDateTime } from '@mui/x-date-pickers/validation'`          |
|      Date Range Picker | `import { validateDateRange } from '@mui/x-date-pickers-pro/validation'`     |
| Date Time Range Picker | `import { validateDateTimeRange } from '@mui/x-date-pickers-pro/validation'` |

### Localized placeholder

You can use the `useParsedFormat` to get a clean placeholder.
This hook applies two main transformations on the format:

1. It replaces all the localized tokens (for example `L` for a date with `dayjs`) with their expanded value (`DD/MM/YYYY` for the same date with `dayjs`).
2. It replaces each token with its token from the localization object (for example `YYYY` remains `YYYY` for the English locale but becomes `AAAA` for the French locale).

:::warning
The format returned by `useParsedFormat` cannot be parsed by your date library.
:::

```js
import { useParsedFormat } from '@mui/x-date-pickers/hooks';

// Uses the format defined by your Picker
const parsedFormat = useParsedFormat();

// Uses the custom format provided
const parsedFormat = useParsedFormat({ format: 'MM/DD/YYYY' });
```

### Props forwarded by the picker

The picker can receive some commonly used props that should be forwarded to the field DOM elements:

```jsx
<DatePicker label="Birth date" name="birthdate" className="date-picker" sx={{ borderColor: 'red'}}>
```

If you are using any of those props in one of your picker, make sure to retrieve them in your field using the `usePickerContext` hook:

```jsx
const { label, name, rootClassName, rootSx, rootRef } = usePickerContext();

return (
  <TextField
    label={label}
    name={name}
    className={rootClassName}
    sx={rootSx}
    ref={rootRef}
  />
);
```

### Spread props to the DOM

The field receives a lot of props that cannot be forwarded to the DOM element without warnings.
You can use the `useSplitFieldProps` hook to get the props that can be forwarded safely to the DOM:

```jsx
const { internalProps, forwardedProps } = useSplitFieldProps(
  // The props received by the field component
  props,
  // The value type ("date", "time" or "date-time")
  'date',
);

return <TextField {...forwardedProps}>;
```

### Pass the field to the Picker

You can pass your custom field to your Picker using the `field` slot:

```jsx
function DatePickerWithCustomField() {
  return <DatePicker slots={{ field: CustomDateField }}>;
}

// Also works with the other variants of the component
function DesktopDatePickerWithCustomField() {
  return <DesktopDatePicker slots={{ field: CustomDateField }}>
}
```

### Full custom example

Here is a live demo of the example created in all the previous sections:

{{"demo": "behavior-tutorial/MaterialDatePicker.js", "defaultCodeOpen": false}}
