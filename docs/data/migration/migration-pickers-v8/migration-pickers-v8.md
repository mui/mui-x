---
title: Date Pickers - Migration from v8 to v9
productId: x-date-pickers
---

# Migration from v8 to v9

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v8 to v9.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-date-pickers` from v8 to v9.

## Start using the new release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-date-pickers": "8.x.x",
+"@mui/x-date-pickers": "next",

-"@mui/x-date-pickers-pro": "8.x.x",
+"@mui/x-date-pickers-pro": "next",
```

Since `v9` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from `v8` to `v9`.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v9. You can run `v9.0.0/pickers/preset-safe` targeting only Date and Time Pickers or `v9.0.0/preset-safe` to target the other packages as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #npm-tag-reference -->

```bash
# Date and Time Pickers specific
npx @mui/x-codemod@latest v9.0.0/pickers/preset-safe <path>

# Target the other packages as well
npx @mui/x-codemod@latest v9.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for pickers](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-pickers-v900) for more details.
:::

## Accessible DOM structure is now the default

The `enableAccessibleFieldDOMStructure` prop has been removed from all Picker and Field components.
The accessible DOM structure (section-based `PickersTextField`) introduced in v7 is now the only supported mode.
The legacy `<input>` based fallback is no longer available.

The `preset-safe` codemod will remove the prop from your code automatically—both as a direct prop and inside `slotProps.field`.

:::info
The codemod cannot handle cases where `enableAccessibleFieldDOMStructure` is passed via spread syntax or through a variable reference.
These cases must be updated manually:

```tsx
// Not handled by the codemod — remove enableAccessibleFieldDOMStructure manually
const fieldProps = { enableAccessibleFieldDOMStructure: false };
<DatePicker {...fieldProps} />;

const slotProps = { field: { enableAccessibleFieldDOMStructure: false } };
<DatePicker slotProps={slotProps} />;
```

:::

:::warning
**Action required if you used a custom `textField` slot with `enableAccessibleFieldDOMStructure={false}`**

If you were using `enableAccessibleFieldDOMStructure={false}` with a custom `textField` slot that renders a standard `<input />` element, your component will **crash at runtime** after upgrading.
The field now always uses the accessible DOM structure, which passes section-based props (like `elements` and `contentEditable`) that a plain `<input />` cannot handle.

You must update your custom `textField` slot to be compatible with `PickersTextField`, which renders a `PickersSectionList` internally.
See the [custom field documentation](/x/react-date-pickers/custom-field/) for implementation guidance.

If you were **not** using a custom `textField` slot, simply removing the prop is sufficient—no other changes are needed.
:::

```diff
-<DatePicker enableAccessibleFieldDOMStructure label="Start date" />
+<DatePicker label="Start date" />

-<DatePicker enableAccessibleFieldDOMStructure={false} slots={{ textField: CustomTextField }} />
 // CustomTextField must now be compatible with PickersTextField props
+<DatePicker slots={{ textField: CustomPickerTextField }} />
```

## Slots breaking changes

### Dialog slot

The `dialog` slot no longer receives the deprecated `TransitionComponent`, `TransitionProps`, and `PaperProps` props.
If you were passing a custom `dialog` slot, you need to update it to use `slots` and `slotProps` instead:

```diff
 function CustomDialog({
-  TransitionComponent,
-  TransitionProps,
-  PaperProps,
+  slots,
+  slotProps,
   ...props
 }) {
   // …your custom dialog implementation
 }

 <MobileDatePicker slots={{ dialog: CustomDialog }} />
```

## Fields breaking changes

### Renamed `fieldRef` props

The `unstableFieldRef`, `unstableStartFieldRef`, and `unstableEndFieldRef` props have been renamed to `fieldRef`, `startFieldRef`, and `endFieldRef` respectively.
For Picker components, `fieldRef` should now be passed through the `slotProps.field.fieldRef` prop.

```tsx
// Before
<DateField unstableFieldRef={fieldRef} />
<DatePicker slotProps={{ field: { unstableFieldRef: fieldRef } }} />

// After
<DateField fieldRef={fieldRef} />
<DatePicker slotProps={{ field: { fieldRef: fieldRef } }} />
```

:::info
For multi-input range pickers, `startFieldRef` and `endFieldRef` are available directly on the `MultiInputDateRangeField` component when used as a custom field slot.
:::

```tsx
const CustomField = (props: MultiInputDateRangeFieldProps<true>) => (
  <MultiInputDateRangeField
    {...props}
    startFieldRef={startFieldRef}
    endFieldRef={endFieldRef}
  />
);

<DateRangePicker slots={{ field: CustomField }} />;
```

### New `clearValue()` method on `FieldRef`

The `FieldRef` object now includes a `clearValue()` method to programmatically clear the field's value.

```tsx
const fieldRef = React.useRef<FieldRef<PickerValue>>(null);

