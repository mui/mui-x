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

:::success
The amount of breaking changes is relatively large, but most of them might impact only a small portion of users, who are using advanced customization.

Changes that might impact such users are marked with a ⏩ emoji.
You can skip them and come back to them later if you experience any issues after the migration.
:::

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

## `@mui/material` peer dependency change

The `@mui/material` peer dependency has been updated to `^7.0.0` in an effort to smoothen the adoption of hybrid ESM and CJS support.
This change should resolve ESM and CJS interoperability issues in various environments.

:::info
The migration to `@mui/material` v7 should not cause too many issues as it has limited amount of breaking changes.

- [Upgrade](/material-ui/migration/upgrade-to-v6/) to `@mui/material` v6
- [Upgrade](/material-ui/migration/upgrade-to-v7/) to `@mui/material` v7

:::

## ✅ Rename `date-fns` adapter imports

:::warning
This codemod is not idempotent. Running it multiple times will rename the imports back and forth.

In example: usage of `AdapterDateFnsV3` would be replaced by `AdapterDateFns` and a subsequent run would rename it to `AdapterDateFnsV2`.
:::

- The `AdapterDateFns` and `AdapterDateFnsJalali` adapters have been renamed to `AdapterDateFnsV2` and `AdapterDateFnsJalaliV2` respectively.
  If you were using the old imports, you need to update them:

  ```diff
  -import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  -import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
  +import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
  +import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV2';
  ```

  Or consider updating the `date-fns` or `date-fns-jalali` package to the latest version and use the updated adapters.

- The `AdapterDateFnsV3` and `AdapterDateFnsJalaliV3` adapters have been renamed to `AdapterDateFns` and `AdapterDateFnsJalali` respectively.
  If you were using the old imports, you need to update them:

  ```diff
  -import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
  -import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV3';
  +import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  +import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
  ```

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

  Both components below respect the leading zeroes on digit sections:

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

  Both components below render a small size UI:

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
the `PickersTextField` component now receives these props and should keep working the same as before.

Both components below render a small size UI:

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
these props are now passed to the hidden `<input />` element.
:::

#### Migrate `slots.field`

If you are passing a custom field component to your pickers, you need to create a new one that is using the accessible DOM structure.
This new component needs to use the `PickersSectionList` component instead of an `<input />` HTML element.

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

### Clean the `ownerState`

The `ownerState` is an object describing the current state of a given component to let you do more advanced customization.
It is used in two different APIs:

1. In the theme's `styleOverrides`, the `ownerState` is passed to the function that returns the style:

```ts
const theme = createTheme({
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          /** Style based on the ownerState */
        }),
      },
    },
  },
});
```

2. In the `slotProps`, the `ownerState` is passed to the function that returns the custom props:

```tsx
<DatePicker
  slotProps={{
    actionBar: (ownerState) => ({
      /** Props based on the ownerState */
    }),
  }}
/>
```

Before version `v8.x`, the `ownerState` contained every prop of the component, plus some additional internal states if needed.
This presented a few problems:

- It was hard to know which ancestor defines the `ownerState` and therefore which props it contains (is the `actionBar` slot handled by `DatePicker`, by `DesktopDatePicker` or by `PickerLayout`?).

- Many properties of the `ownerState` were not intended for public use, which complicated the evolution of the codebase. All the props received by an internal component became part of the public API, and consequently, any changes to them would have resulted in a breaking change.

- Some properties that would have been useful for customizing a component were not present if the component was not using them by default. For example, if the built-in styles for the `actionBar` didn't need to know if the picker is disabled, then the `ownerState` of the `actionBar` didn't contain this information.

- The naming of the props made it difficult to understand which element they applied to. If the `ownerState` of the `monthButton` slot contained `disabled`, it was hard to establish whether the disabled state applied to the `monthButton` or the Picker itself.

