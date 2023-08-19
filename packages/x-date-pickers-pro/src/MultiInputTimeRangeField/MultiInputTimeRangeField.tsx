import * as React from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import Stack, { StackProps } from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import {
  unstable_composeClasses as composeClasses,
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';
import {
  splitFieldInternalAndForwardedProps,
  FieldsTextFieldProps,
  uncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import { MultiInputTimeRangeFieldProps } from './MultiInputTimeRangeField.types';
import { useMultiInputTimeRangeField } from '../internals/hooks/useMultiInputRangeField/useMultiInputTimeRangeField';
import { UseTimeRangeFieldProps } from '../internals/models/timeRange';
import { MultiInputRangeFieldClasses } from '../models';

export const multiInputTimeRangeFieldClasses: MultiInputRangeFieldClasses = generateUtilityClasses(
  'MuiMultiInputTimeRangeField',
  ['root', 'separator'],
);

export const getMultiInputTimeRangeFieldUtilityClass = (slot: string) =>
  generateUtilityClass('MuiMultiInputTimeRangeField', slot);

const useUtilityClasses = (ownerState: MultiInputTimeRangeFieldProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    separator: ['separator'],
  };

  return composeClasses(slots, getMultiInputTimeRangeFieldUtilityClass, classes);
};

const MultiInputTimeRangeFieldRoot = styled(
  React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
    <Stack ref={ref} spacing={2} direction="row" alignItems="baseline" {...props} />
  )),
  {
    name: 'MuiMultiInputTimeRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputTimeRangeFieldSeparator = styled(
  (props: TypographyProps) => <Typography {...props}>{props.children ?? ' – '}</Typography>,
  {
    name: 'MuiMultiInputTimeRangeField',
    slot: 'Separator',
    overridesResolver: (props, styles) => styles.separator,
  },
)({});

type MultiInputTimeRangeFieldComponent = (<TDate>(
  props: MultiInputTimeRangeFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => React.JSX.Element) & { propTypes?: any };

const MultiInputTimeRangeField = React.forwardRef(function MultiInputTimeRangeField<TDate>(
  inProps: MultiInputTimeRangeFieldProps<TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiMultiInputTimeRangeField',
  });

  const { internalProps: timeFieldInternalProps, forwardedProps } =
    splitFieldInternalAndForwardedProps<
      typeof themeProps,
      keyof Omit<UseTimeRangeFieldProps<any>, 'unstableFieldRef' | 'disabled'>
    >(themeProps, 'time');

  const {
    slots: innerSlots,
    slotProps: innerSlotProps,
    components,
    componentsProps,
    disabled,
    autoFocus,
    unstableStartFieldRef,
    unstableEndFieldRef,
    className,
    ...otherForwardedProps
  } = forwardedProps;

  const slots = innerSlots ?? uncapitalizeObjectKeys(components);
  const slotProps = innerSlotProps ?? componentsProps;

  const ownerState = themeProps;
  const classes = useUtilityClasses(ownerState);

  const Root = slots?.root ?? MultiInputTimeRangeFieldRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: otherForwardedProps,
    additionalProps: {
      ref,
    },
    ownerState,
    className: clsx(className, classes.root),
  });

  const TextField = slots?.textField ?? MuiTextField;
  const startTextFieldProps: FieldsTextFieldProps = useSlotProps({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    additionalProps: { autoFocus },
    ownerState: { ...ownerState, position: 'start' },
  });

  const endTextFieldProps: FieldsTextFieldProps = useSlotProps({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...ownerState, position: 'end' },
  });

  const Separator = slots?.separator ?? MultiInputTimeRangeFieldSeparator;
  const separatorProps = useSlotProps({
    elementType: Separator,
    externalSlotProps: slotProps?.separator,
    ownerState,
    className: classes.separator,
  });

  const {
    startDate: {
      onKeyDown: onStartInputKeyDown,
      ref: startInputRef,
      readOnly: startReadOnly,
      inputMode: startInputMode,
      ...startDateProps
    },
    endDate: {
      onKeyDown: onEndInputKeyDown,
      ref: endInputRef,
      readOnly: endReadOnly,
      inputMode: endInputMode,
      ...endDateProps
    },
  } = useMultiInputTimeRangeField<TDate, FieldsTextFieldProps>({
    sharedProps: { ...timeFieldInternalProps, disabled },
    startTextFieldProps,
    endTextFieldProps,
    startInputRef: startTextFieldProps.inputRef,
    unstableStartFieldRef,
    endInputRef: endTextFieldProps.inputRef,
    unstableEndFieldRef,
  });

  return (
    <Root {...rootProps}>
      <TextField
        fullWidth
        {...startDateProps}
        InputProps={{
          ...startDateProps.InputProps,
          readOnly: startReadOnly,
        }}
        inputProps={{
          ...startDateProps.inputProps,
          ref: startInputRef,
          inputMode: startInputMode,
          onKeyDown: onStartInputKeyDown,
        }}
      />
      <Separator {...separatorProps} />
      <TextField
        fullWidth
        {...endDateProps}
        InputProps={{
          ...endDateProps.InputProps,
          readOnly: endReadOnly,
        }}
        inputProps={{
          ...endDateProps.inputProps,
          ref: endInputRef,
          readOnly: endReadOnly,
          inputMode: endInputMode,
          onKeyDown: onEndInputKeyDown,
        }}
      />
    </Root>
  );
}) as MultiInputTimeRangeFieldComponent;

