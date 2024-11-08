---
productId: x-date-pickers
---

# Migration from v7 to v8

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v7 to v8.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-date-pickers` from v7 to v8.

## Start using the new release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-date-pickers": "7.x.x",
+"@mui/x-date-pickers": "next",
```

Using `next` ensures that it will always use the latest v8 pre-release version, but you can also use a fixed version, like `8.0.0-alpha.0`.

Since `v8` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v7 to v8.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v8. You can run `v8.0.0/pickers/preset-safe` targeting only Date and Time Pickers or `v8.0.0/preset-safe` to target the other packages as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #default-branch-switch -->

```bash
// Date and Time Pickers specific
npx @mui/x-codemod@latest v8.0.0/pickers/preset-safe <path>

// Target the other packages as well
npx @mui/x-codemod@latest v8.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for pickers](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-pickers-v800) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v8.0.0/pickers/preset-safe` (or `v8.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<DatePicker {...pickerProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

## New DOM structure for the field

Before version `v8.x`, the fields' DOM structure consisted of an `<input />`, which held the whole value for the component,
but unfortunately presents a few limitations in terms of accessibility when managing multiple section values.

Starting with version `v8.x`, all the field and picker components come with a new DOM structure that allows the field component to set aria attributes on individual sections, providing a far better experience with screen readers.

### Fallback to the non-accessible DOM structure

```tsx
<DateField enableAccessibleFieldDOMStructure={false} />
<DatePicker enableAccessibleFieldDOMStructure={false} />
<DateRangePicker enableAccessibleFieldDOMStructure={false} />
```

### Migrate `slotProps.field`

When using `slotProps.field` to pass props to your field component,
the field consumes some props (e.g: `shouldRespectLeadingZeros`) and forwards the rest to the `TextField`.

- For the props consumed by the field, the behavior should remain exactly the same with both DOM structures.

  Both components below will respect the leading zeroes on digit sections:

  ```js
  <DatePicker
    slotProps={{ field: { shouldRespectLeadingZeros: true } }}
    enableAccessibleFieldDOMStructure={false}
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
    enableAccessibleFieldDOMStructure={false}
   />
  <DatePicker
    slotProps={{ field: { size: 'small' } }}
  />
  ```

### Migrate `slotProps.textField`

If you are passing props to `slotProps.textField`,
these props will now be received by `PickersTextField` and should keep working the same way as before.

Both components below will render a small size UI:

```js
<DatePicker
  slotProps={{ textField: { size: 'small' } }}
  enableAccessibleFieldDOMStructure={false}
/>
<DatePicker
  slotProps={{ textField: { size: 'small' } }}
/>
```

:::info
If you are passing `inputProps` to `slotProps.textField`,
these props will now be passed to the hidden `<input />` element.
:::

### Migrate `slots.field`

If you are passing a custom field component to your pickers, you need to create a new one that is using the accessible DOM structure.
This new component will need to use the `PickersSectionList` component instead of an `<input />` HTML element.

You can have a look at the [Using a custom input](/x/react-date-pickers/custom-field/#using-a-custom-input) section to have a concrete example.

### Migrate `slots.textField`

If you are passing a custom `TextField` component to your fields and pickers,
you need to create a new one that is using the accessible DOM structure.

You can have a look at the [Wrapping PickersTextField](/x/react-date-pickers/custom-field/#wrapping-pickerstextfield) section to have a concrete example.

:::info
If your custom `TextField` was used to apply a totally different input that did not use `@mui/material/TextField`,
please consider having a look at the [Using a custom input](/x/react-date-pickers/custom-field/#using-a-custom-input) section which uses `slots.field`.
This approach can be more appropriate for deeper changes.
:::

### Migrate the theme

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

## Renamed variables

The following variables were renamed to have a coherent `Picker` / `Pickers` prefix:

- `usePickersTranslation`

  ```diff
  - import { usePickersTranslation } from '@mui/x-date-pickers/hooks';
  - import { usePickersTranslation } from '@mui/x-date-pickers';
  - import { usePickersTranslation } from '@mui/x-date-pickers-pro';

  + import { usePickerTranslation } from '@mui/x-date-pickers/hooks';
  + import { usePickerTranslation } from '@mui/x-date-pickers';
  + import { usePickerTranslation } from '@mui/x-date-pickers-pro';

  - const translations = usePickersTranslation();
  + const translations = usePickerTranslation();
  ```

  - `usePickersContext`

  ```diff
  - import { usePickersContext } from '@mui/x-date-pickers/hooks';
  - import { usePickersContext } from '@mui/x-date-pickers';
  - import { usePickersContext } from '@mui/x-date-pickers-pro';

  + import { usePickerContext } from '@mui/x-date-pickers/hooks';
  + import { usePickerContext } from '@mui/x-date-pickers';
  + import { usePickerContext } from '@mui/x-date-pickers-pro';

  - const pickersContext = usePickersContext();
  + const pickerContext = usePickerContext();
  ```

## Typing breaking changes

### Remove `TDate` generic

The `TDate` generic has been removed from all the types, interfaces, and variables of the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages.

If you were passing your date object type as a generic to any element of one of those packages, you can remove it:

```diff
-<DatePicker<Dayjs> value={value} onChange={onChange} />
+<DatePicker value={value} onChange={onChange} />

-type Slot = DateCalendarSlots<Dayjs>['calendarHeader'];
+type Slot = DateCalendarSlots['calendarHeader'];

-type Props = DatePickerToolbarProps<Dayjs>;
+type Props = DatePickerToolbarProps;
```

A follow-up release will add the full list of the impacted elements to the migration guide.

### Removed types

The following types are no longer exported by `@mui/x-date-pickers` and/or `@mui/x-date-pickers-pro`.
If you were using them, you need to replace them with the following code:

- `UseDateFieldComponentProps`

  ```ts
  import { UseDateFieldProps } from '@mui/x-date-pickers/DateField';
  import { PickerValidDate } from '@mui/x-date-pickers/models';

  type UseDateFieldComponentProps<
    TDate extends PickerValidDate,
    TEnableAccessibleFieldDOMStructure extends boolean,
    TChildProps extends {},
  > = Omit<
    TChildProps,
    keyof UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  > &
    UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;
  ```

- `UseTimeFieldComponentProps`

  ```ts
  import { UseTimeFieldProps } from '@mui/x-date-pickers/TimeField';
  import { PickerValidDate } from '@mui/x-date-pickers/models';

  type UseTimeFieldComponentProps<
    TDate extends PickerValidDate,
    TEnableAccessibleFieldDOMStructure extends boolean,
    TChildProps extends {},
  > = Omit<
    TChildProps,
    keyof UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  > &
    UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;
  ```

- `UseDateTimeFieldComponentProps`

  ```ts
  import { UseDateTimeFieldProps } from '@mui/x-date-pickers/DateTimeField';
  import { PickerValidDate } from '@mui/x-date-pickers/models';

  type UseDateTimeFieldComponentProps<
    TDate extends PickerValidDate,
    TEnableAccessibleFieldDOMStructure extends boolean,
    TChildProps extends {},
  > = Omit<
    TChildProps,
    keyof UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  > &
    UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;
  ```

- `BaseSingleInputFieldProps`

  - If you are building a custom field for a Date Picker:

    ```diff
    -import {
    -  BaseSingleInputFieldProps,
    -  DateValidationError,
    -  FieldSection,
    -} from '@mui/x-date-pickers/models';
    -import { UseDateFieldProps } from '@mui/x-date-pickers/DateField';
    +import { DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';

    -interface CustomDateFieldProps
    -  extends UseDateFieldProps<Dayjs, true>,
    -    BaseSingleInputFieldProps<
    -      Dayjs | null,
    -      Dayjs,
    -      FieldSection,
    -      true,
    -      DateValidationError
    -    > {}
    +interface CustomDateFieldProps extends DatePickerFieldProps {}
    ```

  - If you are building a custom field for a Time Picker:

    ```diff
    -import {
    -  BaseSingleInputFieldProps,
    -  TimeValidationError,
    -  FieldSection,
    -} from '@mui/x-date-pickers/models';
    -import { UseTimeFieldProps } from '@mui/x-date-pickers/TimeField';
    +import { TimePickerFieldProps } from '@mui/x-date-pickers/TimePicker';

    -interface CustomTimeFieldProps
    - extends UseTimeFieldProps<Dayjs, true>,
    - BaseSingleInputFieldProps<
    -      Dayjs | null,
    -      Dayjs,
    -      FieldSection,
    -      true,
    -      TimeValidationError
    - > {}
    +interface CustomTimeFieldProps extends TimePickerFieldProps {}
    ```

  - If you are building a custom field for a Date Time Picker:

    ```diff
    -import {
    -  BaseSingleInputFieldProps,
    -  DateTimeValidationError,
    -  FieldSection,
    -} from '@mui/x-date-pickers/models';
    -import { UseDateTimeFieldProps } from '@mui/x-date-pickers/DateTimeField';
    +import { DateTimePickerFieldProps } from '@mui/x-date-pickers/DateTimePicker';

    -interface CustomDateTimeFieldProps
    -  extends UseDateTimeFieldProps<Dayjs, true>,
    -    BaseSingleInputFieldProps<
    -      Dayjs | null,
    -      Dayjs,
    -      FieldSection,
    -      true,
    -      DateTimeValidationError
    -    > {}
    +interface CustomDateTimeFieldProps extends DateTimePickerFieldProps {}
    ```

  - If you are building a custom single input field for a Date Range Picker:

    ```diff
    -import {
    -  DateRangeValidationError,
    -  RangeFieldSection,
    -  DateRange,
    -} from '@mui/x-date-pickers-pro/models';
    -import {
    -  UseSingleInputDateRangeFieldProps
    -} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
    +import { DateRangePickerFieldProps } from '@mui/x-date-pickers-pro/DateRangePicker';

    -interface CustomDateRangeFieldProps
    -  extends UseSingleInputDateRangeFieldProps<Dayjs, true>,
    -    BaseSingleInputFieldProps<
    -      DateRange<Dayjs>,
    -      Dayjs,
    -      RangeFieldSection,
    -      true,
    -      DateRangeValidationError
    -    >
    +interface CustomDateRangeFieldProps extends DateRangePickerFieldProps {}
    ```

  - If you are building a custom single input field for a Date Time Range Picker:

    ```diff
    -import {
    -  DateTimeRangeValidationError,
    -  RangeFieldSection,
    -  DateRange,
    -} from '@mui/x-date-pickers-pro/models';
    -import {
    -  UseSingleInputDateTimeRangeFieldProps
    -} from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
    +import {
    +  DateTimeRangePickerFieldProps
    +} from '@mui/x-date-pickers-pro/DateTimeRangePicker';

    -interface CustomDateTimeRangeFieldProps
    -  extends UseSingleInputDateTimeRangeFieldProps<Dayjs, true>,
    -    BaseSingleInputFieldProps<
    -      DateRange<Dayjs>,
    -      Dayjs,
    -      RangeFieldSection,
    -      true,
    -      DateTimeRangeValidationError
    -    >
    +interface CustomDateTimeRangeFieldProps extends DateTimeRangePickerFieldProps {}
    ```

- `BaseMultiInputFieldProps`

  - If you are building a custom multi input field for a Date Range Picker:

    ```diff
    -import {
    -  DateRangeValidationError,
    -  RangeFieldSection,
    -  DateRange,
    -} from '@mui/x-date-pickers-pro/models';
    -import {
    -  UseMultiInputDateRangeFieldProps
    -} from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
    +import { DateRangePickerFieldProps } from '@mui/x-date-pickers-pro/DateRangePicker';

    -interface CustomDateRangeFieldProps
    -  extends UseMultiInputDateRangeFieldProps<Dayjs, true>,
    -    BaseMultiInputFieldProps<
    -      DateRange<Dayjs>,
    -      Dayjs,
    -      RangeFieldSection,
    -      true,
    -      DateRangeValidationError
    -    > {}
    +interface CustomDateRangeFieldProps
    +  extends Omit<
    +     DateRangePickerFieldProps<true>,
    +    'unstableFieldRef' | 'clearable' | 'onClear'
    +  >,
    +  MultiInputFieldRefs {}
    ```

  - If you are building a custom multi input field for a Date Time Range Picker:

    ```diff
    -import {
    -  DateTimeRangeValidationError,
    -  RangeFieldSection,
    -  DateRange,
    -} from '@mui/x-date-pickers-pro/models';
    -import {
    -  UseMultiInputDateTimeRangeFieldProps
    -} from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
    +import {
    +  DateTimeRangePickerFieldProps
    +} from '@mui/x-date-pickers-pro/DateTimeRangePicker';

    -interface CustomDateTimeRangeFieldProps
    -  extends UseMultiInputDateTimeRangeFieldProps<Dayjs, false>,
    -    BaseMultiInputFieldProps<
    -      DateRange<Dayjs>,
    -      Dayjs,
    -      RangeFieldSection,
    -      false,
    -      DateTimeRangeValidationError
    -    > {}
    +interface JoyMultiInputDateRangeFieldProps
    +  extends Omit<
    +     DateTimeRangePickerFieldProps<false>,
    +    'unstableFieldRef' | 'clearable' | 'onClear'
    +  >,
    +  MultiInputFieldRefs {}
    ```

- `BasePickersTextFieldProps`

  - If your Text Field is used inside a non-range picker or in a range-picker with a single input field:

    ```diff
    -import { BasePickersTextFieldProps } from '@mui/x-date-pickers-pro/models';
    +import { BaseSingleInputPickersTextFieldProps } from '@mui/x-date-pickers/models';

     interface CustomTextFieldProps
    -  extends BasePickersTextFieldProps<true> {}
    +  extends BaseSingleInputPickersTextFieldProps<true> {}
    ```

  - If your Text Field is used inside a range-picker with a multi input field:

    ```diff
    -import { BasePickersTextFieldProps } from '@mui/x-date-pickers-pro/models';
    +import { BaseMultiInputPickersTextFieldProps } from '@mui/x-date-pickers-pro/models';

     interface CustomTextFieldProps
    -  extends BasePickersTextFieldProps<true> {}
    +  extends BaseMultiInputPickersTextFieldProps<true> {}
    ```

## Stop using `LicenseInfo` from `@mui/x-date-pickers-pro`

The `LicenseInfo` object is not exported from the `@mui/x-date-pickers-pro` package anymore.
You can import it from `@mui/x-license` instead:

```diff
-import { LicenseInfo } from '@mui/x-date-pickers-pro';
+import { LicenseInfo } from '@mui/x-license';

 LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

## Stop passing `utils` and the date object to some translation keys

Some translation keys no longer require `utils` and the date object as parameters, but only the formatted value as a string. The keys affected by this changes are: `clockLabelText`, `openDatePickerDialogue` and `openTimePickerDialogue`.
If you have customized those translation keys, you have to update them following the examples below:

- If you are setting a custom value in a picker component:

```diff
-clockLabelText: (view, time, utils) =>
-   `Select ${view}. ${
-     time === null || !utils.isValid(time)
-       ? 'No time selected'
-       : `Selected time is ${utils.format(time, 'fullTime')}`
-   }`
+clockLabelText: (view, formattedTime) =>
+   `Select ${view}. ${
+     formattedTime == null ? 'No time selected' : `Selected time is ${formattedTime}`
+   }`

-openDatePickerDialogue: (value, utils) =>
-  value !== null && utils.isValid(value)
-    ? `Choose date, selected date is ${utils.format(value, 'fullDate')}`
-    : 'Choose date',
+openDatePickerDialogue: (formattedDate) =>
+  formattedDate ? `Choose date, selected date is ${formattedDate}` : 'Choose date'

-openTimePickerDialogue: (value, utils) =>
-  value !== null && utils.isValid(value)
-    ? `Choose time, selected time is ${utils.format(value, 'fullTime')}`
-    : 'Choose time',
+openTimePickerDialogue: (formattedTime) =>
+  formattedTime ? `Choose time, selected time is ${formattedTime}` : 'Choose time'
```

- If you are setting a custom value in the `LocalizationProvider`:

```diff
 <LocalizationProvider localeText={{
-   clockLabelText: (view, time, utils) =>
-     `Select ${view}. ${
-       time === null || !utils.isValid(time)
-         ? 'No time selected'
-         : `Selected time is ${utils.format(time, 'fullTime')}`
-     }`
+   clockLabelText: (view, formattedTime) =>
+     `Select ${view}. ${
+       formattedTime == null ? 'No time selected' : `Selected time is ${formattedTime}`
+     }`
-   openDatePickerDialogue: (value, utils) =>
-     value !== null && utils.isValid(value)
-      ? `Choose date, selected date is ${utils.format(value, 'fullDate')}`
-      : 'Choose date',
+   openDatePickerDialogue: (formattedDate) =>
+     formattedDate ? `Choose date, selected date is ${formattedDate}` : 'Choose date'
-   openTimePickerDialogue: (value, utils) =>
-     value !== null && utils.isValid(value)
-       ? `Choose time, selected time is ${utils.format(value, 'fullTime')}`
-       : 'Choose time',
+   openTimePickerDialogue: (formattedTime) =>
+     formattedTime ? `Choose time, selected time is ${formattedTime}` : 'Choose time'
 }} >
```

- If you using this translation key in a custom component:

```diff
 const translations = usePickerTranslations();

-const clockLabelText = translations.clockLabelText(
-  view,
-  value,
-  {} as any,
-  value == null ? null : value.format('hh:mm:ss')
-);
+const clockLabelText = translations.clockLabelText(
+  view,
+  value == null ? null : value.format('hh:mm:ss')
+);

-const openDatePickerDialogue = translations.openDatePickerDialogue(
-  value,
-  {} as any,
-  value == null ? null : value.format('MM/DD/YYY')
-);
+const openDatePickerDialogue = translations.openDatePickerDialogue(
+  value == null ? null : value.format('MM/DD/YYY')
+);

-const openTimePickerDialogue = translations.openTimePickerDialogue(
-  value,
-  {} as any,
-  value == null ? null : value.format('hh:mm:ss')
-);
+const openTimePickerDialogue = translations.openTimePickerDialogue(
+  value == null ? null : value.format('hh:mm:ss')
+);
```
