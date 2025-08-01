---
productId: x-date-pickers
title: Date and Time Pickers - Custom opening button
---

# Custom opening button

The date picker lets you customize the button to open the views.

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Set a custom opening icon

If you want to change the icon opening the picker without changing its behavior, you can use the `openPickerIcon` slot:

```tsx
import * as React from 'react';
import { createSvgIcon } from '@mui/material/utils';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FlightLandIcon = createSvgIcon(
  <path d="M2.5 19h19v2h-19v-2zm16.84-3.15c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l16.57 4.44z" />,
  'FlightLandIcon',
);

function MuiIcon() {
  return <img src="/static/logo.svg" alt="Date picker opening icon" width={32} />;
}

export default function CustomOpeningIcon() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
        <DatePicker
          label="Departure"
          // Using an SVG component from `@mui/icons-material`
          slots={{ openPickerIcon: FlightTakeoffIcon }}
        />
        <DatePicker
          label="Arrival"
          // Using a custom SVG component
          slots={{ openPickerIcon: FlightLandIcon }}
        />
        <DatePicker
          label="New release date"
          // Using an img component
          slots={{ openPickerIcon: MuiIcon }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

You can also change the icon rendered based on the current status of the picker:

```tsx
import * as React from 'react';
import { Dayjs } from 'dayjs';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckIcon from '@mui/icons-material/Check';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomOpeningIconConditional() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          value={value}
          onChange={setValue}
          slots={{
            openPickerIcon:
              value == null || !value.isValid() ? PriorityHighIcon : CheckIcon,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Pass props to the opening button

If you want to customize the opening button without redefining its whole behavior, you can use either:

- the `openPickerButton` slot to target the [`IconButton`](/material-ui/api/icon-button/) component.
- the `inputAdornment` slot to target the [`InputAdornment`](/material-ui/api/input-adornment/) component.

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomPropsOpeningButton() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          slotProps={{
            // Targets the `IconButton` component.
            openPickerButton: {
              color: 'primary',
            },
            // Targets the `InputAdornment` component.
            inputAdornment: {
              component: 'span',
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::warning
If you want to track the opening of the picker, you should use the `onOpen` / `onClose` callbacks instead of modifying the opening button:

```tsx
<DatePicker onOpen={handleOpen} onClose={handleClose} />
```

:::

## Render the opening button at the start of the input

You can use the `openPickerButtonPosition` on the `field` slot to position the opening button at the start or the end of the input:

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function StartEdgeOpeningButton() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          slotProps={{
            field: { openPickerButtonPosition: 'start' },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Add an icon next to the opening button

If you want to add an icon next to the opening button, you can use the `inputAdornment` slot.
In the example below, the warning icon will be visible anytime the current value is invalid:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import InputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateValidationError } from '@mui/x-date-pickers/models';

function CustomInputAdornment(props: InputAdornmentProps & { hasError?: boolean }) {
  const { hasError, children, sx, ...other } = props;
  return (
    <InputAdornment {...other}>
      <PriorityHighIcon
        color="error"
        sx={[
          {
            marginLeft: 1,
          },
          hasError
            ? {
                opacity: 1,
              }
            : {
                opacity: 0,
              },
        ]}
      />
      {children}
    </InputAdornment>
  );
}

export default function AddWarningIconWhenInvalid() {
  const [error, setError] = React.useState<DateValidationError>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label="Picker with error icon"
          maxDate={dayjs('2022-04-17')}
          defaultValue={dayjs('2022-04-18')}
          onError={setError}
          slots={{ inputAdornment: CustomInputAdornment }}
          slotProps={{
            inputAdornment: { hasError: !!error } as any,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

To add the same behavior to a picker that does not have an input adornment (for example, a Date Range Picker when used with a multi input field),
you need to use the `textField` slot to add one:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import InputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateRangeValidationError } from '@mui/x-date-pickers-pro/models';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { FieldOwnerState } from '@mui/x-date-pickers/models';

function CustomInputAdornment(props: InputAdornmentProps & { hasError?: boolean }) {
  const { hasError, children, sx, ...other } = props;
  return (
    <InputAdornment {...other}>
      <PriorityHighIcon
        color="error"
        sx={[
          hasError
            ? {
                opacity: 1,
              }
            : {
                opacity: 0,
              },
        ]}
      />
      {children}
    </InputAdornment>
  );
}

export default function AddWarningIconWhenInvalidRange() {
  const [error, setError] = React.useState<DateRangeValidationError>([null, null]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DateRangePicker
          label="Picker with error icon"
          maxDate={dayjs('2022-04-19')}
          defaultValue={[dayjs('2022-04-18'), dayjs('2022-04-21')]}
          onError={setError}
          slots={{ field: MultiInputDateRangeField }}
          slotProps={{
            textField: ({
              position,
            }: FieldOwnerState & { position?: 'start' | 'end' }) => ({
              InputProps: {
                endAdornment: (
                  <CustomInputAdornment
                    position="end"
                    hasError={!!error[position === 'start' ? 0 : 1]}
                  />
                ),
              },
            }),
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```