// ...

<DateField fieldRef={fieldRef} />;

// ...

fieldRef.current?.clearValue();
```

### `textField` slot type change

The `textField` slot prop on Picker and Field components now only accepts `PickersTextFieldProps`.
It no longer accepts `TextFieldProps` from `@mui/material`.

## Components breaking changes

### Day slot

The `PickerDay2` and `DateRangePickerDay2` components have been renamed to `PickerDay` and `DateRangePickerDay` respectively, replacing the old components.
They are now the default components for the `day` slot, so you no longer need to pass them to `slots`.

The `PickerDay` and `DateRangePickerDay` components now use `display: flex`.

### Component structure change

The `PickerDay` and `DateRangePickerDay` components have been simplified and now use a single `ButtonBase` element.
Previously, they used multiple nested elements to render the selection and preview highlights.
These highlights are now rendered using `::before` and `::after` pseudo-elements on the root element.

This change might affect your custom styles if you were targeting the nested elements.
For example, in `DateRangePickerDay`, the `day` class has been removed as there is no longer a separate element for the day content.

### `DateRangePickerDay` selection behavior

The `isDaySelected` condition in `DateRangePickerDay` has been updated to also include individually selected days, not just days within a valid range.
Previously, a day was only considered "selected" (receiving the `.Mui-selected` class) if it was part of a fully defined and valid range.

Now, if a `DateRangePicker` has only one date selected (for example `[Jan 1st, null]`), that date will now visually appear as selected with the primary color circle, even if the range is not yet complete.
This makes the behavior more consistent with the single date picker (`PickerDay`).

This change might affect your custom CSS if you were targeting the `.Mui-selected` state of `DateRangePickerDay` and expected it to only be present for complete ranges.

### `disableMargin` prop removal

The `disableMargin` prop has been removed from `PickerDay` and `DateRangePickerDay` components.
In v8, `DateRangePickerDay` internally hardcoded `disableMargin={true}` on the `PickersDay` component.

In v9, by default, both components will now have horizontal margins.
If you want to remove the margins, you can use the `--PickerDay-horizontalMargin` CSS variable:

```tsx
<DatePicker
  slotProps={{
    day: { sx: { '--PickerDay-horizontalMargin': 0 } },
  }}
/>
```

### Renamed `PickersDay`

The `PickersDay` component has been renamed to `PickerDay` to be consistent with the other components.
The theme component name has also been updated from `MuiPickersDay` to `MuiPickerDay`.
All associated types and classes have been renamed as well (for example, `PickersDayProps` to `PickerDayProps`, `pickersDayClasses` to `pickerDayClasses`).

```tsx
// Before
import { PickersDay, pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
const theme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: { color: 'red' },
      },
    },
  },
});

// After
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';
const theme = createTheme({
  components: {
    MuiPickerDay: {
      styleOverrides: {
        root: { color: 'red' },
      },
    },
  },
});
```

### `DateRangePickerDay` classes

The `DateRangePickerDay` classes have been updated to be more consistent with the other components and to better describe their purpose.
Several keys have been removed from the `DateRangePickerDayClasses` interface.

- `day`, `notSelectedDate`, and `dayOutsideRangeInterval` have been removed.
- `rangeIntervalDayHighlight`, `rangeIntervalDayHighlightStart`, and `rangeIntervalDayHighlightEnd` have been removed. You can now use `selectionStart` and `selectionEnd` instead.
- `rangeIntervalDayPreview`, `rangeIntervalDayPreviewStart`, and `rangeIntervalDayPreviewEnd` have been removed. You can now use `previewStart` and `previewEnd` instead.
- `dayInsideRangeInterval` has been removed. You can now use `insideSelection` instead.
- `rangeIntervalPreview` has been removed. You can now use `insidePreviewing` instead.
- `outsideCurrentMonth` has been renamed to `dayOutsideMonth`.
- `hiddenDayFiller` and `hiddenDaySpacingFiller` have been renamed to `fillerCell`.
- `firstVisibleCell` and `lastVisibleCell` are now utility classes available on both `PickerDay` and `DateRangePickerDay` root elements.

If you have custom `styleOverrides` for these classes, you need to update them to use the new class names.

```tsx
// Before
const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        rangeIntervalDayHighlight: { backgroundColor: 'red' },
        dayInsideRangeInterval: { color: 'blue' },
      },
    },
  },
});

