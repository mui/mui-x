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

### Build your own custom field

:::success
The sections below show how to build a field for your picker.
Unlike the field components exposed by `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`, those fields are not suitable for a standalone usage.
:::

#### Basic example

```jsx
function CustomDateField(props) {
  const { format, value, onChange } = props;
  const [inputValue, setInputValue] = useInputValue(value, format);

  const handleChange = (event) => {
    const newInputValue = event.target.value;
    const newValue = dayjs(newInputValue, format);
    setInputValue(newInputValue);
    onChange(newValue, { validationError: null });
  };

  return <TextField value={inputValue} onChange={handleChange} />;
}

function useInputValue(valueProp, format) {
  const [lastValueProp, setLastValueProp] = React.useState(valueProp);
  const [inputValue, setInputValue] = React.useState(() =>
    createInputValue(valueProp, format),
  );

  if (lastValueProp !== valueProp) {
    setLastValueProp(valueProp);
    if (valueProp && valueProp.isValid()) {
      setInputValue(createInputValue(valueProp, format));
    }
  }

  return [inputValue, setInputValue];
}

function createInputValue(value, format) {
  if (value == null) {
    return '';
  }

  return value.isValid() ? value.format(format) : '';
}
```

You can then pass your custom field to your picker using the `field` slot:

```tsx
function DatePickerWithCustomField() {
  return (
    <DatePicker slots={{ field: CustomDateField }}>
  )
}

// Also works with the other variants of the component
function DesktopDatePickerWithCustomField() {
  return (
    <DesktopDatePicker slots={{ field: CustomDateField }}>
  )
}

```

#### Typing

Each picker component exposes an interface describing the props it passes to its field.
You can import it from the same endpoint as the picker component and use it to type the props of your field:

```tsx
import { DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';
import { DateRangePickerFieldProps } from '@mui/x-date-pickers-pro/DateRangePicker';

function CustomDateField(props: DatePickerFieldProps) {
  // Your custom field
}

function CustomDateRangeField(props: DateRangePickerFieldProps) {
  // Your custom field
}
```

##### Import

|       Picker component | Field props interface           |
| ---------------------: | :------------------------------ |
|            Date Picker | `DatePickerFieldProps`          |
|            Time Picker | `TimePickerFieldProps`          |
|       Date Time Picker | `DateTimePickerFieldProps`      |
|      Date Range Picker | `DateRangePickerFieldProps`     |
| Date Time Range Picker | `DateTimeRangePickerFieldProps` |

#### Validation

You can use the `useValidation` hook to check if the current value passed to your field is valid or not:

```ts
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

const {
  // The error associated to the current value.
  // i.e.: "minDate" if `props.value < props.minDate`.
  validationError,
  // `true` if the value is invalid.
  // On range pickers it is true if the start date or the end date is invalid.
  hasValidationError,
  // Imperatively get the error of a value.
  // Can be useful to generate the context to pass to `onChange`.
  getValidationErrorForNewValue,
} = useValidation({
  value: props.value, // If you have a value in an internal state, you should pass it here.
  timezone: props.timezone,
  props,
  validator: validateDate,
});
```

##### Import

Each picker component has a validator adapted to its value type:

|       Picker component | Import validator                                                             |
| ---------------------: | :--------------------------------------------------------------------------- |
|            Date Picker | `import { validateDate } from '@mui/x-date-pickers/validation'`              |
|            Time Picker | `import { validateTime } from '@mui/x-date-pickers/validation'`              |
|       Date Time Picker | `import { validateDateTime } from '@mui/x-date-pickers/validation'`          |
|      Date Range Picker | `import { validateDateRange } from '@mui/x-date-pickers-pro/validation'`     |
| Date Time Range Picker | `import { validateDateTimeRange } from '@mui/x-date-pickers-pro/validation'` |

##### Updated example

Here is the updated example with validation:

