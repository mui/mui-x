import * as React from 'react';
import { Dayjs } from 'dayjs';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import {
  DateFieldSlots,
  DateFieldSlotProps,
} from '@mui/x-date-pickers/DateField/DateField.types';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers-pro';

interface BrowserFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  inputRef?: React.Ref<any>;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  error?: boolean;
  focused?: boolean;
  ownerState?: any;
  sx?: any;
}

type BrowserFieldComponent = ((
  props: BrowserFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const BrowserField = React.forwardRef(
  (props: BrowserFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      disabled,
      id,
      label,
      inputRef,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
      error,
      focused,
      ownerState,
      sx,
      ...other
    } = props;

    const handleRef = useForkRef(containerRef, ref);

    return (
      <Box
        sx={{ ...(sx || {}), display: 'flex', alignItems: 'center' }}
        id={id}
        ref={handleRef}
      >
        {startAdornment}
        <input disabled={disabled} ref={inputRef} {...other} />
        {endAdornment}
      </Box>
    );
  },
) as BrowserFieldComponent;

interface BrowserDateFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      DateValidationError
    > {}

const BrowserDateField = React.forwardRef(
  (props: BrowserDateFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      inputRef: externalInputRef,
      slots,
      slotProps,
      ...textFieldProps
    } = props;

    const {
      onClear,
      clearable,
      ref: inputRef,
      ...fieldProps
    } = useDateField<Dayjs, typeof textFieldProps>({
      props: textFieldProps,
      inputRef: externalInputRef,
    });

    /* If you don't need a clear button, you can skip the use of this hook */
    const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
      useClearableField<
        {},
        typeof textFieldProps.InputProps,
        DateFieldSlots,
        DateFieldSlotProps<Dayjs>
      >({
        onClear,
        clearable,
        fieldProps,
        InputProps: fieldProps.InputProps,
        slots,
        slotProps,
      });
    return (
      <BrowserField
        ref={ref}
        inputRef={inputRef}
        {...processedFieldProps}
        InputProps={ProcessedInputProps}
      />
    );
  },
);

const BrowserDatePicker = React.forwardRef(
  (props: DatePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DatePicker
        ref={ref}
        {...props}
        slots={{ field: BrowserDateField, ...props.slots }}
      />
    );
  },
);

export default function PickerWithBrowserField() {
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
