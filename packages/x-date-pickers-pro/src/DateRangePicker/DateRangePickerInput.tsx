import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import {
  executeInTheNextEventLoopTick,
  DateInputProps,
  ExportedDateInputProps,
  MuiTextFieldProps,
  useMaskedInput,
  onSpaceOrEnter,
  useLocaleText,
} from '@mui/x-date-pickers/internals';
import { RangePositionProps, DateRange } from '../internal/models/range';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import {
  DateRangePickerInputClasses,
  getDateRangePickerInputUtilityClass,
} from './dateRangePickerInputClasses';

const useUtilityClasses = (ownerState: DateRangePickerInputProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getDateRangePickerInputUtilityClass, classes);
};

const DateRangePickerInputRoot = styled('div', {
  name: 'MuiDateRangePickerInput',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export interface ExportedDateRangePickerInputProps<TDate>
  extends Omit<ExportedDateInputProps<TDate>, 'renderInput'> {
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

export interface DateRangePickerInputProps<TDate>
  extends Omit<ExportedDateRangePickerInputProps<TDate>, 'value'>,
    Omit<
      DateInputProps<TDate>,
      keyof ExportedDateRangePickerInputProps<TDate> | 'value' | 'validationError'
    >,
    RangePositionProps {
  validationError: DateRangeValidationError;
  value: DateRange<TDate>;
  classes?: Partial<DateRangePickerInputClasses>;
  mobile?: boolean;
}

type DatePickerInputComponent = <TDate>(
  props: DateRangePickerInputProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element;

/**
 * @ignore - internal component.
 */
export const DateRangePickerInput = React.forwardRef(function DateRangePickerInput<TDate>(
  inProps: DateRangePickerInputProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
): JSX.Element {
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePickerInput' });
  const {
    rangePosition,
    onRangePositionChange,
    disableOpenPicker,
    onBlur,
    onChange,
    open,
    openPicker,
    value,
    value: [start, end],
    readOnly,
    renderInput,
    TextFieldProps,
    validationError: [startValidationError, endValidationError],
    className,
    mobile,
    ...other
  } = props;

  const startRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLInputElement>(null);
  const classes = useUtilityClasses(props);
  const localeText = useLocaleText<TDate>();

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (rangePosition === 'start') {
      startRef.current?.focus();
    } else if (rangePosition === 'end') {
      endRef.current?.focus();
    }
  }, [rangePosition, open]);

  // TODO: rethink this approach. We do not need to wait for calendar to be updated to rerender input (looks like freezing)
  // TODO: so simply break 1 react's commit phase in 2 (first for input and second for calendars) by executing onChange in the next tick
  const lazyHandleChangeCallback = React.useCallback(
    (...args: Parameters<typeof onChange>) =>
      executeInTheNextEventLoopTick(() => onChange(...args)),
    [onChange],
  );

  const handleStartChange = (date: TDate | null, inputString?: string) => {
    lazyHandleChangeCallback([date, end], inputString);
  };

  const handleEndChange = (date: TDate | null, inputString?: string) => {
    lazyHandleChangeCallback([start, date], inputString);
  };

  const openRangeStartSelection = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    if (onRangePositionChange) {
      onRangePositionChange('start');
    }
    if (!readOnly && !disableOpenPicker) {
      openPicker();
    }
  };

  const openRangeEndSelection = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    if (onRangePositionChange) {
      onRangePositionChange('end');
    }
    if (!readOnly && !disableOpenPicker) {
      openPicker();
    }
  };

  const focusOnRangeEnd = () => {
    if (open && onRangePositionChange) {
      onRangePositionChange('end');
    }
  };

  const focusOnRangeStart = () => {
    if (open && onRangePositionChange) {
      onRangePositionChange('start');
    }
  };
  const startInputProps = useMaskedInput({
    ...other,
    readOnly,
    value: start,
    onChange: handleStartChange,
    label: localeText.start,
    validationError: startValidationError !== null,
    TextFieldProps: {
      ...TextFieldProps,
      inputRef: startRef,
      focused: open ? rangePosition === 'start' : undefined,
      // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
      // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
      ...(!readOnly && !other.disabled && { onClick: openRangeStartSelection }),
    },
    inputProps: {
      onClick: openRangeStartSelection,
      onKeyDown: onSpaceOrEnter(openRangeStartSelection),
      onFocus: focusOnRangeStart,
      readOnly: mobile,
    },
  });

  const endInputProps = useMaskedInput({
    ...other,
    readOnly,
    label: localeText.end,
    value: end,
    onChange: handleEndChange,
    validationError: endValidationError !== null,
    TextFieldProps: {
      ...TextFieldProps,
      inputRef: endRef,
      focused: open ? rangePosition === 'end' : undefined,
      // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
      // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
      ...(!readOnly && !other.disabled && { onClick: openRangeEndSelection }),
    },
    inputProps: {
      onClick: openRangeEndSelection,
      onKeyDown: onSpaceOrEnter(openRangeEndSelection),
      onFocus: focusOnRangeEnd,
      readOnly: mobile,
    },
  });

  return (
    <DateRangePickerInputRoot onBlur={onBlur} ref={ref} className={clsx(classes.root, className)}>
      {renderInput(startInputProps, endInputProps)}
    </DateRangePickerInputRoot>
  );
}) as DatePickerInputComponent;
