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

-"@mui/x-date-pickers-pro": "7.x.x",
+"@mui/x-date-pickers-pro": "next",
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
# Date and Time Pickers specific
npx @mui/x-codemod@latest v8.0.0/pickers/preset-safe <path>

# Target the other packages as well
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

## Components breaking changes

### New DOM structure for the field

Before version `v7.x`, the fields' DOM structure consisted of an `<input />`, which held the whole value for the component.
Unfortunately it presented accessibility limitations, which are impossible to resolve.

Starting with version `v7.x`, we have introduced a new DOM structure that allows the field component to set aria attributes on individual sections, providing a far better experience on screen readers.
This approach is recommended in [W3C ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/examples/datepicker-spinbuttons/) example and is also used by native date HTML input element under the hood.

Starting with version `v8.x`, the new DOM structure is the default for all fields.

#### Fallback to the non-accessible DOM structure

```tsx
<DateField enableAccessibleFieldDOMStructure={false} />
<DatePicker enableAccessibleFieldDOMStructure={false} />
<DateRangePicker enableAccessibleFieldDOMStructure={false} />
```

#### Migrate `slotProps.field`

When using `slotProps.field` to pass props to your field component,
the field consumes some props (for example `shouldRespectLeadingZeros`) and forwards the rest to the `TextField`.

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

#### Migrate `slotProps.textField`

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

#### Migrate `slots.field`

If you are passing a custom field component to your pickers, you need to create a new one that is using the accessible DOM structure.
This new component will need to use the `PickersSectionList` component instead of an `<input />` HTML element.

