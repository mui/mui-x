import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { SingleInputDateTimeRangeFieldProps } from './SingleInputDateTimeRangeField.types';
import { useSingleInputDateTimeRangeField } from './useSingleInputDateTimeRangeField';

type DateRangeFieldComponent = (<TDate>(
  props: SingleInputDateTimeRangeFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

const SingleInputDateTimeRangeField = React.forwardRef(function SingleInputDateTimeRangeField<
  TDate,
>(inProps: SingleInputDateTimeRangeFieldProps<TDate>, ref: React.Ref<HTMLInputElement>) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiSingleInputDateTimeRangeField',
  });

  const { components, componentsProps, ...other } = themeProps;

  const ownerState = themeProps;

  const Input = components?.Input ?? TextField;
  const inputProps: SingleInputDateTimeRangeFieldProps<TDate> = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    externalForwardedProps: other,
    ownerState,
  });

  const {
    ref: inputRef,
    onPaste,
    inputMode,
    ...fieldProps
  } = useSingleInputDateTimeRangeField<TDate, typeof inputProps>({
    props: inputProps,
    inputRef: inputProps.inputRef,
  });

  return (
    <Input
      ref={ref}
      {...fieldProps}
      inputProps={{ ...fieldProps.inputProps, ref: inputRef, onPaste, inputMode }}
    />
  );
}) as DateRangeFieldComponent;

SingleInputDateTimeRangeField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm: PropTypes.bool,
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.any),
  /**
   * If `true` disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * If `true` disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Format of the date when rendered in the input(s).
   */
  format: PropTypes.string,
  /**
   * Maximal selectable date.
   */
  maxDate: PropTypes.any,
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime: PropTypes.any,
  /**
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime: PropTypes.any,
  /**
   * Minimal selectable date.
   */
  minDate: PropTypes.any,
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime: PropTypes.any,
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime: PropTypes.any,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
  /**
   * Callback fired when the value changes.
   * @template TValue, TError
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * @template TValue, TError
   * @param {TError} error The new error.
   * @param {TValue} value The value associated to the error.
   */
  onError: PropTypes.func,
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange: PropTypes.func,
  /**
   * It prevents the user from changing the value of the field
   * (not from interacting with the field).
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * The currently selected sections.
   * This prop accept four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
   * 3. If a string of type `MuiDateSectionName` is provided, the first section with that name will be selected.
   * 4. If `null` is provided, no section will be selected
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: PropTypes.oneOfType([
    PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']),
    PropTypes.number,
    PropTypes.shape({
      endIndex: PropTypes.number.isRequired,
      startIndex: PropTypes.number.isRequired,
    }),
  ]),
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific time.
   * @param {number} timeValue The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: PropTypes.func,
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.arrayOf(PropTypes.any),
} as any;

export { SingleInputDateTimeRangeField };