```jsx
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
// ... other imports

function CustomDateField(props) {
  const { format, timezone, value, onChange } = props;
  const [inputValue, setInputValue] = useInputValue(value, format);

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    value,
    timezone,
    props,
    validator: validateDate,
  });

  const handleChange = (event) => {
    const newInputValue = event.target.value;
    const newValue = dayjs(newInputValue, format);
    setInputValue(newInputValue);
    onChange(newValue, { validationError: getValidationErrorForNewValue(newValue) });
  };

  return (
    <TextField
      value={inputValue}
      onChange={handleChange}
      error={hasValidationError}
    />
  );
}
```

#### Localized placeholder

You can use the `useParsedFormat` to get a clean placeholder.
This hook applies two main transformation on the format:

1. It replaces all the localized tokens (i.e: `L` for a date with `dayjs`) with there expanded value (`DD/MM/YYYY` for the same date with `dayjs`).
2. It replaces each token with its token from our localization object (i.e: `YYYY` remains `YYYY` for the english locale but becomes `AAAA` for the french locale).

:::warning
The format returned by `useParsedFormat` cannot be parsed by your date library.
:::

```js
import { useParsedFormat } from '@mui/x-date-pickers/hooks';

const parsedFormat = useParsedFormat(props);
```

##### Updated example

Here is the updated example with a placeholder:

```jsx
import { useParsedFormat } from '@mui/x-date-pickers/hooks';
// ... other imports

function CustomDateField(props) {
  const { format, timezone, value, onChange } = props;
  const [inputValue, setInputValue] = useInputValue(value, format);

  const placeholder = useParsedFormat(props);

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    value,
    timezone,
    props,
    validator: validateDate,
  });

  const handleChange = (event) => {
    const newInputValue = event.target.value;
    const newValue = dayjs(newInputValue, format);
    setInputValue(newInputValue);
    onChange(newValue, { validationError: getValidationErrorForNewValue(newValue) });
  };

  return (
    <TextField
      placeholder={format}
      value={inputValue}
      onChange={handleChange}
      error={hasValidationError}
    />
  );
}
```

#### Spread props to the DOM

The field receives a lot of props that cannot be forwarded to the DOM element without warnings.
You can use the `useSplitFieldProps` hook to get the props that can be forwarded safely to the DOM:

```tsx
const { internalProps, forwardedProps } = useSplitFieldProps(
  // The props received by the field component
  props,
  // The value type ("date", "time" or "date-time")
  'date',
);

return (
  <TextField {...forwardedProps} value={inputValue} onChange={handleChange}>
)
```

:::success
The `forwardedProps` contain props like `slots`, `slotProps` and `sx` that are specific to MUI.
You can omit them if the component your are forwarding the props to does not support those concepts:

```jsx
const { slots, slotProps, sx, ...other } = props;

const { internalProps, forwardedProps } = useSplitFieldProps(other, 'date');

return (
  <TextField {...forwardedProps} value={inputValue} onChange={handleChange}>
)
```

:::

##### Updated example

Here is the updated example with the props forwarded to the DOM:

```jsx
function CustomDateField(props) {
  // TextField does not support slots and slotProps before `@mui/material` v6.0
  const { slots, slotProps, ...other } = props;
  const { internalProps, forwardedProps } = useSplitFieldProps(other, 'date');

  const { format, timezone, value, onChange } = internalProps;
  const [inputValue, setInputValue] = useInputValue(value, format);

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    value,
    timezone,
    props: internalProps,
    validator: validateDate,
  });

  const handleChange = (event) => {
    const newInputValue = event.target.value;
    const newValue = dayjs(newInputValue, format);
    setInputValue(newInputValue);
    onChange(newValue, { validationError: getValidationErrorForNewValue(newValue) });
  };

  const placeholder = useParsedFormat(internalProps);

  return (
    <TextField
      {...forwardedProps}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      error={hasValidationError}
    />
  );
}
```

#### Enhanced basic example

Here is a live demo of the example created in all the previous sections:

{{"demo": "behavior-tutorial/MaterialDatePicker.js", "defaultCodeOpen": false}}