You can have a look at the [Using a custom input](/x/react-date-pickers/custom-field/#using-a-custom-input) section to have a concrete example.

#### Migrate `slots.textField`

If you are passing a custom `TextField` component to your fields and pickers,
you need to create a new one that is using the accessible DOM structure.

You can have a look at the [Wrapping PickersTextField](/x/react-date-pickers/custom-field/#wrapping-pickerstextfield) section to have a concrete example.

:::info
If your custom `TextField` was used to apply a totally different input that did not use `@mui/material/TextField`,
please consider having a look at the [Using a custom input](/x/react-date-pickers/custom-field/#using-a-custom-input) section which uses `slots.field`.
This approach can be more appropriate for deeper changes.
:::

#### Migrate the theme

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

### Month Calendar

To simplify the theme and class structure, the `<PickersMonth />` component has been moved inside the Month Calendar component.
This change causes a few breaking changes:

- The classes from `pickersMonthClasses` have been moved inside `monthCalendarClasses`:

  ```diff
  -import { pickersMonthClasses } from '@mui/x-date-pickers/MonthCalendar';
  +import { monthCalendarClasses } from '@mui/x-date-pickers/MonthCalendar';

  -const buttonClassName = pickersMonthClasses.monthButton;
  +const buttonClassName = monthCalendarClasses.button;

  -const selectedButtonClassName = pickersMonthClasses.selected;
  +const selectedButtonClassName = monthCalendarClasses.selected;

  -const disabledButtonClassName = pickersMonthClasses.disabled;
  +const disabledButtonClassName = monthCalendarClasses.disabled;
  ```

- The `monthButton` slot of the `PickersMonth` style overrides has been replaced by the `button` slot of the `MonthCalendar` theme entry:

  ```diff
   const theme = createTheme({
     components: {
  -    PickersMonth: {
  +    MonthCalendar: {
         styleOverrides: {
  -        monthButton: {
  +        button: {
             color: 'red',
           },
         },
       },
     },
   });
  ```

- The button to render a single month is no longer wrapped in a `<div />`, the spacing are instead defined inside the `root` slot of the Month Calendar.

### Year Calendar

To simplify the theme and class structure, the `<PickersYear />` component has been moved inside the Year Calendar component.
This change causes a few breaking changes:

- The classes from `pickersYearClasses` have been moved inside `yearCalendarClasses`:

  ```diff
  -import { pickersYearClasses } from '@mui/x-date-pickers/YearCalendar';
  +import { yearCalendarClasses } from '@mui/x-date-pickers/YearCalendar';

  -const buttonClassName = pickersYearClasses.monthButton;
  +const buttonClassName = yearCalendarClasses.button;

  -const selectedButtonClassName = pickersYearClasses.selected;
  +const selectedButtonClassName = yearCalendarClasses.selected;

  -const disabledButtonClassName = pickersYearClasses.disabled;
  +const disabledButtonClassName = yearCalendarClasses.disabled;
  ```

- The `yearButton` slot of the `PickersYear` style overrides has been replaced by the `button` slot of the `YearCalendar` theme entry:

  ```diff
   const theme = createTheme({
     components: {
  -    PickersYear: {
  +    YearCalendar: {
         styleOverrides: {
  -        yearButton: {
  +        button: {
             color: 'red',
           },
         },
       },
     },
   });
  ```

- The button to render a single year is no longer wrapped in a `<div />`, the spacing are instead defined inside the `root` slot of the Year Calendar.

### Update default `closeOnSelect` and Action Bar `actions` values

The default value of the `closeOnSelect` prop has been updated to `false` for all Picker components, except `<DesktopDatePicker />` and `<DesktopDateRangePicker />`, which still have `closeOnSelect` set to `true`.

This change goes hand in hand with the new default `actions` prop value for the `<PickersActionBar />` component.
The default value of the `actions` prop has been updated to `['cancel', 'accept']` for all Picker components, except `<DesktopDatePicker />` and `<DesktopDateRangePicker />`.

If the updated values do not fit your use case, you can [override them](/x/react-date-pickers/custom-components/#component-props).

## Slots breaking changes

### Slot: `layout`

- The `<PickersLayoutRoot />` and `<PickersLayoutContentWrapper />` components must now receive the `ownerState` returned by `usePickerLayout` instead of their props:

  ```diff
  -const { toolbar, tabs, content, actionBar } = usePickerLayout(props);
  +const { toolbar, tabs, content, actionBar, ownerState } = usePickerLayout(props);

   return (
  -  <PickersLayoutRoot ownerState={props}>
  -    <PickersLayoutContentWrapper>
  +  <PickersLayoutRoot ownerState={ownerState}>
  +    <PickersLayoutContentWrapper ownerState={ownerState}>
       </PickersLayoutContentWrapper>
     </PickersLayoutRoot>
   );
  ```

- The component passed to the `layout` slot no longer receives the `value` prop.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

   // This contains a small behavior change.
   // If the picker receives an invalid date,
   // the old value equals `null`.
   // the new value equals the invalid date received.
  -const { value } = props;
  +const { value } = usePickerContext();
  ```

- The component passed to the `layout` slot no longer receives the `disabled` and `readOnly` props.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { disabled } = props;
  +const { disabled } = usePickerContext();

  -const { readOnly } = props;
  +const { readOnly } = usePickerContext();
  ```

- The component passed to the `layout` slot no longer receives the `isRtl` prop.
  You can use the `useRtl` hook from `@mui/system` instead:

  ```diff
  +import { useRtl } from '@mui/system/RtlProvider';

  -  const { isRtl } = props;
  +  const isRtl = useRtl();
  ```

- The component passed to the `layout` slot no longer receives the `orientation` and `isLandscape` props.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { orientation } = props;
  +const { orientation } = usePickerContext();

  -const { isLandscape } = props;
  +const { orientation } = usePickerContext();
  +const isLandscape = orientation === 'landscape';
  ```

- The component passed to the `layout` slot no longer receives the `wrapperVariant` prop.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { wrapperVariant } = props;
  +const { variant } = usePickerContext();
  ```

- The component passed to the `layout` slot no longer receives the `view`, `views` and `onViewChange` props.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { view } = props;
  +const { view } = usePickerContext();

  -const { views } = props;
  +const { views } = usePickerContext();

  -const { onViewChange } = props;
  +const { onViewChange } = usePickerContext();
  ```

- The component passed to the `layout` slot no longer receives the `onClear`, `onSetToday`, `onAccept`, `onCancel`, `onOpen`, `onClose` `onDismiss`, `onChange` and `onSelectShortcut` props.
  You can use the `usePickerActionsContext` or the `usePickerContext` hooks instead:

  ```diff
  +import { usePickerActionsContext } from '@mui/x-date-pickers/hooks';

  -const { onClear } = props;
  +const { clearValue } = usePickerActionsContext();

  -const { onSetToday } = props;
  +const { setValueToToday } = usePickerActionsContext();

  -const { onAccept } = props;
  +const { acceptValueChanges } = usePickerActionsContext();

  -const { onCancel } = props;
  +const { cancelValueChanges } = usePickerActionsContext();

  -const { onOpen } = props;
  +const { setOpen } = usePickerActionsContext();
  +const onOpen = event => {
  +  event.preventDefault();
  +  setOpen(true);
  +}

  -const { onClose } = props;
  +const { setOpen } = usePickerActionsContext();
  +const onClose = event => {
  +  event.preventDefault();
  +  setOpen(false);
  +}

   // This contains a small behavior change.
   // If the picker is not controlled and has a default value,
   // opening it and calling `acceptValueChanges` without any change will call `onAccept`
   // with the default value.
   // Whereas before, opening it and calling `onDimiss` without any change would
   // not have called `onAccept`.
  -const { onDismiss } = props;
  +const { acceptValueChanges } = usePickerActionsContext();
  +const onDismiss = acceptValueChanges

  -const { onChange } = props;
  -onChange(dayjs(), 'partial');
  -onChange(dayjs(), 'finish');
  +const { setValue } = usePickerActionsContext();
  +setValue(dayjs(), { changeImportance: 'set' });
  +setValue(dayjs(), { changeImportance: 'accept' });

  -const { onSelectShortcut } = props;
  -onSelectShortcut(dayjs(), 'accept', myShortcut);
  +const { setValue } = usePickerActionsContext();
  +setValue(dayjs(), { changeImportance: 'accept', shortcut: myShortcut });
  ```

  :::success
  The `usePickerContext` also contain all the actions returned by `usePickerActionsContext`.
  The only difference is that `usePickerActionsContext` only contains variables with stable references that won't cause a re-render of your component.
  :::

- The component passed to the `layout` slot no longer receives the `rangePosition` and `onRangePositionChange` on range pickers.
  You can use the `usePickerRangePositionContext` hook instead:

  ```diff
  +import { usePickerRangePositionContext } from '@mui/x-date-pickers-pro/hooks';

  -const { rangePosition } = props;
  +const { rangePosition } = usePickerRangePositionContext();

  -const { onRangePositionChange } = props;
  +const { onRangePositionChange } = usePickerRangePositionContext();
  ```

### Slot: `toolbar`

- The component passed to the `toolbar` slot no longer receives the `value` prop.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

   // This contains a small behavior change.
   // If the picker receives an invalid date,
   // the old value would equal `null`.
   // the new value would equal the invalid date received.
  -const { value } = props;
  +const { value } = usePickerContext();
  ```

- The component passed to the `toolbar` slot no longer receives the `disabled` and `readOnly` props.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { disabled } = props;
  +const { disabled } = usePickerContext();

  -const { readOnly } = props;
  +const { readOnly } = usePickerContext();
  ```

- The component passed to the `toolbar` slot no longer receives the `isLandscape` prop.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { isLandscape } = props;
  +const { orientation } = usePickerContext();
  +const isLandscape = orientation === 'landscape';
  ```

- The component passed to the `toolbar` slot no longer receives the `view`, `views` and `onViewChange` props.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { view } = props;
  +const { view } = usePickerContext();

  -const { views } = props;
  +const { views } = usePickerContext();

  -const { onViewChange } = props;
  +const { onViewChange } = usePickerContext();
  ```

- The component passed to the `toolbar` slot no longer receives the `onChange` prop.
  You can use the `usePickerActionsContext` or the `usePickerContext` hooks instead:

  ```diff
  +import { usePickerActionsContext } from '@mui/x-date-pickers/hooks';

  -const { onChange } = props;
  -onChange(dayjs(), 'partial');
  -onChange(dayjs(), 'finish');
  +const { setValue } = usePickerActionsContext();
  +setValue(dayjs(), { changeImportance: 'set' });
  +setValue(dayjs(), { changeImportance: 'accept' });
  ```

  :::success
  The `usePickerContext` also contain all the actions returned by `usePickerActionsContext`.
  The only difference is that `usePickerActionsContext` only contains variables with stable references that won't cause a re-render of your component.
  :::

- The component passed to the `toolbar` slot no longer receives the `rangePosition` and `onRangePositionChange` on range pickers, instead you can use the `usePickerRangePositionContext` hook:

  ```diff
  +import { usePickerRangePositionContext } from '@mui/x-date-pickers-pro/hooks';

  -const { rangePosition } = props;
  +const { rangePosition } = usePickerRangePositionContext();

  -const { onRangePositionChange } = props;
  +const { onRangePositionChange } = usePickerRangePositionContext();
  ```

### Slot: `tabs`

- The component passed to the `tabs` slot no longer receives the `view`, `views` and `onViewChange` props.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { view } = props;
  +const { view } = usePickerContext();

  -const { views } = props;
  +const { views } = usePickerContext();

  -const { onViewChange } = props;
  +const { onViewChange } = usePickerContext();
  ```

- The component passed to the `tabs` slot no longer receives the `rangePosition` and `onRangePositionChange` on range pickers, instead you can use the `usePickerRangePositionContext` hook:

  ```diff
  +import { usePickerRangePositionContext } from '@mui/x-date-pickers-pro/hooks';

  -const { rangePosition } = props;
  +const { rangePosition } = usePickerRangePositionContext();

  -const { onRangePositionChange } = props;
  +const { onRangePositionChange } = usePickerRangePositionContext();
  ```

### Slot: `actionBar`

- The component passed to the `actionBar` slot no longer receives the `onClear`, `onSetToday`, `onAccept` and `onCancel` props.
  You can use the `usePickerActionsContext` or the `usePickerContext` hooks instead:

  ```diff
  +import { usePickerActionsContext } from '@mui/x-date-pickers/hooks';

  -const { onClear } = props;
  +const { clearValue } = usePickerActionsContext();

  -const { onSetToday } = props;
  +const { setValueToToday } = usePickerActionsContext();

  -const { onAccept } = props;
  +const { acceptValueChanges } = usePickerActionsContext();

  -const { onCancel } = props;
  +const { cancelValueChanges } = usePickerActionsContext();
  ```

  :::success
  The `usePickerContext` also contain all the actions returned by `usePickerActionsContext`.
  The only difference is that `usePickerActionsContext` only contains variables with stable references that won't cause a re-render of your component.
  :::

### Slot: `shortcuts`

- The component passed to the `shortcuts` slot no longer receives the `isLandscape` prop.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { isLandscape } = props;
  +const { orientation } = usePickerContext();
  +const isLandscape = orientation === 'landscape';
  ```

- The component passed to the `shortcuts` slot no longer receives the `onChange` prop.
  You can use the `usePickerActionsContext` or the `usePickerContext` hooks instead:

  ```diff
  -const { onChange } = props;
  -onChange(dayjs(), 'accept', myShortcut);
  +const { setValue } = usePickerActionsContext();
  +setValue(dayjs(), { changeImportance: 'accept', shortcut: myShortcut });
  ```

  :::success
  The `usePickerContext` also contain all the actions returned by `usePickerActionsContext`.
  The only difference is that `usePickerActionsContext` only contains variables with stable references that won't cause a re-render of your component.
  :::

- The component passed to the `shortcuts` slot no longer receives the `isValid` prop.
  You can use the `useIsValidValue` hook instead:

  ```diff
  +import { useIsValidValue } from '@mui/x-date-pickers/hooks';

  -const { isValid } = props;
  -const isTodayValid = isValid(dayjs());
  +const isValidValue = useIsValidValue();
  +const isTodayValid = isValidValue(dayjs());
  ```

## Renamed variables and types

The following variables and types have been renamed to have a coherent `Picker` / `Pickers` prefix:

- `usePickersTranslations`

  ```diff
  -import { usePickersTranslations } from '@mui/x-date-pickers/hooks';
  -import { usePickersTranslations } from '@mui/x-date-pickers';
  -import { usePickersTranslations } from '@mui/x-date-pickers-pro';

  +import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
  +import { usePickerTranslations } from '@mui/x-date-pickers';
  +import { usePickerTranslations } from '@mui/x-date-pickers-pro';

  -const translations = usePickersTranslations();
  +const translations = usePickerTranslations();
  ```

- `usePickersContext`

  ```diff
  -import { usePickersContext } from '@mui/x-date-pickers/hooks';
  -import { usePickersContext } from '@mui/x-date-pickers';
  -import { usePickersContext } from '@mui/x-date-pickers-pro';

  +import { usePickerContext } from '@mui/x-date-pickers/hooks';
  +import { usePickerContext } from '@mui/x-date-pickers';
  +import { usePickerContext } from '@mui/x-date-pickers-pro';

  -const pickersContext = usePickersContext();
  +const pickerContext = usePickerContext();
  ```

- `FieldValueType`

  ```diff
  -import { FieldValueType } from '@mui/x-date-pickers/models';
  -import { FieldValueType } from '@mui/x-date-pickers';
  -import { FieldValueType } from '@mui/x-date-pickers-pro';

  +import { PickerValueType } from '@mui/x-date-pickers/models';
  +import { PickerValueType } from '@mui/x-date-pickers';
  +import { PickerValueType } from '@mui/x-date-pickers-pro';
  ```

- `RangeFieldSection`

  ```diff
  -import { RangeFieldSection } from '@mui/x-date-pickers-pro/models';
  -import { RangeFieldSection } from '@mui/x-date-pickers-pro';

  +import { FieldRangeSection } from '@mui/x-date-pickers-pro/models';
  +import { FieldRangeSection } from '@mui/x-date-pickers-pro';
  ```

- `PickerShortcutChangeImportance`

  ```diff
  -import { PickerShortcutChangeImportance } from '@mui/x-date-pickers/PickersShortcuts';
  -import { PickerShortcutChangeImportance } from '@mui/x-date-pickers';

  +import { PickerChangeImportance } from '@mui/x-date-pickers/models';
  +import { PickerChangeImportance } from '@mui/x-date-pickers';
  ```

## Hooks breaking changes

### `usePickerContext`

- The `onOpen` and `onClose` methods have been replaced with a single `setOpen` method.
  This method no longer takes an event, which was used to prevent the browser default behavior:

  ```diff
   const pickerContext = usePickerContext();

  -<button onClick={pickerContext.onOpen}>Open</button>
  +<button onClick={() => pickerContext.setOpen(true)}>Open</button>

  -<button onClick={pickerContext.onClose}>Close</button>
  +<button onClick={() => pickerContext.setOpen(false)}>Open</button>

  -<button
  -  onClick={(event) =>
  -    pickerContext.open ? pickerContext.onClose(event) : pickerContext.onOpen(event)
  -  }
  ->
  -  Toggle
  -</button>
  +<button onClick={() => pickerContext.setOpen(prev => !prev)}>Toggle</button>
  ```

  If you want to prevent the default behavior, you now have to do it manually:

  ```diff
     <div
     onKeyDown={(event) => {
       if (event.key === 'Escape') {
  -      pickerContext.onClose();
  +      event.preventDefault();
  +      pickerContext.setOpen(false);
       }
     }}
   />
  ```

## Typing breaking changes

### Do not pass the date object as a generic

The `TDate` generic has been removed from all the types, interfaces, and variables of the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages.

If you were passing your date object type as a generic to any element of one of those packages, you can remove it:

```diff
-<DatePicker<Dayjs> value={value} onChange={onChange} />
+<DatePicker value={value} onChange={onChange} />

-type FieldComponent = DatePickerSlots<Dayjs>['field'];
+type FieldComponent = DatePickerSlots['field'];

-function CustomDatePicker(props: DatePickerProps<Dayjs>) {}
+function CustomDatePicker(props: DatePickerProps) {}
```

### Do not pass the section type as a generic

The `TSection` generic of the `FieldRef` type has been replaced with the `TValue` generic:

```diff
-const fieldRef = React.useRef<FieldRef<FieldSection>>(null);
+const fieldRef = React.useRef<Dayjs | null>(null);

-const fieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);
+const fieldRef = React.useRef<DateRange<Dayjs>>(null);
```

### Removed types

The following types are no longer exported by `@mui/x-date-pickers` and/or `@mui/x-date-pickers-pro`.
If you were using them, you need to replace them with the following code:

- `NonEmptyDateRange`

  ```ts
  // When using AdapterDayjs
  import { Dayjs } from 'dayjs';
  type NonEmptyDateRange = [Dayjs, Dayjs];

  // When using AdapterLuxon
  import { DateTime } from 'luxon';
  type NonEmptyDateRange = [DateTime, DateTime];

  // When using AdapterMoment, AdapterMomentJalaali or AdapterMomentHijri
  import { Moment } from 'moment';
  type NonEmptyDateRange = [Moment, Moment];

  // When using AdapterDateFns, AdapterDateFnsV3, AdapterDateFnsJalali or AdapterDateFnsJalaliV3
  type NonEmptyDateRange = [Date, Date];
  ```

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

The `LicenseInfo` object is no longer exported from the `@mui/x-date-pickers-pro` package.
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
