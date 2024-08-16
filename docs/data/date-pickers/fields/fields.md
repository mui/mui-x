---
productId: x-date-pickers
title: React Date Fields components
components: DateField, TimeField, DateTimeField, MultiInputDateRangeField, SingleInputDateRangeField, MultiInputTimeRangeField, SingleInputTimeRangeField, MultiInputDateTimeRangeField, SingleInputDateTimeRangeField
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Fields component

<p class="description">The field components let the user input date and time values with a keyboard and refined keyboard navigation.</p>

## Introduction

The fields are React components that let you enter a date or time with the keyboard, without using any popover or modal UI.
They provide refined navigation through arrow keys and support advanced behaviors like localization and validation.

### Fields to edit a single element

{{"demo": "SingleDateFieldExamples.js", "defaultCodeOpen": false}}

### Fields to edit a range [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

All fields to edit a range are available in a single input version and in a multi input version.

{{"demo": "DateRangeFieldExamples.js", "defaultCodeOpen": false}}

## Accessible DOM structure

By default, the fields' DOM structure consists of an `<input />`, which holds the whole value for the component, but unfortunately presents a few limitations in terms of accessibility when managing multiple section values.

From v7 version, you can opt-in for a new and experimental DOM structure on any field or picker component using the `enableAccessibleFieldDOMStructure` prop.

```tsx
<DateField enableAccessibleFieldDOMStructure />
<DatePicker enableAccessibleFieldDOMStructure />
<DateRangePicker enableAccessibleFieldDOMStructure />
```

This new feature allows the field component to set aria attributes on individual sections, providing a far better experience with screen readers.

{{"demo": "BasicV7DOMStructure.js", "defaultCodeOpen": false }}

### Usage with `slotProps.field`

When using `slotProps.field` to pass props to your field component,
the field consumes some props (e.g: `shouldRespectLeadingZeros`) and forwards the rest to the `TextField`.

- For the props consumed by the field, the behavior should remain exactly the same with both DOM structures.

  Both components below will respect the leading zeroes on digit sections:

  ```js
  <DatePicker
    slotProps={{ field: { shouldRespectLeadingZeros: true } }}
    enableAccessibleFieldDOMStructure
  />
  <DatePicker
    slotProps={{ field: { shouldRespectLeadingZeros: true } }}
  />
  ```

- For the props forwarded to the `TextField`,
  you can have a look at the next section to see how the migration impact them.

  Both components below will render a small size UI:

  ```js
  <DatePicker
    slotProps={{ field: { size: 'small' } }}
    enableAccessibleFieldDOMStructure
  />
  <DatePicker
    slotProps={{ field: { size: 'small' } }}
  />
  ```

### Usage with `slotProps.textField`

If you are passing props to `slotProps.textField`,
these props will now be received by `PickersTextField` and should keep working the same way as before.

Both components below will render a small size UI:

```js
<DatePicker
  slotProps={{ textField: { size: 'small' } }}
  enableAccessibleFieldDOMStructure
/>
<DatePicker
  slotProps={{ textField: { size: 'small' } }}
/>
```

:::info
If you are passing `inputProps` to `slotProps.textField`,
these props will now be passed to the hidden `<input />` element.
:::

### Usage with `slots.field`

If you are passing a custom field component to your pickers, you need to create a new one that is using the accessible DOM structure.
This new component will need to use the `PickersSectionList` component instead of an `<input />` HTML element.

