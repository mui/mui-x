import * as React from 'react';
import PropTypes from 'prop-types';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { MultiInputDateRangeFieldProps } from './MultiInputDateRangeField.types';
import { useMultiInputDateRangeField } from '../internal/hooks/useMultiInputRangeField/useMultiInputDateRangeField';

const MultiInputDateRangeFieldRoot = styled(
  React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
    <Stack ref={ref} {...props} spacing={2} direction="row" alignItems="center" />
  )),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputDateRangeFieldSeparator = styled(
  (props: TypographyProps) => <Typography {...props}>{props.children ?? ' — '}</Typography>,
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Separator',
    overridesResolver: (props, styles) => styles.separator,
  },
)({});

type MultiInputDateRangeFieldComponent = (<TDate>(
  props: MultiInputDateRangeFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

const MultiInputDateRangeField = React.forwardRef(function MultiInputDateRangeField<TDate>(
  inProps: MultiInputDateRangeFieldProps<TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiMultiInputDateRangeField',
  });

  const {
    components,
    componentsProps,
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    selectedSections,
    onSelectedSectionsChange,
    disabled,
    ...other
  } = themeProps;

  const ownerState = themeProps;

  const Root = components?.Root ?? MultiInputDateRangeFieldRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: componentsProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ref,
    },
    ownerState,
  });

  const Input = components?.Input ?? TextField;
  const startInputProps: TextFieldProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    ownerState: { ...ownerState, position: 'start' },
    additionalProps: {
      disabled,
      readOnly,
    },
  });

  const endInputProps: TextFieldProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    ownerState: { ...ownerState, position: 'end' },
    additionalProps: {
      disabled,
      readOnly,
    },
  });

  const Separator = components?.Separator ?? MultiInputDateRangeFieldSeparator;
  const separatorProps = useSlotProps({
    elementType: Separator,
    externalSlotProps: componentsProps?.separator,
    ownerState,
  });

  const {
    startDate: { onKeyDown: onStartInputKeyDown, ref: startInputRef, ...startDateProps },
    endDate: { onKeyDown: onEndInputKeyDown, ref: endInputRef, ...endDateProps },
  } = useMultiInputDateRangeField<TDate, TextFieldProps>({
    sharedProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
    },
    startInputProps,
    endInputProps,
    startInputRef: startInputProps.inputRef,
    endInputRef: endInputProps.inputRef,
  });

  return (
    <Root {...rootProps}>
      <Input
        {...startDateProps}
        inputProps={{
          ...startDateProps.inputProps,
          ref: startInputRef,
          onKeyDown: onStartInputKeyDown,
        }}
      />
      <Separator {...separatorProps} />
      <Input
        {...endDateProps}
        inputProps={{
          ...endDateProps.inputProps,
          ref: endInputRef,
          onKeyDown: onEndInputKeyDown,
        }}
      />
    </Root>
  );
}) as MultiInputDateRangeFieldComponent;

MultiInputDateRangeField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
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
   * Minimal selectable date.
   */
  minDate: PropTypes.any,
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
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.arrayOf(PropTypes.any),
} as any;

export { MultiInputDateRangeField };
