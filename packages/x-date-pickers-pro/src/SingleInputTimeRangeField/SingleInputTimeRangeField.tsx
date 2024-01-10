import * as React from 'react';
import PropTypes from 'prop-types';
import MuiTextField from '@mui/material/TextField';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import { convertFieldResponseIntoMuiTextFieldProps } from '@mui/x-date-pickers/internals';
import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import {
  SingleInputTimeRangeFieldProps,
  SingleInputTimeRangeFieldSlotProps,
} from './SingleInputTimeRangeField.types';
import { useSingleInputTimeRangeField } from './useSingleInputTimeRangeField';

type DateRangeFieldComponent = (<TDate, TTextFieldVersion extends FieldTextFieldVersion = 'v6'>(
  props: SingleInputTimeRangeFieldProps<TDate, TTextFieldVersion> &
    React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any; fieldType?: string };

/**
 * Demos:
 *
 * - [TimeRangeField](http://mui.com/x/react-date-pickers/time-range-field/)
 * - [Fields](https://mui.com/x/react-date-pickers/fields/)
 *
 * API:
 *
 * - [SingleInputTimeRangeField API](https://mui.com/x/api/single-input-time-range-field/)
 */
const SingleInputTimeRangeField = React.forwardRef(function SingleInputTimeRangeField<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
>(
  inProps: SingleInputTimeRangeFieldProps<TDate, TTextFieldVersion>,
  inRef: React.Ref<HTMLDivElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiSingleInputTimeRangeField',
  });

  const { slots, slotProps, InputProps, inputProps, ...other } = themeProps;

  const ownerState = themeProps;

  const TextField =
    slots?.textField ?? (inProps.textFieldVersion === 'v7' ? PickersTextField : MuiTextField);
  const textFieldProps = useSlotProps<
    typeof TextField,
    SingleInputTimeRangeFieldSlotProps<TDate>['textField'],
    SingleInputTimeRangeFieldProps<TDate>,
    SingleInputTimeRangeFieldProps<TDate>
  >({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref: inRef,
    },
  }) as SingleInputTimeRangeFieldProps<TDate, TTextFieldVersion>;

  // TODO: Remove when mui/material-ui#35088 will be merged
  textFieldProps.inputProps = { ...inputProps, ...textFieldProps.inputProps };
  textFieldProps.InputProps = { ...InputProps, ...textFieldProps.InputProps };

  const fieldResponse = useSingleInputTimeRangeField<
    TDate,
    TTextFieldVersion,
    typeof textFieldProps
  >(textFieldProps);
  const convertedFieldResponse = convertFieldResponseIntoMuiTextFieldProps(fieldResponse);

  const processedFieldProps = useClearableField({
    ...convertedFieldResponse,
    slots,
    slotProps,
  });

  return <TextField {...processedFieldProps} />;
}) as DateRangeFieldComponent;

SingleInputTimeRangeField.fieldType = 'single-input';

SingleInputTimeRangeField.propTypes = {
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
   * If `true`, the `input` element is focused during the first mount.
   * @default false
   */
  autoFocus: PropTypes.bool,
  className: PropTypes.any,
  clearable: PropTypes.bool,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   * @default 'primary'
   */
  color: PropTypes.any,
  component: PropTypes.elementType,
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.any),
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * If `true`, the component is displayed in focused state.
   */
  focused: PropTypes.any,
  /**
   * Format of the date when rendered in the input(s).
   */
  format: PropTypes.string,
  /**
   * Density of the format when rendered in the input.
   * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
   * @default "dense"
   */
  formatDensity: PropTypes.oneOf(['dense', 'spacious']),
  /**
   * Props applied to the [`FormHelperText`](/material-ui/api/form-helper-text/) element.
   */
  FormHelperTextProps: PropTypes.any,
  /**
   * If `true`, the input will take up the full width of its container.
   * @default false
   */
  fullWidth: PropTypes.any,
  /**
   * The helper text content.
   */
  helperText: PropTypes.any,
  /**
   * If `true`, the label is hidden.
   * This is used to increase density for a `FilledInput`.
   * Be sure to add `aria-label` to the `input` element.
   * @default false
   */
  hiddenLabel: PropTypes.any,
  /**
   * The id of the `input` element.
   * Use this prop to make `label` and `helperText` accessible for screen readers.
   */
  id: PropTypes.any,
  /**
   * Props applied to the [`InputLabel`](/material-ui/api/input-label/) element.
   * Pointer events like `onClick` are enabled if and only if `shrink` is `true`.
   */
  InputLabelProps: PropTypes.any,
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps: PropTypes.any,
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/material-ui/api/filled-input/),
   * [`OutlinedInput`](/material-ui/api/outlined-input/) or [`Input`](/material-ui/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps: PropTypes.any,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: PropTypes.any,
  /**
   * The label content.
   */
  label: PropTypes.any,
  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   * @default 'none'
   */
  margin: PropTypes.any,
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
  onBlur: PropTypes.any,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TError} error The new error.
   * @param {TValue} value The value associated to the error.
   */
  onError: PropTypes.func,
  onFocus: PropTypes.any,
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
   * The date used to generate a part of the new value that is not present in the format when both `value` and `defaultValue` are empty.
   * For example, on time fields it will be used to determine the date to set.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.
   */
  referenceDate: PropTypes.any,
  /**
   * If `true`, the label is displayed as required and the `input` element is required.
   * @default false
   */
  required: PropTypes.any,
  /**
   * The currently selected sections.
   * This prop accept four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
   * 3. If `"all"` is provided, all the sections will be selected.
   * 4. If `null` is provided, no section will be selected.
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: PropTypes.oneOfType([
    PropTypes.oneOf([
      'all',
      'day',
      'empty',
      'hours',
      'meridiem',
      'minutes',
      'month',
      'seconds',
      'weekDay',
      'year',
    ]),
    PropTypes.number,
  ]),
  /**
   * Disable specific time.
   * @template TDate
   * @param {TDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: PropTypes.func,
  /**
   * If `true`, the format will respect the leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `8/16/2018`)
   * If `false`, the format will always add leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `08/16/2018`)
   *
   * Warning n°1: Luxon is not able to respect the leading zeroes when using macro tokens (e.g: "DD"), so `shouldRespectLeadingZeros={true}` might lead to inconsistencies when using `AdapterLuxon`.
   *
   * Warning n°2: When `shouldRespectLeadingZeros={true}`, the field will add an invisible character on the sections containing a single digit to make sure `onChange` is fired.
   * If you need to get the clean value from the input, you can remove this character using `input.value.replace(/\u200e/g, '')`.
   *
   * Warning n°3: When used in strict mode, dayjs and moment require to respect the leading zeros.
   * This mean that when using `shouldRespectLeadingZeros={false}`, if you retrieve the value directly from the input (not listening to `onChange`) and your format contains tokens without leading zeros, the value will not be parsed by your library.
   *
   * @default `false`
   */
  shouldRespectLeadingZeros: PropTypes.bool,
  /**
   * The size of the component.
   */
  size: PropTypes.any,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  style: PropTypes.any,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.any,
  /**
   * @default 'v6'
   */
  textFieldVersion: PropTypes.oneOf(['v6', 'v7']),
  /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
   * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
   */
  timezone: PropTypes.string,
  /**
   * The ref object used to imperatively interact with the field.
   */
  unstableFieldRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.arrayOf(PropTypes.any),
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant: PropTypes.any,
} as any;

export { SingleInputTimeRangeField };