You can have a look at the [custom PickersTextField](/x/react-date-pickers/custom-field/#using-custom-pickerstextfield) to have a concrete example.

:::info
If your custom field was used to create a Joy UI design component,
you may want to wait a few weeks for the release of an out-of-the-box Joy `PickersTextField` component instead of implementing it yourself.
:::

### Usage with `slots.textField`

If you are passing a custom `TextField` component to your fields and pickers,
you need to create a new one that is using the accessible DOM structure.

You can have a look at the second demo of the [Material PickersTextField section](/x/react-date-pickers/custom-field/#using-material-pickerstextfield) to have a concrete example.

:::info
If your custom `TextField` was used to apply a totally different input that did not use `@mui/material/TextField`,
please consider having a look at the [custom PickersTextField](/x/react-date-pickers/custom-field/#using-custom-pickerstextfield) section which uses `slots.field`.
This approach can be more appropriate for deeper changes.
:::

### Usage with theme

If you are using the theme to customize `MuiTextField`,
you need to pass the same config to `MuiPickersTextField`:

```js
const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiInputLabel-outlined.Mui-focused': {
            color: 'red',
          },
        },
      },
    },
    MuiPickersTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiInputLabel-outlined.Mui-focused': {
            color: 'red',
          },
        },
      },
    },
  },
});
```

If you are using the theme to customize `MuiInput`, `MuiOutlinedInput` or `MuiFilledInput`,
you need to pass the same config to `MuiPickersInput`, `MuiPickersOutlinedInput` or `MuiPickersFilledInput`:

```js
const theme = createTheme({
  components: {
    // Replace with `MuiOutlinedInput` or `MuiFilledInput` if needed
    MuiInput: {
      defaultProps: {
        margin: 'dense',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
    // Replace with `MuiPickersOutlinedInput` or `MuiPickersFilledInput` if needed
    MuiPickersInput: {
      defaultProps: {
        margin: 'dense',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
  },
});
```

If you are using the theme to customize `MuiInputBase`,
you need to pass the same config to `MuiPickersInputBase`:

```js
const theme = createTheme({
  components: {
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
    MuiPickersInputBase: {
      defaultProps: {
        margin: 'dense',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
  },
});
```

## Advanced

### What is a section?

In the field components, the date is divided into several sections, each one responsible for the edition of a date token.
For example, if the format passed to the field is `MM/DD/YYYY`, the field will create 3 sections:

- A `month` section for the token `MM`
- A `day` section for the token `DD`
- A `year` section for the token `YYYY`

Those sections are independent, pressing <kbd class="key">ArrowUp</kbd> while focusing the `day` section will add one day to the date, but it will never change the month or the year.

### Control the selected sections

Use the `selectedSections` and `onSelectedSectionsChange` props to control which sections are currently being selected.

This prop accepts the following formats:

1. If a number is provided, the section at this index will be selected.
2. If `"all"` is provided, all the sections will be selected.
3. If an object with a `startIndex` and `endIndex` fields are provided, the sections between those two indexes will be selected.
4. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
5. If `null` is provided, no section will be selected

:::warning
You need to make sure the input is focused before imperatively updating the selected sections.
:::

{{"demo": "ControlledSelectedSections.js", "defaultCodeOpen": false }}

#### Usage with multi input range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

For multi input range fields, you just have to make sure that the right input is focused before updating the selected section(s).
Otherwise, the section(s) might be selected on the wrong input.

{{"demo": "ControlledSelectedSectionsMultiInputRangeField.js", "defaultCodeOpen": false }}

#### Usage with single input range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

For single input range fields, you won't be able to use the section name to select a single section because each section is present both in the start and in the end date.
Instead, you can pass the index of the section using the `unstableFieldRef` prop to access the full list of sections:

:::warning
The `unstableFieldRef` is not stable yet. More specifically, the shape of the `section` object might be modified in the near future.
Please only use it if needed.
:::

{{"demo": "ControlledSelectedSectionsSingleInputRangeField.js", "defaultCodeOpen": false }}

### Clearable behavior

You can use the `clearable` prop to enable the clearing behavior on a field. You can also add an event handler using the `onClear` callback prop.

:::info
For **multi-input** range fields the clearable behavior is not supported yet.
:::

{{"demo": "ClearableBehavior.js"}}

You can also customize the icon you want to be displayed inside the clear `IconButton`.

{{"demo": "CustomizeClearIcon.js"}}