// After
const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        selectionStart: { backgroundColor: 'red' },
        selectionEnd: { backgroundColor: 'red' },
        insideSelection: { color: 'blue' },
      },
    },
  },
});
```

### `PickerDay` classes

Several keys have been removed from the `PickerDayClasses` interface:

- `dayWithMargin` and `dayWithoutMargin` have been removed.
- `hiddenDayFiller` and `hiddenDaySpacingFiller` have been renamed to `fillerCell`.
- `outsideCurrentMonth` has been renamed to `dayOutsideMonth`.

### `data-testid` changes

The `data-testid` attributes on several components have been updated, which may break your unit or integration tests if you are querying for these specific IDs.

- In `DateRangePickerDay`, the `data-testid="DateRangeHighlight"` attribute that was previously on a nested `<span>` has been moved to the root element.
  - When a day is highlighted, its `data-testid` will be `DateRangeHighlight` instead of `DateRangePickerDay`.
  - Tests querying for a nested button inside `DateRangeHighlight` will break as `DateRangePickerDay` is now a single element.
- The `DateRangePreview` test ID has been removed entirely.
- `PickerDay` (formerly `PickersDay`) now respects a custom `data-testid` prop if provided, falling back to its default value `"day"`.

## Removed types

### `UseDateManagerParameters` and `UseDateTimeManagerParameters`

The `UseDateManagerParameters` and `UseDateTimeManagerParameters` interfaces have been removed.
They only contained the `enableAccessibleFieldDOMStructure` prop, which has been removed in v9.
The `useDateManager` and `useDateTimeManager` hooks no longer accept any parameters.

```diff
-import { UseDateManagerParameters } from '@mui/x-date-pickers/managers';
-import { UseDateTimeManagerParameters } from '@mui/x-date-pickers/managers';
```

### `PickerManager` generic change

The `PickerManager` interface now has 4 type parameters instead of 5.
The `TEnableAccessibleFieldDOMStructure` type parameter has been removed.

```diff
-PickerManager<TValue, TError, TValidationProps, TEnableAccessibleFieldDOMStructure, TFieldInternalProps>
+PickerManager<TValue, TError, TValidationProps, TFieldInternalProps>
```

### Picker and Field component type parameters

All Picker and Field component prop types no longer have the `TEnableAccessibleFieldDOMStructure` generic parameter.
If you were passing this type parameter explicitly, remove it:

```diff
-type MyPickerProps = DatePickerProps<true>;
+type MyPickerProps = DatePickerProps;

-type MyFieldProps = DateFieldProps<true>;
+type MyFieldProps = DateFieldProps;
```

This applies to all Picker component prop types (`DatePickerProps`, `DateTimePickerProps`, `TimePickerProps`, `DateRangePickerProps`, etc.), all Field component prop types (`DateFieldProps`, `TimeFieldProps`, etc.), and their `Desktop`/`Mobile`/`Static` variants.

The field hooks also no longer accept this type parameter:

```diff
-const response = useDateField<true, typeof props>(props);
+const response = useDateField<typeof props>(props);
```

## Codemods

The following codemods can be used to automatically apply these changes to your codebase:

### `rename-picker-classes`

Renames `PickerDay` and `DateRangePickerDay` class keys.

```bash
npx @mui/x-codemod@latest v9.0.0/pickers/rename-picker-classes <path>
```

### `rename-field-ref`

Renames `unstable field refs` to stable ones.

```bash
npx @mui/x-codemod@latest v9.0.0/pickers/rename-field-ref <path>
```

### `rename-picker-day-2`

Renames `PickerDay2` and `DateRangePickerDay2` components and their related types/classes to `PickerDay` and `DateRangePickerDay`.
Also renames theme component names (`MuiPickerDay2` → `MuiPickerDay`, `MuiDateRangePickerDay2` → `MuiDateRangePickerDay`) in `createTheme` calls, string literals, and template literals.

```bash
npx @mui/x-codemod@latest v9.0.0/pickers/rename-picker-day-2 <path>
```

### `remove-picker-day-2`

Removes the unnecessary `slots={{ day: PickerDay2 }}` and `slots={{ day: DateRangePickerDay2 }}` usages.

:::info
The codemod also handles objects passed through variables (for example `const slots = { day: PickerDay2 }`).
In this case, it will remove the property from the object, but might leave the empty object and the `slots` prop on the component if they are now empty.
:::

```bash
npx @mui/x-codemod@latest v9.0.0/pickers/remove-picker-day-2 <path>
```

### `rename-pickers-day`

Renames `PickersDay` to `PickerDay` and all related types and theme components.

```bash
npx @mui/x-codemod@latest v9.0.0/pickers/rename-pickers-day <path>
```

### `remove-disable-margin`

Removes the `disableMargin` prop from `PickerDay` (and legacy `PickersDay`) components and replaces it with the `--PickerDay-horizontalMargin` CSS variable set to `0` via the `sx` prop.

```bash
npx @mui/x-codemod@latest v9.0.0/pickers/remove-disable-margin <path>
```
