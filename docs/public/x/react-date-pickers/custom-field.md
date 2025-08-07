---
productId: x-date-pickers
title: Date and Time Pickers - Custom field
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers'
components: PickersSectionList, PickersTextField
---

# Custom field

The Date and Time Pickers let you customize the field by passing props or custom components.

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Customize the default field

### Customize the `TextField`

You can use the `textField` slot to pass custom props to the `TextField`:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function TextFieldSlotProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
        <DatePicker
          label="Small picker"
          slotProps={{ textField: { size: 'small' } }}
        />
        <DatePicker
          label="Picker with helper text"
          slotProps={{ textField: { helperText: 'Please fill this field' } }}
        />
        <DatePicker
          label="Filled picker"
          slotProps={{ textField: { variant: 'filled' } }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Change the separator of range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

You can use the `dateSeparator` prop to change the separator rendered between the start and end dates:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

export default function RangeFieldDateSeparator() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
        <DateRangePicker slotProps={{ field: { dateSeparator: 'to' } }} />
        <DateRangePicker
          slotProps={{ field: { dateSeparator: 'to' } }}
          slots={{ field: MultiInputDateRangeField }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Change the format density

You can control the field format spacing using the `formatDensity` prop.
Setting `formatDensity` to `"spacious"` adds space before and after each `/`, `-` and `.` character.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function FieldFormatDensity() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DateField', 'DateField']}>
        <DateField defaultValue={dayjs('2022-04-17')} />
        <DateField defaultValue={dayjs('2022-04-17')} formatDensity="dense" />
        <DateField defaultValue={dayjs('2022-04-17')} formatDensity="spacious" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Multi input range field [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

### Usage inside a range picker

You can pass the multi input fields to the range picker to use it for keyboard editing:

```tsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function MultiInputDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputDateRangeField']}>
        <DateRangePicker slots={{ field: MultiInputDateRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

If you want to create a wrapper around the field, make sure to set the `fieldType` static property to `'multi-input'`.
Otherwise, the picker will throw an error because it won't know how to adapt to this custom field:

```tsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  MultiInputDateRangeField,
  MultiInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

function WrappedMultiInputDateRangeField(
  props: MultiInputDateRangeFieldProps<true>,
) {
  return <MultiInputDateRangeField spacing={4} {...props} />;
}

WrappedMultiInputDateRangeField.fieldType = 'multi-input';

export default function MultiInputDateRangePickerWrapped() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['MultiInputDateRangeField']}>
        <DateRangePicker slots={{ field: WrappedMultiInputDateRangeField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Customize the `start` and `end` fields differently

You can pass conditional props to the `textField` slot to customize the input styling based on the `position`.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { FieldOwnerState } from '@mui/x-date-pickers/models';

export default function MultiInputFieldTextFieldProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['MultiInputDateRangeField', 'MultiInputDateRangeField']}
      >
        <MultiInputDateRangeField
          slotProps={{
            textField: ({ position }) => ({
              color: position === 'start' ? 'success' : 'warning',
              focused: true,
            }),
          }}
          defaultValue={[dayjs('2022-04-17'), null]}
        />
        <DateRangePicker
          slotProps={{
            textField: ({
              position,
            }: FieldOwnerState & { position?: 'start' | 'end' }) => ({
              color: position === 'start' ? 'success' : 'warning',
              focused: true,
            }),
          }}
          slots={{ field: MultiInputDateRangeField }}
          defaultValue={[dayjs('2022-04-17'), null]}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Customize the separator

You can use the `separator` slot to pass custom props to the `Typography` rendered between the two Text Fields:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

export default function MultiInputFieldSeparatorSlotProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
        <MultiInputDateRangeField
          slotProps={{ separator: { sx: { opacity: 0.5 } } }}
        />
        <DateRangePicker
          slotProps={{
            field: { slotProps: { separator: { sx: { opacity: 0.5 } } } } as any,
          }}
          slots={{ field: MultiInputDateRangeField }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::success
When used inside a picker, the `separator` slot is not available directly and must be accessed using `slotProps.field.slotProps.separator`.
:::

## With Material UI

### Wrapping `PickersTextField`

You can import the `PickersTextField` component to create custom wrappers:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersTextField,
  PickersTextFieldProps,
} from '@mui/x-date-pickers/PickersTextField';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const MyPickersTextField = React.forwardRef(
  (props: PickersTextFieldProps, ref: React.Ref<HTMLDivElement>) => (
    <PickersTextField {...props} ref={ref} size="small" />
  ),
);

export default function MaterialV7FieldWrapped() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DateField slots={{ textField: MyPickersTextField }} />
        <DatePicker slots={{ textField: MyPickersTextField }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::success
This approach is only recommended if you need complex customizations on your `PickersTextField`.

If you just need to set some default props, you can use [the `slotProps` prop](/x/react-date-pickers/custom-field/#customize-the-textfield).
:::

### Using Material `TextField`

Pass the `enableAccessibleFieldDOMStructure={false}` to any Field or Picker component to use an `<input />` for the editing instead of the new accessible DOM structure:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MaterialV6Field() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DatePicker']}>
        <DateField enableAccessibleFieldDOMStructure={false} />
        <DatePicker enableAccessibleFieldDOMStructure={false} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

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

```tsx
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { styled } from '@mui/material/styles';
import { CalendarIcon, ClearIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DatePicker,
  DatePickerFieldProps,
  DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
import { usePickerContext } from '@mui/x-date-pickers/hooks';

const BrowserFieldRoot = styled('div', { name: 'BrowserField', slot: 'Root' })({
  display: 'flex',
  alignItems: 'center',
  '& .MuiInputAdornment-root': {
    height: 'auto',
  },
});

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    whiteSpace: 'nowrap',
  },
);

const BrowserIconButton = styled('button', {
  name: 'BrowserField',
  slot: 'IconButton',
})({
  backgroundColor: 'transparent',
  border: 0,
  cursor: 'pointer',
  '&:hover, &:focus': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

function BrowserDateField(props: DatePickerFieldProps) {
  const fieldResponse = useDateField<true, typeof props>(props);

  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,

    // Should be passed to the PickersSectionList component
    elements,
    sectionListRef,
    contentEditable,
    onFocus,
    onBlur,
    tabIndex,
    onInput,
    onPaste,
    onKeyDown,

    // Should be passed to the button that opens the picker
    openPickerAriaLabel,

    // Can be passed to a hidden <input /> element
    onChange,
    value,

    // Can be passed to the button that clears the value
    onClear,
    clearable,

    // Can be used to style the component
    areAllSectionsEmpty,
    disabled,
    readOnly,
    focused,
    error,

    // The rest can be passed to the root element
    ...other
  } = fieldResponse;

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);

  return (
    <BrowserFieldRoot {...other} ref={handleRef}>
      <BrowserFieldContent>
        <PickersSectionList
          elements={elements}
          sectionListRef={sectionListRef}
          contentEditable={contentEditable}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
          onInput={onInput}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
        />
      </BrowserFieldContent>
      {clearable && value && (
        <BrowserIconButton
          type="button"
          title="Clear"
          tabIndex={-1}
          onClick={onClear}
          sx={{ marginLeft: 1 }}
        >
          <ClearIcon fontSize="small" />
        </BrowserIconButton>
      )}
      <BrowserIconButton
        onClick={() => pickerContext.setOpen((prev) => !prev)}
        sx={{ marginLeft: 1 }}
        aria-label={openPickerAriaLabel}
      >
        <CalendarIcon />
      </BrowserIconButton>
    </BrowserFieldRoot>
  );
}

function BrowserDatePicker(props: DatePickerProps) {
  return (
    <DatePicker {...props} slots={{ field: BrowserDateField, ...props.slots }} />
  );
}

export default function BrowserV7Field() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDatePicker
        slotProps={{
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  );
}

```

```tsx
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { styled } from '@mui/material/styles';
import { ClearIcon, DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';

const BrowserFieldRoot = styled('div', { name: 'BrowserField', slot: 'Root' })({
  display: 'flex',
  alignItems: 'center',
  '& .MuiInputAdornment-root': {
    height: 'auto',
  },
});

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    whiteSpace: 'nowrap',
  },
);

const BrowserIconButton = styled('button', {
  name: 'BrowserField',
  slot: 'IconButton',
})({
  backgroundColor: 'transparent',
  border: 0,
  cursor: 'pointer',
  '&:hover, &:focus': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

interface BrowserSingleInputDateRangeFieldProps extends DateRangePickerFieldProps {}

function BrowserSingleInputDateRangeField(
  props: BrowserSingleInputDateRangeFieldProps,
) {
  const fieldResponse = useSingleInputDateRangeField<true, typeof props>(props);

  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,

    // Should be passed to the PickersSectionList component
    elements,
    sectionListRef,
    contentEditable,
    onFocus,
    onBlur,
    tabIndex,
    onInput,
    onPaste,
    onKeyDown,

    // Should be passed to the button that opens the picker
    openPickerAriaLabel,

    // Can be passed to a hidden <input /> element
    onChange,
    value,

    // Can be passed to the button that clears the value
    onClear,
    clearable,

    // Can be used to style the component
    areAllSectionsEmpty,
    disabled,
    readOnly,
    focused,
    error,

    // The rest can be passed to the root element
    ...other
  } = fieldResponse;

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);

  return (
    <BrowserFieldRoot
      {...other}
      ref={handleRef}
      style={{
        minWidth: 300,
      }}
    >
      <BrowserFieldContent>
        <PickersSectionList
          elements={elements}
          sectionListRef={sectionListRef}
          contentEditable={contentEditable}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
          onInput={onInput}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
        />
      </BrowserFieldContent>
      {clearable && value && (
        <BrowserIconButton
          type="button"
          title="Clear"
          tabIndex={-1}
          onClick={onClear}
          sx={{ marginLeft: 1 }}
        >
          <ClearIcon fontSize="small" />
        </BrowserIconButton>
      )}
      <BrowserIconButton
        onClick={() => pickerContext.setOpen((prev) => !prev)}
        aria-label={openPickerAriaLabel}
        sx={{ marginLeft: 1 }}
      >
        <DateRangeIcon />
      </BrowserIconButton>
    </BrowserFieldRoot>
  );
}

BrowserSingleInputDateRangeField.fieldType = 'single-input';

function BrowserSingleInputDateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePicker
      {...props}
      slots={{ ...props.slots, field: BrowserSingleInputDateRangeField }}
    />
  );
}

export default function BrowserV7SingleInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserSingleInputDateRangePicker
        slotProps={{
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  );
}

```

```tsx
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import {
  unstable_useMultiInputRangeField as useMultiInputRangeField,
  UseMultiInputRangeFieldTextFieldProps,
} from '@mui/x-date-pickers-pro/hooks';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
import {
  MultiInputFieldSlotTextFieldProps,
  MultiInputFieldRefs,
} from '@mui/x-date-pickers-pro/models';

const BrowserFieldRoot = styled('div', { name: 'BrowserField', slot: 'Root' })({
  display: 'flex',
  alignItems: 'center',
});

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    whiteSpace: 'nowrap',
  },
);

interface BrowserTextFieldProps
  extends UseMultiInputRangeFieldTextFieldProps<
    true,
    React.HTMLAttributes<HTMLDivElement>
  > {
  triggerRef?: React.Ref<HTMLDivElement>;
}

function BrowserTextField(props: BrowserTextFieldProps) {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,

    // Should be passed to the PickersSectionList component
    elements,
    sectionListRef,
    contentEditable,
    onFocus,
    onBlur,
    tabIndex,
    onInput,
    onPaste,
    onKeyDown,

    // Can be passed to a hidden <input /> element
    onChange,
    value,

    // Can be used to style the component
    areAllSectionsEmpty,
    disabled,
    readOnly,
    focused,
    error,

    triggerRef,

    // The rest can be passed to the root element
    ...other
  } = props;

  return (
    <BrowserFieldRoot {...other} ref={triggerRef}>
      <BrowserFieldContent>
        <PickersSectionList
          elements={elements}
          sectionListRef={sectionListRef}
          contentEditable={contentEditable}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
          onInput={onInput}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
        />
      </BrowserFieldContent>
    </BrowserFieldRoot>
  );
}

interface BrowserMultiInputDateRangeFieldProps
  extends Omit<
      DateRangePickerFieldProps,
      'unstableFieldRef' | 'clearable' | 'onClear'
    >,
    MultiInputFieldRefs {
  slotProps: {
    textField: any;
  };
}

function BrowserMultiInputDateRangeField(
  props: BrowserMultiInputDateRangeFieldProps,
) {
  const manager = useDateRangeManager();
  const pickerContext = usePickerContext();
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { slotProps, ...otherForwardedProps } = forwardedProps;

  const startTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'start' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'end' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const fieldResponse = useMultiInputRangeField({
    manager,
    internalProps,
    startTextFieldProps,
    endTextFieldProps,
    rootProps: {
      ref: pickerContext.rootRef,
      spacing: 2,
      direction: 'row' as const,
      overflow: 'auto',
      ...otherForwardedProps,
    },
  });

  return (
    <Stack {...fieldResponse.root}>
      <BrowserTextField
        {...fieldResponse.startTextField}
        triggerRef={pickerContext.triggerRef}
      />
      <span>–</span>
      <BrowserTextField {...fieldResponse.endTextField} />
    </Stack>
  );
}

BrowserMultiInputDateRangeField.fieldType = 'multi-input';

function BrowserDateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePicker
      {...props}
      slots={{ ...props.slots, field: BrowserMultiInputDateRangeField }}
    />
  );
}

export default function BrowserV7MultiInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDateRangePicker />
    </LocalizationProvider>
  );
}

```

### Using Joy UI

You can use the [Joy UI](https://mui.com/joy-ui/getting-started/) components instead of the Material UI ones:

```tsx
import * as React from 'react';
import {
  ThemeProvider,
  createTheme,
  useColorScheme as useMaterialColorScheme,
} from '@mui/material/styles';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { createSvgIcon } from '@mui/joy/utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DatePicker,
  DatePickerFieldProps,
  DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import { usePickerContext } from '@mui/x-date-pickers/hooks';

const CalendarIcon = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />,
  'Calendar',
);

const ClearIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'Clear',
);

const joyTheme = extendJoyTheme();

function JoyDateField(props: DatePickerFieldProps) {
  const fieldResponse = useDateField<false, typeof props>(props);

  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,

    // Should be passed to the button that opens the picker
    openPickerAriaLabel,

    // Can be passed to the button that clears the value
    onClear,
    clearable,

    // Can be used to style the component
    disabled,
    readOnly,
    error,
    inputRef,

    // The rest can be passed to the root element
    id,
    value,
    ...other
  } = fieldResponse;

  const pickerContext = usePickerContext();

  return (
    <FormControl disabled={disabled} id={id} ref={pickerContext.rootRef}>
      <FormLabel>{pickerContext.label}</FormLabel>
      <Input
        disabled={disabled}
        endDecorator={
          <React.Fragment>
            {clearable && value && (
              <IconButton
                title="Clear"
                tabIndex={-1}
                onClick={onClear}
                sx={{ marginRight: 0.5 }}
              >
                <ClearIcon size="md" />
              </IconButton>
            )}
            <IconButton
              onClick={() => pickerContext.setOpen((prev) => !prev)}
              aria-label={openPickerAriaLabel}
            >
              <CalendarIcon size="md" />
            </IconButton>
          </React.Fragment>
        }
        slotProps={{
          input: { ref: inputRef },
        }}
        {...other}
        value={value}
        ref={pickerContext.triggerRef}
      />
    </FormControl>
  );
}

function JoyDatePicker(props: DatePickerProps<false>) {
  return (
    <DatePicker
      {...props}
      enableAccessibleFieldDOMStructure={false}
      slots={{ ...props.slots, field: JoyDateField }}
    />
  );
}

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode() {
  const { setMode } = useColorScheme();
  const { mode } = useMaterialColorScheme();
  React.useEffect(() => {
    if (mode) {
      setMode(mode);
    }
  }, [mode, setMode]);
  return null;
}

const theme = createTheme({ colorSchemes: { light: true, dark: true } });

export default function JoyV6Field() {
  return (
    <ThemeProvider theme={theme}>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDatePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

```

```tsx
import * as React from 'react';
import {
  ThemeProvider,
  createTheme,
  useColorScheme as useMaterialColorScheme,
} from '@mui/material/styles';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import { createSvgIcon } from '@mui/joy/utils';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import IconButton from '@mui/joy/IconButton';

const DateRangeIcon = createSvgIcon(
  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />,
  'DateRange',
);

const ClearIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'Clear',
);

const joyTheme = extendJoyTheme();

function JoySingleInputDateRangeField(props: DateRangePickerFieldProps) {
  const fieldResponse = useSingleInputDateRangeField<false, typeof props>(props);

  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,

    // Should be passed to the button that opens the picker
    openPickerAriaLabel,

    // Can be passed to the button that clears the value
    onClear,
    clearable,

    disabled,
    id,
    value,
    inputRef,
    ...other
  } = fieldResponse;

  const pickerContext = usePickerContext();

  return (
    <FormControl
      disabled={disabled}
      id={id}
      ref={pickerContext.rootRef}
      style={{
        minWidth: 300,
      }}
    >
      <FormLabel>{pickerContext.label}</FormLabel>
      <Input
        disabled={disabled}
        endDecorator={
          <React.Fragment>
            {clearable && value && (
              <IconButton
                title="Clear"
                tabIndex={-1}
                onClick={onClear}
                sx={{ marginRight: 0.5 }}
              >
                <ClearIcon size="md" />
              </IconButton>
            )}
            <IconButton
              onClick={() => pickerContext.setOpen((prev) => !prev)}
              aria-label={openPickerAriaLabel}
            >
              <DateRangeIcon size="md" />
            </IconButton>
          </React.Fragment>
        }
        slotProps={{
          input: { ref: inputRef },
        }}
        {...other}
        value={value}
        ref={pickerContext.triggerRef}
      />
    </FormControl>
  );
}

JoySingleInputDateRangeField.fieldType = 'single-input';

function JoySingleInputDateRangePicker(props: DateRangePickerProps<false>) {
  return (
    <DateRangePicker
      {...props}
      enableAccessibleFieldDOMStructure={false}
      slots={{ ...props.slots, field: JoySingleInputDateRangeField }}
    />
  );
}

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode() {
  const { setMode } = useColorScheme();
  const { mode } = useMaterialColorScheme();
  React.useEffect(() => {
    if (mode) {
      setMode(mode);
    }
  }, [mode, setMode]);
  return null;
}

const theme = createTheme({ colorSchemes: { light: true, dark: true } });

export default function JoyV6SingleInputRangeField() {
  return (
    <ThemeProvider theme={theme}>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoySingleInputDateRangePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

```

```tsx
import * as React from 'react';
import {
  ThemeProvider,
  createTheme,
  useColorScheme as useMaterialColorScheme,
} from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import Input, { InputProps } from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import {
  unstable_useMultiInputRangeField as useMultiInputRangeField,
  UseMultiInputRangeFieldTextFieldProps,
} from '@mui/x-date-pickers-pro/hooks';
import {
  MultiInputFieldRefs,
  MultiInputFieldSlotTextFieldProps,
} from '@mui/x-date-pickers-pro/models';

const joyTheme = extendJoyTheme();

interface JoyTextFieldProps
  extends UseMultiInputRangeFieldTextFieldProps<false, {}>,
    Omit<InputProps, keyof UseMultiInputRangeFieldTextFieldProps<false, {}>> {
  label?: React.ReactNode;
  triggerRef?: React.Ref<HTMLDivElement>;
}

function JoyField(props: JoyTextFieldProps) {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,

    triggerRef,
    disabled,
    id,
    label,
    slotProps,
    inputRef,
    ...other
  } = props;

  return (
    <FormControl disabled={disabled} id={id}>
      <FormLabel>{label}</FormLabel>
      <Input
        disabled={disabled}
        slotProps={{
          ...slotProps,
          input: { ...slotProps?.input, ref: inputRef },
        }}
        {...other}
        ref={triggerRef}
      />
    </FormControl>
  );
}

interface JoyMultiInputDateRangeFieldProps
  extends Omit<
      DateRangePickerFieldProps,
      'unstableFieldRef' | 'clearable' | 'onClear'
    >,
    MultiInputFieldRefs {
  slotProps: {
    textField: any;
  };
}

function JoyMultiInputDateRangeField(props: JoyMultiInputDateRangeFieldProps) {
  const manager = useDateRangeManager({
    enableAccessibleFieldDOMStructure: false,
  });
  const pickerContext = usePickerContext();
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { slotProps, ...otherForwardedProps } = forwardedProps;

  const startTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    additionalProps: { label: 'Start' },
    ownerState: { position: 'start' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    additionalProps: { label: 'End' },
    ownerState: { position: 'end' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const fieldResponse = useMultiInputRangeField({
    manager,
    internalProps: { ...internalProps, enableAccessibleFieldDOMStructure: false },
    rootProps: {
      ref: pickerContext.rootRef,
      spacing: 2,
      overflow: 'auto',
      direction: 'row' as const,
      alignItems: 'center',
      ...otherForwardedProps,
    },
    startTextFieldProps,
    endTextFieldProps,
  });

  return (
    <Stack {...fieldResponse.root}>
      <JoyField
        {...fieldResponse.startTextField}
        triggerRef={pickerContext.triggerRef}
      />
      <FormControl>
        <Typography sx={{ marginTop: '25px' }}>{' – '}</Typography>
      </FormControl>
      <JoyField {...fieldResponse.endTextField} />
    </Stack>
  );
}

JoyMultiInputDateRangeField.fieldType = 'multi-input';

function JoyDateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePicker
      {...props}
      enableAccessibleFieldDOMStructure={false}
      slots={{ ...props?.slots, field: JoyMultiInputDateRangeField }}
    />
  );
}

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode() {
  const { setMode } = useColorScheme();
  const { mode } = useMaterialColorScheme();
  React.useEffect(() => {
    if (mode) {
      setMode(mode);
    }
  }, [mode, setMode]);
  return null;
}

const theme = createTheme({ colorSchemes: { light: true, dark: true } });

export default function JoyV6MultiInputRangeField() {
  return (
    <ThemeProvider theme={theme}>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDateRangePicker />
        </LocalizationProvider>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

```

:::warning
All the Joy UI examples use the non-accessible DOM structure.
The new accessible DOM structure will become compatible with Joy UI in the future.
:::

## With a custom editing experience

### Using an Autocomplete

If your user can only select a value in a small list of available dates, you can replace the field with the [Autocomplete](/material-ui/react-autocomplete/) component to list those dates:

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import useForkRef from '@mui/utils/useForkRef';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerFieldProps,
  DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import {
  usePickerContext,
  usePickerTranslations,
  useSplitFieldProps,
} from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

interface AutocompleteFieldProps extends DatePickerFieldProps {
  /**
   * @typescript-to-proptypes-ignore
   */
  options?: Dayjs[];
}

function AutocompleteField(props: AutocompleteFieldProps) {
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');
  const {
    value,
    setValue,
    timezone,
    triggerRef,
    rootRef,
    rootClassName,
    rootSx,
    open,
    label,
    name,
    setOpen,
  } = usePickerContext();
  const pickerTranslations = usePickerTranslations();
  const { options = [], ...other } = forwardedProps;

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  const handleRef = useForkRef(triggerRef, rootRef);

  const formattedValue = value ? value.format('ll') : null;
  const openPickerAriaLabel =
    pickerTranslations.openDatePickerDialogue(formattedValue);

  return (
    <Autocomplete
      {...other}
      options={options}
      ref={handleRef}
      className={rootClassName}
      sx={[{ minWidth: 250 }, ...(Array.isArray(rootSx) ? rootSx : [rootSx])]}
      renderInput={(params) => {
        const endAdornment = params.InputProps
          .endAdornment as React.ReactElement<any>;
        return (
          <TextField
            {...params}
            error={hasValidationError}
            focused={open}
            label={label}
            name={name}
            InputProps={{
              ...params.InputProps,
              endAdornment: React.cloneElement(endAdornment, {
                children: (
                  <React.Fragment>
                    <IconButton
                      onClick={() => setOpen((prev) => !prev)}
                      aria-label={openPickerAriaLabel}
                      size="small"
                    >
                      <CalendarIcon />
                    </IconButton>
                    {endAdornment.props.children}
                  </React.Fragment>
                ),
              }),
            }}
          />
        );
      }}
      getOptionLabel={(option) => {
        if (!dayjs.isDayjs(option)) {
          return '';
        }

        return option.format('MM/DD/YYYY');
      }}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue, {
          validationError: getValidationErrorForNewValue(newValue),
        });
      }}
      isOptionEqualToValue={(option, valueToCheck) =>
        option.toISOString() === valueToCheck.toISOString()
      }
    />
  );
}

interface AutocompleteDatePickerProps extends DatePickerProps {
  /**
   * @typescript-to-proptypes-ignore
   */
  options: Dayjs[];
}

function AutocompleteDatePicker(props: AutocompleteDatePickerProps) {
  const { options, ...other } = props;

  const optionsLookup = React.useMemo(
    () =>
      options.reduce(
        (acc, option) => {
          acc[option.toISOString()] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    [options],
  );

  return (
    <DatePicker
      slots={{ ...props.slots, field: AutocompleteField }}
      slotProps={{ ...props.slotProps, field: { options } as any }}
      shouldDisableDate={(date) => !optionsLookup[date.startOf('day').toISOString()]}
      {...other}
    />
  );
}

const today = dayjs().startOf('day');

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AutocompleteDatePicker
        label="Pick a date"
        options={[
          today,
          today.add(1, 'day'),
          today.add(4, 'day'),
          today.add(5, 'day'),
        ]}
      />
    </LocalizationProvider>
  );
}

```

### Using a masked Text Field

If you want to use a simple mask approach for the field editing instead of the built-in logic, you can replace the default field with the [TextField](/material-ui/react-text-field/) component using a masked input value built with the [rifm](https://github.com/realadvisor/rifm) package.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useRifm } from 'rifm';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import { CalendarIcon } from '@mui/x-date-pickers/icons';

const MASK_USER_INPUT_SYMBOL = '_';
const ACCEPT_REGEX = /[\d]/gi;

const staticDateWith2DigitTokens = dayjs('2019-11-21T11:30:00.000');
const staticDateWith1DigitTokens = dayjs('2019-01-01T09:00:00.000');

function getInputValueFromValue(value: Dayjs | null, format: string) {
  if (value == null) {
    return '';
  }

  return value.isValid() ? value.format(format) : '';
}

function MaskedDateField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();

  // Control the input text
  const [inputValue, setInputValue] = React.useState<string>(() =>
    getInputValueFromValue(pickerContext.value, pickerContext.fieldFormat),
  );

  React.useEffect(() => {
    if (pickerContext.value && pickerContext.value.isValid()) {
      const newDisplayDate = getInputValueFromValue(
        pickerContext.value,
        pickerContext.fieldFormat!,
      );
      setInputValue(newDisplayDate);
    }
  }, [pickerContext.fieldFormat, pickerContext.value]);

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
    validator: validateDate,
  });

  const handleInputValueChange = (newInputValue: string) => {
    setInputValue(newInputValue);

    const newValue = dayjs(newInputValue, pickerContext.fieldFormat);
    pickerContext.setValue(newValue, {
      validationError: getValidationErrorForNewValue(newValue),
    });
  };

  const rifmFormat = React.useMemo(() => {
    const formattedDateWith1Digit = staticDateWith1DigitTokens.format(
      pickerContext.fieldFormat,
    );
    const inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(
      ACCEPT_REGEX,
      MASK_USER_INPUT_SYMBOL,
    );
    const inferredFormatPatternWith2Digits = staticDateWith2DigitTokens
      .format(pickerContext.fieldFormat)
      .replace(ACCEPT_REGEX, '_');

    if (inferredFormatPatternWith1Digits !== inferredFormatPatternWith2Digits) {
      throw new Error(
        `Mask does not support numbers with variable length such as 'M'.`,
      );
    }

    const maskToUse = inferredFormatPatternWith1Digits;

    return function formatMaskedDate(valueToFormat: string) {
      let outputCharIndex = 0;
      return valueToFormat
        .split('')
        .map((character, characterIndex) => {
          ACCEPT_REGEX.lastIndex = 0;

          if (outputCharIndex > maskToUse.length - 1) {
            return '';
          }

          const maskChar = maskToUse[outputCharIndex];
          const nextMaskChar = maskToUse[outputCharIndex + 1];

          const acceptedChar = ACCEPT_REGEX.test(character) ? character : '';
          const formattedChar =
            maskChar === MASK_USER_INPUT_SYMBOL
              ? acceptedChar
              : maskChar + acceptedChar;

          outputCharIndex += formattedChar.length;

          const isLastCharacter = characterIndex === valueToFormat.length - 1;
          if (
            isLastCharacter &&
            nextMaskChar &&
            nextMaskChar !== MASK_USER_INPUT_SYMBOL
          ) {
            // when cursor at the end of mask part (e.g. month) prerender next symbol "21" -> "21/"
            return formattedChar ? formattedChar + nextMaskChar : '';
          }

          return formattedChar;
        })
        .join('');
    };
  }, [pickerContext.fieldFormat]);

  const rifmProps = useRifm({
    value: inputValue,
    onChange: handleInputValueChange,
    format: rifmFormat,
  });

  return (
    <TextField
      placeholder={parsedFormat}
      error={hasValidationError}
      focused={pickerContext.open}
      name={pickerContext.name}
      label={pickerContext.label}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.rootRef}
      {...rifmProps}
      {...forwardedProps}
      InputProps={{
        ref: pickerContext.triggerRef,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => pickerContext.setOpen((prev) => !prev)}
              edge="end"
            >
              <CalendarIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

function MaskedFieldDatePicker(props: DatePickerProps) {
  return (
    <DatePicker slots={{ ...props.slots, field: MaskedDateField }} {...props} />
  );
}

export default function MaskedMaterialTextField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaskedFieldDatePicker />
    </LocalizationProvider>
  );
}

```

### Using a read-only Text Field

If you want users to select a value exclusively through the views
but you still want the UI to look like a Text Field, you can replace the field with a read-only [Text Field](/material-ui/react-text-field/) component:

```tsx
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { CalendarIcon } from '@mui/x-date-pickers/icons';

function ReadOnlyDateField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  return (
    <TextField
      {...forwardedProps}
      value={
        pickerContext.value == null
          ? ''
          : pickerContext.value.format(pickerContext.fieldFormat)
      }
      placeholder={parsedFormat}
      InputProps={{
        ref: pickerContext.triggerRef,
        readOnly: true,
        endAdornment: <CalendarIcon color="action" />,
        sx: { cursor: 'pointer', '& *': { cursor: 'inherit' } },
      }}
      error={hasValidationError}
      focused={pickerContext.open}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.rootRef}
      name={pickerContext.name}
      label={pickerContext.label}
    />
  );
}

function ReadOnlyFieldDatePicker(props: DatePickerProps) {
  return (
    <DatePicker {...props} slots={{ ...props.slots, field: ReadOnlyDateField }} />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadOnlyFieldDatePicker />
    </LocalizationProvider>
  );
}

```

### Using a read-only Text Field on mobile

If you want to keep the default behavior on desktop but have a read-only TextField on mobile, you can conditionally render the custom field presented in the previous section:

```tsx
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import { DateField } from '@mui/x-date-pickers/DateField';

function ReadOnlyDateField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();

  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  return (
    <TextField
      {...forwardedProps}
      value={
        pickerContext.value == null
          ? ''
          : pickerContext.value.format(pickerContext.fieldFormat)
      }
      placeholder={parsedFormat}
      InputProps={{
        ref: pickerContext.triggerRef,
        readOnly: true,
        endAdornment: <CalendarIcon color="action" />,
        sx: { cursor: 'pointer', '& *': { cursor: 'inherit' } },
      }}
      error={hasValidationError}
      focused={pickerContext.open}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      name={pickerContext.name}
      label={pickerContext.label}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.rootRef}
    />
  );
}

function ReadOnlyOnMobileDateField(props: DatePickerFieldProps) {
  const pickerContext = usePickerContext();

  if (pickerContext.variant === 'mobile') {
    return <ReadOnlyDateField {...props} />;
  }

  return <DateField {...props} />;
}

function ReadOnlyFieldDatePicker(props: DatePickerProps) {
  return (
    <DatePicker
      {...props}
      slots={{ ...props.slots, field: ReadOnlyOnMobileDateField }}
    />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadOnlyFieldDatePicker />
    </LocalizationProvider>
  );
}

```

### Using a Button

If you want users to select a value exclusively through the views
and you don't want the UI to look like a Text Field, you can replace the field with the [Button](/material-ui/react-button/) component:

```tsx
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';

function ButtonDateField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={handleRef}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ? `${pickerContext.label}: ${valueStr}` : valueStr}
    </Button>
  );
}

function ButtonFieldDatePicker(props: DatePickerProps) {
  return (
    <DatePicker {...props} slots={{ ...props.slots, field: ButtonDateField }} />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonFieldDatePicker />
    </LocalizationProvider>
  );
}

```

The same logic can be applied to any Range Picker:

```tsx
import * as React from 'react';
import { Dayjs } from 'dayjs';
import useForkRef from '@mui/utils/useForkRef';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DateRangePicker,
  DateRangePickerProps,
  DateRangePickerFieldProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { useValidation } from '@mui/x-date-pickers/validation';
import { validateDateRange } from '@mui/x-date-pickers-pro/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';

function ButtonDateRangeField(props: DateRangePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDateRange,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const formattedValue = pickerContext.value
    .map((date: Dayjs) =>
      date == null ? parsedFormat : date.format(pickerContext.fieldFormat),
    )
    .join(' – ');

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={handleRef}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label
        ? `${pickerContext.label}: ${formattedValue}`
        : formattedValue}
    </Button>
  );
}

// TODO v8: Will be removed before the end of the alpha since single input will become the default field.
ButtonDateRangeField.fieldType = 'single-input';

function ButtonFieldDateRangePicker(props: DateRangePickerProps) {
  return (
    <DateRangePicker
      {...props}
      slots={{ ...props.slots, field: ButtonDateRangeField }}
    />
  );
}

export default function MaterialDateRangePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonFieldDateRangePicker />
    </LocalizationProvider>
  );
}

```

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

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerProps,
  DatePickerFieldProps,
} from '@mui/x-date-pickers/DatePicker';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

function CustomDateField(props: DatePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const placeholder = useParsedFormat();
  const [inputValue, setInputValue] = useInputValue();

  // Check if the current value is valid or not.
  const { hasValidationError } = useValidation({
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
    validator: validateDate,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    const newValue = dayjs(newInputValue, pickerContext.fieldFormat);
    setInputValue(newInputValue);
    pickerContext.setValue(newValue);
  };

  return (
    <TextField
      {...forwardedProps}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      error={hasValidationError}
      focused={pickerContext.open}
      label={pickerContext.label}
      name={pickerContext.name}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.rootRef}
    />
  );
}

function useInputValue() {
  const pickerContext = usePickerContext();
  const [lastValueProp, setLastValueProp] = React.useState(pickerContext.value);
  const [inputValue, setInputValue] = React.useState(() =>
    createInputValue(pickerContext.value, pickerContext.fieldFormat),
  );

  if (lastValueProp !== pickerContext.value) {
    setLastValueProp(pickerContext.value);
    if (pickerContext.value && pickerContext.value.isValid()) {
      setInputValue(
        createInputValue(pickerContext.value, pickerContext.fieldFormat),
      );
    }
  }

  return [inputValue, setInputValue] as const;
}

function createInputValue(value: Dayjs | null, format: string) {
  if (value == null) {
    return '';
  }

  return value.isValid() ? value.format(format) : '';
}

function CustomFieldDatePicker(props: DatePickerProps) {
  return (
    <DatePicker slots={{ ...props.slots, field: CustomDateField }} {...props} />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomFieldDatePicker />
    </LocalizationProvider>
  );
}

```