MultiInputTimeRangeField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm: PropTypes.bool,
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  component: PropTypes.elementType,
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps: PropTypes.object,
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.any),
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   * @default 'column'
   */
  direction: PropTypes.oneOfType([
    PropTypes.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
    PropTypes.arrayOf(PropTypes.oneOf(['column-reverse', 'column', 'row-reverse', 'row'])),
    PropTypes.object,
  ]),
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
   * Add an element between each child.
   */
  divider: PropTypes.node,
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
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
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
   * The date used to generate a part of the new value that is not present in the format when both `value` and `defaultValue` are empty.
   * For example, on time fields it will be used to determine the date to set.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.
   */
  referenceDate: PropTypes.any,
  /**
   * The currently selected sections.
   * This prop accept four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
   * 3. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
   * 4. If `null` is provided, no section will be selected
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: PropTypes.oneOfType([
    PropTypes.oneOf([
      'all',
      'day',
      'hours',
      'meridiem',
      'minutes',
      'month',
      'seconds',
      'weekDay',
      'year',
    ]),
    PropTypes.number,
    PropTypes.shape({
      endIndex: PropTypes.number.isRequired,
      startIndex: PropTypes.number.isRequired,
    }),
  ]),
  /**
   * Disable specific clock time.
   * @param {number} clockValue The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   * @deprecated Consider using `shouldDisableTime`.
   */
  shouldDisableClock: PropTypes.func,
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
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * Defines the space between immediate children.
   * @default 0
   */
  spacing: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]),
  style: PropTypes.object,
  /**
   * The system prop, which allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documention} for more details.
   * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
   */
  timezone: PropTypes.string,
  unstableEndFieldRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  unstableStartFieldRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * If `true`, the CSS flexbox `gap` is used instead of applying `margin` to children.
   *
   * While CSS `gap` removes the [known limitations](https://mui.com/joy-ui/react-stack/#limitations),
   * it is not fully supported in some browsers. We recommend checking https://caniuse.com/?search=flex%20gap before using this flag.
   *
   * To enable this flag globally, follow the [theme's default props](https://mui.com/material-ui/customization/theme-components/#default-props) configuration.
   * @default false
   */
  useFlexGap: PropTypes.bool,
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.arrayOf(PropTypes.any),
} as any;

export { MultiInputTimeRangeField };
