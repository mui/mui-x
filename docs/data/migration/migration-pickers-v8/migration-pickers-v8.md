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

## Components breaking changes

### Day slot

The `PickersDay2` and `DateRangePickerDay2` components have been renamed to `PickerDay` and `DateRangePickerDay` respectively, replacing the old components.
They are now the default components for the `day` slot, so you no longer need to pass them to `slots`.

The `PickerDay` and `DateRangePickerDay` components now use `display: flex`.

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

- `day`, `notSelectedDate`, and `dayOutsideRangeInterval` have been removed.
- `rangeIntervalDayHighlight`, `rangeIntervalDayHighlightStart`, and `rangeIntervalDayHighlightEnd` have been removed. You can now use `selectionStart` and `selectionEnd` instead.
- `dayInsideRangeInterval` has been removed. You can now use `insideSelection` instead.

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

## Codemods

The following codemods can be used to automatically apply these changes to your codebase:

### `rename-field-ref`

Renames `unstable field refs` to stable ones.

```bash
npx @mui/x-codemod@next v9.0.0/pickers/rename-field-ref <path>
```

### `remove-picker-day-2`

Removes the unnecessary `slots={{ day: PickersDay2 }}` and `slots={{ day: DateRangePickerDay2 }}` usages.

```bash
npx @mui/x-codemod@next v9.0.0/pickers/remove-picker-day-2 <path>
```

### `rename-pickers-day`

Renames `PickersDay` to `PickerDay` and all related types and theme components.

```bash
npx @mui/x-codemod@next v9.0.0/pickers/rename-pickers-day <path>
```
