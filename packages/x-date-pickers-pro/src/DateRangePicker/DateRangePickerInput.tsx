import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  useUtils,
  executeInTheNextEventLoopTick,
  WrapperVariantContext,
  DateInputProps,
  ExportedDateInputProps,
  MuiTextFieldProps,
  useMaskedInput,
} from '@mui/x-date-pickers/internals';
import { CurrentlySelectingRangeEndProps, DateRange } from '../internal/models/dateRange';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';

const DateRangePickerInputRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export interface ExportedDateRangePickerInputProps<TInputDate, TDate>
  extends Omit<ExportedDateInputProps<TInputDate, TDate>, 'renderInput'> {
  /**
   * The `renderInput` prop allows you to customize the rendered input.
   * The `startProps` and `endProps` arguments of this render prop contains props of [TextField](https://mui.com/material-ui/api/text-field/#props),
   * that you need to forward to the range start/end inputs respectively.
   * Pay specific attention to the `ref` and `inputProps` keys.
   * @example
   * ```jsx
   * <DateRangePicker
   *  renderInput={(startProps, endProps) => (
   *   <React.Fragment>
   *     <TextField {...startProps} />
   *     <Box sx={{ mx: 2 }}> to </Box>
   *     <TextField {...endProps} />
   *   </React.Fragment>;
   *  )}
   * />
   * ````
   * @param {MuiTextFieldProps} startProps Props that you need to forward to the range start input.
   * @param {MuiTextFieldProps} endProps Props that you need to forward to the range end input.
   * @returns {React.ReactElement} The range input to render.
   */
  renderInput: (startProps: MuiTextFieldProps, endProps: MuiTextFieldProps) => React.ReactElement;
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
}

export interface DateRangeInputProps<TInputDate, TDate>
  extends ExportedDateRangePickerInputProps<TInputDate, TDate>,
    Omit<
      DateInputProps<TInputDate, TDate>,
      keyof ExportedDateRangePickerInputProps<TInputDate, TDate> | 'rawValue' | 'validationError'
    >,
    CurrentlySelectingRangeEndProps {
  startText: React.ReactNode;
  endText: React.ReactNode;
  validationError: DateRangeValidationError;
  rawValue: DateRange<TInputDate>;
}

type DatePickerInputComponent = <TInputDate, TDate>(
  props: DateRangeInputProps<TInputDate, TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element;

/**
 * @ignore - internal component.
 */
export const DateRangePickerInput = React.forwardRef(function DateRangePickerInput<
  TInputDate,
  TDate,
>(props: DateRangeInputProps<TInputDate, TDate>, ref: React.Ref<HTMLDivElement>): JSX.Element {
  const {
    currentlySelectingRangeEnd,
    disableOpenPicker,
    endText,
    onBlur,
    onChange,
    open,
    openPicker,
    rawValue,
    rawValue: [start, end],
    readOnly,
    renderInput,
    setCurrentlySelectingRangeEnd,
    startText,
    TextFieldProps,
    validationError: [startValidationError, endValidationError],
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const startRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLInputElement>(null);
  const wrapperVariant = React.useContext(WrapperVariantContext);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (currentlySelectingRangeEnd === 'start') {
      startRef.current?.focus();
    } else if (currentlySelectingRangeEnd === 'end') {
      endRef.current?.focus();
    }
  }, [currentlySelectingRangeEnd, open]);

  // TODO: rethink this approach. We do not need to wait for calendar to be updated to rerender input (looks like freezing)
  // TODO: so simply break 1 react's commit phase in 2 (first for input and second for calendars) by executing onChange in the next tick
  const lazyHandleChangeCallback = React.useCallback(
    (...args: Parameters<typeof onChange>) =>
      executeInTheNextEventLoopTick(() => onChange(...args)),
    [onChange],
  );

  const handleStartChange = (date: TDate | null, inputString?: string) => {
    lazyHandleChangeCallback([date, utils.date(end)], inputString);
  };

  const handleEndChange = (date: TDate | null, inputString?: string) => {
    lazyHandleChangeCallback([utils.date(start), date], inputString);
  };

  const openRangeStartSelection = () => {
    if (setCurrentlySelectingRangeEnd) {
      setCurrentlySelectingRangeEnd('start');
    }
    if (!readOnly && !disableOpenPicker) {
      openPicker();
    }
  };

  const openRangeEndSelection = () => {
    if (setCurrentlySelectingRangeEnd) {
      setCurrentlySelectingRangeEnd('end');
    }
    if (!readOnly && !disableOpenPicker) {
      openPicker();
    }
  };

  const openOnFocus = wrapperVariant === 'desktop';
  const startInputProps = useMaskedInput({
    ...other,
    readOnly,
    rawValue: start,
    onChange: handleStartChange,
    label: startText,
    validationError: startValidationError !== null,
    TextFieldProps: {
      ...TextFieldProps,
      ref: startRef,
      focused: open && currentlySelectingRangeEnd === 'start',
    },
    inputProps: {
      onClick: !openOnFocus ? openRangeStartSelection : undefined,
      onFocus: openOnFocus ? openRangeStartSelection : undefined,
    },
  });

  const endInputProps = useMaskedInput({
    ...other,
    readOnly,
    label: endText,
    rawValue: end,
    onChange: handleEndChange,
    validationError: endValidationError !== null,
    TextFieldProps: {
      ...TextFieldProps,
      ref: endRef,
      focused: open && currentlySelectingRangeEnd === 'end',
    },
    inputProps: {
      onClick: !openOnFocus ? openRangeEndSelection : undefined,
      onFocus: openOnFocus ? openRangeEndSelection : undefined,
    },
  });

  return (
    <DateRangePickerInputRoot onBlur={onBlur} ref={ref}>
      {renderInput(startInputProps, endInputProps)}
    </DateRangePickerInputRoot>
  );
}) as DatePickerInputComponent;
