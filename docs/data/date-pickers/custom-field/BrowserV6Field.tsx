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
import { useClearableField } from '@mui/x-date-pickers/hooks';
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models';

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
  enableAccessibleFieldDOMStructure: boolean;
}

type BrowserFieldComponent = ((
  props: BrowserFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const BrowserField = React.forwardRef(
  (props: BrowserFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      // Should be ignored
      enableAccessibleFieldDOMStructure,

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
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
          },
          sx || {},
        ]}
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
  extends UseDateFieldProps<Dayjs, false>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      false,
      DateValidationError
    > {}

const BrowserDateField = React.forwardRef(
  (props: BrowserDateFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, ...textFieldProps } = props;

    const fieldResponse = useDateField<Dayjs, false, typeof textFieldProps>({
      ...textFieldProps,
      enableAccessibleFieldDOMStructure: false,
    });

    /* If you don't need a clear button, you can skip the use of this hook */
    const processedFieldProps = useClearableField({
      ...fieldResponse,
      slots,
      slotProps,
    });

    return <BrowserField ref={ref} {...processedFieldProps} />;
  },
);

const BrowserDatePicker = React.forwardRef(
  (props: DatePickerProps<Dayjs, false>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DatePicker<Dayjs, false>
        ref={ref}
        {...props}
        slots={{ ...props.slots, field: BrowserDateField }}
      />
    );
  },
);

export default function BrowserV6Field() {
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
