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

The `PickerDay2` and `DateRangePickerDay2` components have been renamed to `PickersDay` and `DateRangePickerDay` respectively, replacing the old components.
They are now the default components for the `day` slot, so you no longer need to pass them to `slots`.

The `PickersDay` and `DateRangePickerDay` components now use `display: flex`.

## Codemods

The following codemods can be used to automatically apply these changes to your codebase:

### `rename-field-ref`

Renames `unstable field refs` to stable ones.

```bash
npx @mui/x-codemod@next v9.0.0/pickers/rename-field-ref <path>
```

### `remove-picker-day-2`

Removes the unnecessary `slots={{ day: PickerDay2 }}` and `slots={{ day: DateRangePickerDay2 }}` usages.

```bash
npx @mui/x-codemod@next v9.0.0/pickers/remove-picker-day-2 <path>
```
