# Migration from v8 to v9

This guide describes the changes between MUI X Pickers v8 and v9.

## Fields

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

## Codemod

The `rename-field-ref` codemod can be used to automatically apply these changes to your codebase.

```bash
npx @mui/x-codemod@latest v9.0.0/pickers/rename-field-ref <path>
```
