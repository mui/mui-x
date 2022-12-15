import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { TimeFieldProps } from './TimeField.types';
import { useTimeField } from './useTimeField';

type TimeFieldComponent = (<TDate>(
  props: TimeFieldProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const TimeField = React.forwardRef(function TimeField<TDate>(
  inProps: TimeFieldProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiTimeField',
  });

  const { components, componentsProps, ...other } = themeProps;

  const ownerState = themeProps;

  const Input = components?.Input ?? TextField;
  const { inputRef: externalInputRef, ...inputProps }: TimeFieldProps<TDate> = useSlotProps({
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
  } = useTimeField<TDate, typeof inputProps>({
    props: inputProps,
    inputRef: externalInputRef,
  });

  return (
    <Input
      ref={ref}
      {...fieldProps}
      inputProps={{ ...fieldProps.inputProps, ref: inputRef, onPaste, inputMode }}
    />
  );
}) as TimeFieldComponent;

TimeField.propTypes = {
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
  defaultValue: PropTypes.any,
  /**
   * If `true`, the field is disabled
   * @default false
   */
  disabled: PropTypes.bool,
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
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime: PropTypes.any,
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
  value: PropTypes.any,
} as any;

export { TimeField };
