import * as React from 'react';
import { Dayjs } from 'dayjs';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  unstable_useSingleInputDateRangeField as useSingleInputDateRangeField,
  SingleInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import {
  DateFieldSlotsComponent,
  DateFieldSlotsComponentsProps,
} from '@mui/x-date-pickers/DateField/DateField.types';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import {
  BaseMultiInputFieldProps,
  DateRange,
  DateRangeValidationError,
  UseDateRangeFieldProps,
  MultiInputFieldSlotTextFieldProps,
  BaseSingleInputFieldProps,
  DateValidationError,
  RangeFieldSection,
  FieldSection,
} from '@mui/x-date-pickers-pro';
import type {
  SingleInputDateRangeFieldSlotsComponent,
  SingleInputDateRangeFieldSlotsComponentsProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField/SingleInputDateRangeField.types';

interface BrowserFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
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
  (props: BrowserFieldProps, inputRef: React.Ref<HTMLInputElement>) => {
    const {
      disabled,
      id,
      label,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
      error,
      focused,
      ownerState,
      sx,
      ...other
    } = props;

    return (
      <Box
        sx={{ ...(sx || {}), display: 'flex', alignItems: 'center', flexGrow: 1 }}
        id={id}
        ref={containerRef}
      >
        {startAdornment}
        <input disabled={disabled} ref={inputRef} {...other} />
        {endAdornment}
      </Box>
    );
  },
) as BrowserFieldComponent;

interface BrowserSingleInputDateRangeFieldProps
  extends SingleInputDateRangeFieldProps<
    Dayjs,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>
  > {
  onAdornmentClick?: () => void;
}

type BrowserSingleInputDateRangeFieldComponent = ((
  props: BrowserSingleInputDateRangeFieldProps &
    React.RefAttributes<HTMLInputElement>,
) => React.JSX.Element) & { fieldType?: string };

const BrowserSingleInputDateRangeField = React.forwardRef(
  (
    props: BrowserSingleInputDateRangeFieldProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const { slots, slotProps, onAdornmentClick, ...other } = props;
    const { color, ...ownerState } = props;

    const {
      inputRef: externalInputRef,
      ...textFieldProps
    }: SingleInputDateRangeFieldProps<Dayjs> = useSlotProps({
      elementType: 'input',
      externalSlotProps: slotProps?.textField,
      externalForwardedProps: other,
      ownerState,
    });

    const {
      onClear,
      clearable,
      slots: inSlots,
      slotProps: inSlotProps,
      ...fieldProps
    } = useSingleInputDateRangeField<Dayjs, typeof textFieldProps>({
      props: textFieldProps,
      inputRef: externalInputRef,
    });

    /* If you don't need a clear button, you can skip the use of this hook */
    const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
      useClearableField<
        {},
        typeof textFieldProps.InputProps,
        SingleInputDateRangeFieldSlotsComponent,
        SingleInputDateRangeFieldSlotsComponentsProps<Dayjs>
      >({
        onClear,
        clearable,
        fieldProps,
        InputProps: {
          ...fieldProps.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onAdornmentClick}>
                <DateRangeIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
        slots: inSlots,
        slotProps: inSlotProps,
      });

    return (
      <BrowserField
        {...processedFieldProps}
        style={{
          width: '100%',
        }}
        InputProps={{ ...ProcessedInputProps, ref }}
      />
    );
  },
) as BrowserSingleInputDateRangeFieldComponent;

BrowserSingleInputDateRangeField.fieldType = 'single-input';

function BrowserSingleInputDateRangePicker(props: DateRangePickerProps<Dayjs>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen((currentOpen) => !currentOpen);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  return (
    <DateRangePicker
      {...props}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      slots={{ field: BrowserSingleInputDateRangeField }}
      slotProps={{
        field: {
          onAdornmentClick: toggleOpen,
          ...props?.slotProps?.field,
        } as any,
      }}
    />
  );
}

interface BrowserMultiInputDateRangeFieldProps
  extends UseDateRangeFieldProps<Dayjs>,
    BaseMultiInputFieldProps<
      DateRange<Dayjs>,
      Dayjs,
      RangeFieldSection,
      DateRangeValidationError
    > {}

type BrowserMultiInputDateRangeFieldComponent = ((
  props: BrowserMultiInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const BrowserMultiInputDateRangeField = React.forwardRef(
  (props: BrowserMultiInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      slotProps,
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      disabled,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
      className,
    } = props;

    const { inputRef: startInputRef, ...startTextFieldProps } = useSlotProps({
      elementType: 'input',
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'start' },
    }) as MultiInputFieldSlotTextFieldProps;

    const { inputRef: endInputRef, ...endTextFieldProps } = useSlotProps({
      elementType: 'input',
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'end' },
    }) as MultiInputFieldSlotTextFieldProps;

    const { startDate, endDate } = useMultiInputDateRangeField<
      Dayjs,
      MultiInputFieldSlotTextFieldProps
    >({
      sharedProps: {
        value,
        defaultValue,
        format,
        onChange,
        readOnly,
        disabled,
        onError,
        shouldDisableDate,
        minDate,
        maxDate,
        disableFuture,
        disablePast,
        selectedSections,
        onSelectedSectionsChange,
      },
      startTextFieldProps,
      endTextFieldProps,
      startInputRef,
      endInputRef,
    });

    return (
      <Stack ref={ref} spacing={2} direction="row" className={className}>
        <BrowserField {...startDate} />
        <span> — </span>
        <BrowserField {...endDate} />
      </Stack>
    );
  },
) as BrowserMultiInputDateRangeFieldComponent;

function BrowserDateRangePicker(props: DateRangePickerProps<Dayjs>) {
  return (
    <DateRangePicker slots={{ field: BrowserMultiInputDateRangeField }} {...props} />
  );
}

interface BrowserDateFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      DateValidationError
    > {}

function BrowserDateField(props: BrowserDateFieldProps) {
  const { inputRef: externalInputRef, ...textFieldProps } = props;

  const { onClear, clearable, slots, slotProps, ...fieldProps } = useDateField<
    Dayjs,
    typeof textFieldProps
  >({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
    useClearableField<
      {},
      typeof textFieldProps.InputProps,
      DateFieldSlotsComponent,
      DateFieldSlotsComponentsProps<Dayjs>
    >({
      onClear,
      clearable,
      fieldProps,
      InputProps: fieldProps.InputProps,
      slots,
      slotProps,
    });

  return <BrowserField {...processedFieldProps} InputProps={ProcessedInputProps} />;
}

function BrowserDatePicker(props: DatePickerProps<Dayjs>) {
  return (
    <DatePicker slots={{ field: BrowserDateField, ...props.slots }} {...props} />
  );
}

export default function PickerWithBrowserField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DatePicker', 'SingleInputDateRangeField', 'DateRangePicker']}
      >
        <BrowserDatePicker
          slotProps={{
            field: { clearable: true },
          }}
        />
        <BrowserSingleInputDateRangePicker
          slotProps={{
            field: { clearable: true },
          }}
          sx={{
            width: '100%',
          }}
        />
        <BrowserDateRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}