To solve these issues, the `ownerState` has been reworked.
Every component's `ownerState` contains a shared set of properties describing the state of the picker it is in (`isPickerValueEmpty`, `isPickerOpen`, `isPickerDisabled`, `isPickerReadOnly`, `pickerVariant` and `pickerOrientation`).
Some component's `ownerState` contain additional properties describing their own state (`isMonthDisabled` for the month button, `toolbarOrientation` for the toolbar, `isDaySelected` for the day button, etc.).

:::success
Most of the properties needed to properly customize your component should be present in the `ownerState`.
If you need some property that is currently not included, please [open an issue](https://github.com/mui/mui-x/issues/new/choose) in the MUI X repository.
:::

### ⏩ Field editing on mobile Pickers

The field is now editable if rendered inside a mobile Picker.
Before version `v8.x`, if rendered inside a mobile Picker, the field was read-only, and clicking anywhere on it would open the Picker.
The mobile and desktop Pickers now behave similarly:

- clicking on the field allows editing the value with the keyboard
- clicking on the input adornment opens the Picker

:::success
If you prefer the old behavior, you can create a custom field that renders a read-only Text Field on mobile.
See [Custom field—Using a read-only Text Field on mobile](/x/react-date-pickers/custom-field/#using-a-read-only-text-field-on-mobile) to learn more.
:::

### ⏩ New default fields for the range pickers

The range pickers now use single input fields by default:

- Date Range Picker: `<SingleInputDateRangeField />` instead of `<MultiInputDateRangeField />`
- Time Range Picker: `<SingleInputTimeRangeField />` instead of `<MultiInputTimeRangeField />`
- Date Time Range Picker: `<SingleInputDateTimeRangeField />` instead of `<MultiInputDateTimeRangeField />`

You can manually pass the multi input fields to your picker if you prefer them:

```diff
 import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
+import { MultiInputDateRangePicker } from '@mui/x-date-pickers-pro/MultiInputDateRangePicker';

 <DateRangePicker
+  slots={{ field: MultiInputDateRangePicker }}
 />
```

If you were already using a single input field, you no longer need to manually pass it to the picker:

```diff
 import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
-import { SingleInputDateRangePicker } from '@mui/x-date-pickers-pro/SingleInputDateRangePicker';

 <DateRangePicker
-  slots={{ field: SingleInputDateRangePicker }}
 />
```

### ⏩ Month Calendar

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
  -    MuiPickersMonth: {
  +    MuiMonthCalendar: {
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

### ⏩ Year Calendar

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
  -    MuiPickersYear: {
  +    MuiYearCalendar: {
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

### ⏩ Treat partially filled date as `null` in `onChange`

Before version `v8.x`, entering a partially filled date in the field would fire `onChange` with an invalid date.
The date now remains `null` until fully filled.

Here are two concrete examples:

#### A user fills a Date Field that has no default value

1. The user enters the month, the rendered value is `01/DD/YYYY`, `onChange` is not fired.
2. The user enters the day, the rendered value is `01/01/YYYY`, `onChange` is not fired.
3. The user enters the year, the rendered value is `01/01/2025`, `onChange` is fired with the new date.

#### A user cleans the year of a Date Field and enters a new year

1. The user cleans the year, the rendered value is `01/01/YYYY`, `onChange` is fired with `null`.
2. The user enters a new year, the rendered value is `01/01/2026`, `onChange` is fired with the new date.

### ⏩ Deprecate the `disableOpenPicker` prop

The `disableOpenPicker` prop has been deprecated on all Picker components and will be removed in the next major release (v9.0.0).
If you only want to allow editing through the field, you can use the [field component](/x/react-date-pickers/fields/) directly:

```diff
-<DatePicker disableOpenPicker />
+<DateField />

-<TimePicker disableOpenPicker />
+<TimeField />

-<DateTimePicker disableOpenPicker />
+<DateTimeField />
```

```diff
-<DateRangePicker disableOpenPicker>
+<SingleInputDateRangeField> // If you want a single input for both dates.
+<MultiInputDateRangeField> // If you want one input for each date.

-<TimeRangePicker disableOpenPicker>
+<SingleInputTimeRangeField> // If you want a single input for both dates.
+<MultiInputTimeRangeField> // If you want one input for each date.

-<DateTimeRangePicker disableOpenPicker>
+<SingleInputDateTimeRangeField> // If you want a single input for both dates.
+<MultiInputDateTimeRangeField> // If you want one input for each date.
```

:::success
Using the field instead of the picker significantly decreases your bundle size since all the view components won't be bundled anymore.
:::

### ⏩ Update default `closeOnSelect` and Action Bar `actions` values

The default value of the `closeOnSelect` prop has been updated to `false` for all Picker components, except `<DesktopDatePicker />` and `<DesktopDateRangePicker />`, which still have `closeOnSelect` set to `true`.

This change goes hand in hand with the new default `actions` prop value for the `<PickersActionBar />` component.
The default value of the `actions` prop has been updated to `['cancel', 'accept']` for all Picker components, except `<DesktopDatePicker />` and `<DesktopDateRangePicker />`.

If the updated values do not fit your use case, you can [override them](/x/react-date-pickers/custom-components/#component-props).

## Slots breaking changes

### Slot: `field`

- The component passed to the `field` slot no longer receives `InputProps` and `inputProps` props.
  You now need to manually add the UI to open the picker using the `usePickerContext` hook:

  ```diff
   import { unstable_useDateField } from '@mui/x-date-pickers/DateField';
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

   function CustomField(props) {
  +  const pickerContext = usePickerContext();

     return (
      <TextField
        {...customProps}
  -      InputProps={props.InputProps}
  +      InputProps={{
  +        ref: pickerContext.triggerRef,
  +        endAdornment: (
  +          <InputAdornment position="end">
  +            <IconButton
  +              onClick={() => pickerContext.setOpen((prev) => !prev)}
  +              edge="end"
  +              aria-label={fieldResponse.openPickerAriaLabel}
  +            >
  +              <CalendarIcon />
  +            </IconButton>
  +          </InputAdornment>
  +        ),
  +      }}
      />
     );
   }
  ```

  If you are extracting the `ref` from `InputProps` to pass it to another trigger component, you can replace it with `pickerContext.triggerRef`:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

   function CustomField(props) {
  +  const pickerContext = usePickerContext();

     return (
      <button
        {...customProps}
  -      ref={props.InputProps?.ref}
  +      ref={pickerContext.triggerRef}
      >
        Open picker
      </button>
     );
   }
  ```

  If you are using a custom editing behavior, instead of using the `openPickerAriaLabel` property returned by the `useXXXField` hooks, you can generate it manually:

  ```diff
  +import { usePickerTranslations } from '@mui/x-date-pickers/hooks';

   function CustomField(props) {
  +  const translations = usePickerTranslations();
  +  const formattedValue = props.value?.isValid() ? value.format('ll') : null;
  +  const ariaLabel = translations.openDatePickerDialogue(formattedValue);

     return (
      <button
        {...customProps}
  -      ref={props.InputProps?.ref}
  +      ref={pickerContext.triggerRef}
  +      aria-label={ariaLabel}
      >
        Open picker
      </button>
     );
   }
  ```

- The component passed to the `field` slot no longer receives the `value`, `onChange`, `timezone`, `format`, `disabled`, `className`, `sx`, `label`, `name`, `autoFocus`, `focused` and `readOnly` props.
  You can use the `usePickerContext` hook instead:

  ```diff
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const { value } = props;
  -const { value } = props;
  +const { value } = usePickerContext();

  -const { onChange } = props;
  -onChange(dayjs(), { validationError: null });
  +const { setValue } = usePickerContext();
  -setValue(dayjs(), { validationError: null });

  -const { timezone } = props;
  +const { timezone } = usePickerContext();

  -const { format } = props;
  +const { fieldFormat } = usePickerContext();

  -const { disabled } = props;
  +const { disabled } = usePickerContext();

  -const { className } = props;
  +const { rootClassName } = usePickerContext();

  -const { sx } = props;
  +const { rootSx } = usePickerContext();

  -const { label } = props;
  +const { label } = usePickerContext();

  -const { name } = props;
  +const { name } = usePickerContext();

  -const { autoFocus } = props;
  +const { autoFocus: pickerAutoFocus, open } = usePickerContext();
  +const autoFocus = pickerAutoFocus && !open,

  -const { focused } = props;
  +const { open } = usePickerContext();
  +const focused = open ? true : undefined;

  -const { readOnly } = props;
  +const { readOnly } = usePickerContext();
  ```

  :::success
  If you are using a hook like `useDateField`, you don't have to do anything, the values from the context are automatically applied.
  :::

- The component passed to the `field` slot no longer receives a `ref`.
  You can use the `usePickerContext` hook instead:

  ```tsx
  +import { usePickerContext } from '@mui/x-date-pickers/hooks';

  -const CustomField = React.forwardRef(function CustomField(props, ref) {
  -  return <input ref={ref} />;
  -})
  +function CustomField(props) {
  +  const { rootRef } = usePickerContext();
  +  return <input ref={rootRef} />;
  +}
  ```

- The component passed to the `field` slot no longer receives the `formatDensity`, `enableAccessibleFieldDOMStructure`, `selectedSections`, `onSelectedSectionsChange` and `inputRef` props.
  These props, formerly mirroring the picker's props, are no longer exposed.
  You can manually pass them using `slotProps.field` to keep the same behavior:

  ```diff
   <DatePicker
     enableAccessibleFieldDOMStructure={false}
     formatDensity='spacious'
     selectedSections={selectedSections}
     onSelectedSectionsChange={onSelectedSectionsChange}
     inputRef={inputRef}
  +  slotProps={{
       field: {
         enableAccessibleFieldDOMStructure: false,
         formatDensity: 'spacious',
         selectedSections,
         onSelectedSectionsChange,
         inputRef,
       },
     }}
   />
  ```

  If you were not passing those props to the picker, then you can use their default values:

  - `formatDensity`: `"dense"`
  - `enableAccessibleFieldDOMStructure`: `true`
  - `selectedSections`: `undefined`
  - `onSelectedSectionsChange`: `undefined`
  - `inputRef`: `undefined`

  :::success
  If you are using a hook like `useDateField`, you don't have to do anything, the value from the context are automatically applied.
  :::

### Slot: `inputAdornment`

- The `position` props passed to the `inputAdornment` slot props no longer sets the position of the opening button.
  This allows defining the position of the opening and clear buttons independently.
  You can use the `openPickerButtonPosition` prop instead:

  ```diff
   <DatePicker
     slotProps={{
  -    inputAdornment: { position: 'start' },
  +    field: { openPickerButtonPosition: 'start' },
     }}
   />
  ```

### ⏩ Slot: `layout`

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
  -onViewChange('month');
  +const { setView } = usePickerContext();
  +setView('month');
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
   // opening it and calling `acceptValueChanges` without any change calls `onAccept`
   // with the default value.
   // Whereas before, opening it and calling `onDimiss` without any change
   // did not call `onAccept`.
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
  -onRangePositionChange('start');
  +const { setRangePosition } = usePickerRangePositionContext();
  +setRangePosition('start');
  ```

### ⏩ Slot: `toolbar`

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
  -onRangePositionChange('start');
  +const { setRangePosition } = usePickerRangePositionContext();
  +setRangePosition('start');
  ```

### ⏩ Slot: `tabs`

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
  -onRangePositionChange('start');
  +const { setRangePosition } = usePickerRangePositionContext();
  +setRangePosition('start');
  ```

### ⏩ Slot: `actionBar`

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

### ⏩ Slot: `shortcuts`

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

## ✅ Renamed variables and types

The following variables and types have been renamed to have a coherent `Picker` / `Pickers` prefix:

- ✅ `usePickersTranslations`

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

- ✅ `usePickersContext`

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

- ✅ `FieldValueType`

  ```diff
  -import { FieldValueType } from '@mui/x-date-pickers/models';
  -import { FieldValueType } from '@mui/x-date-pickers';
  -import { FieldValueType } from '@mui/x-date-pickers-pro';

  +import { PickerValueType } from '@mui/x-date-pickers/models';
  +import { PickerValueType } from '@mui/x-date-pickers';
  +import { PickerValueType } from '@mui/x-date-pickers-pro';
  ```

- ✅ `RangeFieldSection`

  ```diff
  -import { RangeFieldSection } from '@mui/x-date-pickers-pro/models';
  -import { RangeFieldSection } from '@mui/x-date-pickers-pro';

  +import { FieldRangeSection } from '@mui/x-date-pickers-pro/models';
  +import { FieldRangeSection } from '@mui/x-date-pickers-pro';
  ```

- ✅ `PickerShortcutChangeImportance`

  ```diff
  -import { PickerShortcutChangeImportance } from '@mui/x-date-pickers/PickersShortcuts';
  -import { PickerShortcutChangeImportance } from '@mui/x-date-pickers';
  -import { PickerShortcutChangeImportance } from '@mui/x-date-pickers-pro';

  +import { PickerChangeImportance } from '@mui/x-date-pickers/models';
  +import { PickerChangeImportance } from '@mui/x-date-pickers';
  +import { PickerChangeImportance } from '@mui/x-date-pickers-pro';
  ```

## ⏩ Hooks breaking changes

### ⏩ `useMultiInputDateRangeField`

This hook has been removed in favor of the new `useMultiInputRangeField` hook with an improved DX:

```diff
 import useSlotProps from '@mui/utils/useSlotProps';
-import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
+import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
+import { unstable_useMultiInputRangeField as useMultiInputRangeField } from '@mui/x-date-pickers-pro/hooks';
 import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';

 const DateRangeField(props) {
   const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
   const { slotProps, slots } = forwardedProps;

   const startTextFieldProps = useSlotProps({
     elementType: 'input',
     externalSlotProps: slotProps?.textField,
     ownerState: { ...props, position: 'start' },
   });

   const endTextFieldProps = useSlotProps({
     elementType: 'input',
     externalSlotProps: slotProps?.textField,
     ownerState: { ...props, position: 'end' },
   });

-  const fieldResponse = useMultiInputDateRangeField({
-     sharedProps: internalProps,
-     startTextFieldProps,
-     endTextFieldProps,
-     unstableStartFieldRef: internalProps.unstableStartFieldRef,
-     unstableEndFieldRef: internalProps.unstableEndFieldRef,
-   });

+   const manager = useDateRangeManager(props);
+   const fieldResponse = useMultiInputRangeField({
+     manager,
+     internalProps,
+     startForwardedProps: startTextFieldProps,
+     endForwardedProps: endTextFieldProps,
+   });

   return ( /** Your UI */ )
 }
```

:::success
The associated types have also been removed. [Learn how to migrate them](/x/migration/migration-pickers-v7/#removed-types).
:::

### ⏩ `useMultiInputTimeRangeField`

This hook has been removed in favor of the new `useMultiInputRangeField` hook with an improved DX:

```diff
 import useSlotProps from '@mui/utils/useSlotProps';
-import { unstable_useMultiInputTimeRangeField as useMultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
+import { useTimeRangeManager } from '@mui/x-date-pickers-pro/managers';
+import { unstable_useMultiInputRangeField as useMultiInputRangeField } from '@mui/x-date-pickers-pro/hooks';
 import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';

 const DateRangeField(props) {
   const { internalProps, forwardedProps } = useSplitFieldProps(props, 'time');
   const { slotProps, slots } = forwardedProps;

   const startTextFieldProps = useSlotProps({
     elementType: 'input',
     externalSlotProps: slotProps?.textField,
     ownerState: { ...props, position: 'start' },
   });

   const endTextFieldProps = useSlotProps({
     elementType: 'input',
     externalSlotProps: slotProps?.textField,
     ownerState: { ...props, position: 'end' },
   });


-  const fieldResponse = useMultiInputTimeRangeField({
-     sharedProps: internalProps,
-     startTextFieldProps,
-     endTextFieldProps,
-     unstableStartFieldRef: internalProps.unstableStartFieldRef,
-     unstableEndFieldRef: internalProps.unstableEndFieldRef,
-   });

+   const manager = useTimeRangeManager(props);
+   const fieldResponse = useMultiInputRangeField({
+     manager,
+     internalProps,
+     startForwardedProps: startTextFieldProps,
+     endForwardedProps: endTextFieldProps,
+   });

   return ( /** Your UI */ )
 }
```

:::success
The associated types have also been removed. [Learn how to migrate them](/x/migration/migration-pickers-v7/#removed-types).
:::

### ⏩ `useMultiInputDateTimeRangeField`

This hook has been removed in favor of the new `useMultiInputRangeField` hook with an improved DX:

```diff
 import useSlotProps from '@mui/utils/useSlotProps';
-import { unstable_useMultiInputDateTimeRangeField as useMultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
+import { useDateTimeRangeManager } from '@mui/x-date-pickers-pro/managers';
+import { unstable_useMultiInputRangeField as useMultiInputRangeField } from '@mui/x-date-pickers-pro/hooks';
 import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';

 const DateRangeField(props) {
   const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date-time');
   const { slotProps, slots } = forwardedProps;

   const startTextFieldProps = useSlotProps({
     elementType: 'input',
     externalSlotProps: slotProps?.textField,
     ownerState: { ...props, position: 'start' },
   });

   const endTextFieldProps = useSlotProps({
     elementType: 'input',
     externalSlotProps: slotProps?.textField,
     ownerState: { ...props, position: 'end' },
   });


-  const fieldResponse = useMultiInputDateTimeRangeField({
-     sharedProps: internalProps,
-     startTextFieldProps,
-     endTextFieldProps,
-     unstableStartFieldRef: internalProps.unstableStartFieldRef,
-     unstableEndFieldRef: internalProps.unstableEndFieldRef,
-   });

+   const manager = useDateTimeRangeManager(props);
+   const fieldResponse = useMultiInputRangeField({
+     manager,
+     internalProps,
+     startForwardedProps: startTextFieldProps,
+     endForwardedProps: endTextFieldProps,
+   });

   return ( /** Your UI */ )
 }
```

:::success
The associated types have also been removed. [Learn how to migrate them](/x/migration/migration-pickers-v7/#removed-types).
:::

### ⏩ `usePickerContext`

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

### ⏩ `useClearableField`

This hook has been removed. The custom field component now receives the `clearable` and `onClear` props.

You can remove the `useClearableField` hook from your component and use the new props to conditionally render the clear button:

```diff
-import { useClearableField } from '@mui/x-date-pickers-pro/hooks';

 function CustomField(props) {
   const {
     id,
     label
     value,
+    clearable,
+    onClear,
   } = props;
-  const processedFieldProps = useClearableField({
-    ...fieldResponse,
-    slots,
-    slotProps,
-  });
+  {clearable && value && (
+    <IconButton title="Clear" tabIndex={-1} onClick={onClear}>
+      <ClearIcon />
+    </IconButton>
+  )}
 }
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

### ⏩ Removed types

The following types are no longer exported by `@mui/x-date-pickers` and/or `@mui/x-date-pickers-pro`.

:::success
If you were using them, you can replace them with the examples below.

However, consider looking into your usage to see if you really need those types.
:::

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

- `UseDateRangeFieldProps`

  ```ts
  import { DateRangeManagerFieldInternalProps } from '@mui/x-date-pickers-pro/managers';

  interface UseDateRangeFieldProps<
    TEnableAccessibleFieldDOMStructure extends boolean,
  > extends Omit<
      DateRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
      'unstableFieldRef'
    > {}
  ```

- `UseMultiInputDateRangeFieldProps`

  ```ts
  import { DateRangeManagerFieldInternalProps } from '@mui/x-date-pickers-pro/managers';
  import { MultiInputFieldRefs } from '@mui/x-date-pickers-pro/models';

  interface UseMultiInputDateRangeFieldProps<
    TEnableAccessibleFieldDOMStructure extends boolean,
  > extends DateRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
      MultiInputFieldRefs {}
  ```

- `UseMultiInputDateRangeFieldComponentProps`

  ```ts
  import { DateRangeManagerFieldInternalProps } from '@mui/x-date-pickers-pro/managers';
  import { MultiInputFieldRefs } from '@mui/x-date-pickers-pro/models';

  type UseMultiInputDateRangeFieldComponentProps<
    TEnableAccessibleFieldDOMStructure extends boolean,
    TChildProps extends {},
  > = Omit<
    TChildProps,
    | keyof DateRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>
    | keyof MultiInputFieldRefs
  > &
    DateRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure> &
    MultiInputFieldRefs;
  ```

- `UseMultiInputTimeRangeFieldProps`

  ```ts
  import { TimeRangeManagerFieldInternalProps } from '@mui/x-date-pickers-pro/managers';
  import { MultiInputFieldRefs } from '@mui/x-date-pickers-pro/models';

  interface UseMultiInputTimeRangeFieldProps<
    TEnableAccessibleFieldDOMStructure extends boolean,
  > extends TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
      MultiInputFieldRefs {}
  ```

- `UseMultiInputTimeRangeFieldComponentProps`

  ```ts
  import { TimeRangeManagerFieldInternalProps } from '@mui/x-date-pickers-pro/managers';
  import { MultiInputFieldRefs } from '@mui/x-date-pickers-pro/models';

  type UseMultiInputTimeRangeFieldComponentProps<
    TEnableAccessibleFieldDOMStructure extends boolean,
    TChildProps extends {},
  > = Omit<
    TChildProps,
    | keyof TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>
    | keyof MultiInputFieldRefs
  > &
    TimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure> &
    MultiInputFieldRefs;
  ```

- `UseMultiInputDateTimeRangeFieldProps`

  ```ts
  import { DateTimeRangeManagerFieldInternalProps } from '@mui/x-date-pickers-pro/managers';
  import { MultiInputFieldRefs } from '@mui/x-date-pickers-pro/models';

  interface UseMultiInputDateTimeRangeFieldProps<
    TEnableAccessibleFieldDOMStructure extends boolean,
  > extends DateTimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
      MultiInputFieldRefs {}
  ```

- `UseMultiInputDateTimeRangeFieldComponentProps`

  ```ts
  import { DateTimeRangeManagerFieldInternalProps } from '@mui/x-date-pickers-pro/managers';
  import { MultiInputFieldRefs } from '@mui/x-date-pickers-pro/models';

  type UseMultiInputDateTimeRangeFieldComponentProps<
    TEnableAccessibleFieldDOMStructure extends boolean,
    TChildProps extends {},
  > = Omit<
    TChildProps,
    | keyof DateTimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>
    | keyof MultiInputFieldRefs
  > &
    DateTimeRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure> &
    MultiInputFieldRefs;
  ```

- `MultiInputRangeFieldClasses`

  ```ts
  // If you were using MultiInputRangeFieldClasses for a date range field.
  import { MultiInputDateRangeFieldClasses } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

  // If you were using MultiInputRangeFieldClasses for a time range field.
  import { MultiInputTimeRangeFieldClasses } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';

  // If you were using MultiInputRangeFieldClasses for a date time range field.
  import { MultiInputDateTimeRangeFieldClasses } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
  ```

- `MultiInputRangeFieldClassKey`

  ```ts
  // If you were using MultiInputRangeFieldClassKey for a date range field.
  import { MultiInputRangeFieldClassKey } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

  // If you were using MultiInputRangeFieldClassKey for a time range field.
  import { MultiInputRangeFieldClassKey } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';

  // If you were using MultiInputRangeFieldClassKey for a date time range field.
  import { MultiInputRangeFieldClassKey } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
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
    +     DateRangePickerFieldProps,
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
    +     DateTimeRangePickerFieldProps,
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

- `ExportedUseClearableFieldProps`

  ```ts
  interface ExportedUseClearableFieldProps {
    clearable?: boolean;
    onClear?: React.MouseEventHandler;
  }
  ```

- `UseClearableFieldSlots`

  ```ts
  interface UseClearableFieldSlots {
    clearIcon?: React.ElementType;
    clearButton?: React.ElementType;
  }
  ```

- `UseClearableFieldSlotProps`

  ```ts
  import { SlotComponentProps } from '@mui/utils';
  import { FieldOwnerState } from '@mui/x-date-pickers/models';
  import { ClearIcon } from '@mui/x-date-pickers/icons';
  import IconButton from '@mui/material/IconButton';

  interface UseClearableFieldSlotProps {
    clearIcon?: SlotComponentProps<typeof ClearIcon, {}, FieldOwnerState>;
    clearButton?: SlotComponentProps<typeof IconButton, {}, FieldOwnerState>;
  }
  ```

- `UseClearableFieldResponse`

  ```ts
  type UseClearableFieldResponse<TFieldProps extends {}> = Omit<
    TFieldProps,
    'clearable' | 'onClear' | 'slots' | 'slotProps'
  >;
  ```

## Theme breaking change

### ⏩ `MuiPickersPopper`

The theme entry have been renamed to have a coherent `Picker` / `Pickers` prefix:

```diff
 const theme = createTheme({
   components: {
-    MuiPickersPopper: {
+    MuiPickerPopper: {
       styleOverrides: {},
     },
   },
 });
```

The props that can be overridden have also been limited to the one that did not cause any bugs:

```tsx
const theme = createTheme({
  components: {
    MuiPickerPopper: {
      defaultProps: {
        // Those are now the props with support for theme default props
        position: "bottom"
        classes: { root: "custom-root-class}
      },
    },
  },
});
```

## ⏩ Stop using `LicenseInfo` from `@mui/x-date-pickers-pro`

The `LicenseInfo` object is no longer exported from the `@mui/x-date-pickers-pro` package.
You can import it from `@mui/x-license` instead:

```diff
-import { LicenseInfo } from '@mui/x-date-pickers-pro';
+import { LicenseInfo } from '@mui/x-license';

 LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

## ⏩ Stop passing `utils` and the date object to some translation keys

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

## ⏩ Remove unused adapter formats

The following unused formats have been removed from the adapters and can no longer be overridden via the `dateFormats` prop on the `<LocalizationProvider />` component:

- `fullTime` - please use `fullTime12h` and `fullTime24h` instead:
  ```diff
    <LocalizationProvider
      dateFormats={{
  -     fullTime: 'LT',
  +     fullTime12h: 'hh:mm A',
  +     fullTime24h: 'hh:mm',
      }}
    >
  ```
- `keyboardDateTime` - please use `keyboardDateTime12h` and `keyboardDateTime24h` instead:
  ```diff
    <LocalizationProvider
      dateFormats={{
  -     keyboardDateTime: 'DD.MM.YYYY | LT',
  +     keyboardDateTime12h: 'DD.MM.YYYY | hh:mm A',
  +     keyboardDateTime24h: 'DD.MM.YYYY | hh:mm',
      }}
    >
  ```
