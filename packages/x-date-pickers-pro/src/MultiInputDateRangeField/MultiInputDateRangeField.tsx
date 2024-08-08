import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Stack, { StackProps } from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  unstable_composeClasses as composeClasses,
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';
import {
  splitFieldInternalAndForwardedProps,
  convertFieldResponseIntoMuiTextFieldProps,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import {
  MultiInputDateRangeFieldProps,
  MultiInputDateRangeFieldSlotProps,
} from './MultiInputDateRangeField.types';
import { useMultiInputDateRangeField } from '../internals/hooks/useMultiInputRangeField/useMultiInputDateRangeField';
import { MultiInputRangeFieldClasses, RangePosition, UseDateRangeFieldProps } from '../models';

export const multiInputDateRangeFieldClasses: MultiInputRangeFieldClasses = generateUtilityClasses(
  'MuiMultiInputDateRangeField',
  ['root', 'separator'],
);

export const getMultiInputDateRangeFieldUtilityClass = (slot: string) =>
  generateUtilityClass('MuiMultiInputDateRangeField', slot);

const useUtilityClasses = (ownerState: MultiInputDateRangeFieldProps<any, any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    separator: ['separator'],
  };

  return composeClasses(slots, getMultiInputDateRangeFieldUtilityClass, classes);
};

const MultiInputDateRangeFieldRoot = styled(
  React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
    <Stack ref={ref} spacing={2} direction="row" alignItems="center" {...props} />
  )),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputDateRangeFieldSeparator = styled(Typography, {
  name: 'MuiMultiInputDateRangeField',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})({
  lineHeight: '1.4375em', // 23px
});

type MultiInputDateRangeFieldComponent = (<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(
  props: MultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> &
    React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DateRangeField](http://mui.com/x/react-date-pickers/date-range-field/)
 * - [Fields](https://mui.com/x/react-date-pickers/fields/)
 *
 * API:
 *
 * - [MultiInputDateRangeField API](https://mui.com/x/api/multi-input-date-range-field/)
 */
const MultiInputDateRangeField = React.forwardRef(function MultiInputDateRangeField<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(
  inProps: MultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  ref: React.Ref<HTMLDivElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiMultiInputDateRangeField',
  });

  const { internalProps, forwardedProps } = splitFieldInternalAndForwardedProps<
    typeof themeProps,
    keyof Omit<UseDateRangeFieldProps<any, any>, 'clearable' | 'onClear'>
  >(themeProps, 'date');

  const {
    slots,
    slotProps,
    unstableStartFieldRef,
    unstableEndFieldRef,
    className,
    ...otherForwardedProps
  } = forwardedProps;

  const ownerState = themeProps;
  const classes = useUtilityClasses(ownerState);

  const Root = slots?.root ?? MultiInputDateRangeFieldRoot;
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

  const TextField =
    slots?.textField ??
    (inProps.enableAccessibleFieldDOMStructure ? PickersTextField : MuiTextField);
  const startTextFieldProps = useSlotProps<
    typeof TextField,
    MultiInputDateRangeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>['textField'],
    {},
    MultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
      position: RangePosition;
    }
  >({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...ownerState, position: 'start' },
  });
  const endTextFieldProps = useSlotProps<
    typeof TextField,
    MultiInputDateRangeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>['textField'],
    {},
    MultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
      position: RangePosition;
    }
  >({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...ownerState, position: 'end' },
  });

  const Separator = slots?.separator ?? MultiInputDateRangeFieldSeparator;
  const separatorProps = useSlotProps({
    elementType: Separator,
    externalSlotProps: slotProps?.separator,
    additionalProps: {
      children: ` ${internalProps.dateSeparator ?? '–'} `,
    },
    ownerState,
    className: classes.separator,
  });

  const fieldResponse = useMultiInputDateRangeField<
    TDate,
    TEnableAccessibleFieldDOMStructure,
    typeof startTextFieldProps
  >({
    sharedProps: internalProps,
    startTextFieldProps,
    endTextFieldProps,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const startDateProps = convertFieldResponseIntoMuiTextFieldProps(fieldResponse.startDate);
  const endDateProps = convertFieldResponseIntoMuiTextFieldProps(fieldResponse.endDate);

  return (
    <Root {...rootProps}>
      <TextField fullWidth {...startDateProps} />
      <Separator {...separatorProps} />
      <TextField fullWidth {...endDateProps} />
    </Root>
  );
}) as MultiInputDateRangeFieldComponent;

MultiInputDateRangeField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the `input` element is focused during the first mount.
   */
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  component: PropTypes.elementType,
  /**
   * String displayed between the start and the end dates.
   * @default "–"
   */
  dateSeparator: PropTypes.string,
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.object),
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
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Add an element between each child.
   */
  divider: PropTypes.node,
  /**
   * @default false
   */
  enableAccessibleFieldDOMStructure: PropTypes.bool,
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
   * Maximal selectable date.
   * @default 2099-12-31
   */
  maxDate: PropTypes.object,
  /**
   * Minimal selectable date.
   * @default 1900-01-01
   */
  minDate: PropTypes.object,
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
  referenceDate: PropTypes.object,
  /**
   * The currently selected sections.
   * This prop accepts four formats:
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
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
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
   * @default false
   */
  shouldRespectLeadingZeros: PropTypes.bool,
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
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
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
  value: PropTypes.arrayOf(PropTypes.object),
} as any;

export { MultiInputDateRangeField };
