import * as React from 'react';
import PropTypes from 'prop-types';
import {
  BaseDateTimePickerProps,
  useDateTimePickerDefaultizedProps,
  dateTimePickerValueManager,
} from '../DateTimePicker/shared';
import { DateTimePickerToolbar } from '../DateTimePicker/DateTimePickerToolbar';
import {
  DesktopWrapper,
  DesktopWrapperProps,
  DesktopWrapperSlotsComponent,
  DesktopWrapperSlotsComponentsProps,
} from '../internals/components/wrappers/DesktopWrapper';
import {
  CalendarOrClockPicker,
  CalendarOrClockPickerSlotsComponent,
  CalendarOrClockPickerSlotsComponentsProps,
} from '../internals/components/CalendarOrClockPicker';
import { useDateTimeValidation } from '../internals/hooks/validation/useDateTimeValidation';
import { KeyboardDateInput } from '../internals/components/KeyboardDateInput';
import { usePickerState } from '../internals/hooks/usePickerState';
import { DateInputSlotsComponent } from '../internals/components/PureDateInput';
import { DateTimePickerTabs } from '../DateTimePicker/DateTimePickerTabs';

export interface DesktopDateTimePickerSlotsComponent<TDate>
  extends DesktopWrapperSlotsComponent,
    CalendarOrClockPickerSlotsComponent<TDate>,
    DateInputSlotsComponent {}

export interface DesktopDateTimePickerSlotsComponentsProps<TDate>
  extends DesktopWrapperSlotsComponentsProps,
    CalendarOrClockPickerSlotsComponentsProps<TDate> {}

export interface DesktopDateTimePickerProps<TDate>
  extends BaseDateTimePickerProps<TDate>,
    DesktopWrapperProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<DesktopDateTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<DesktopDateTimePickerSlotsComponentsProps<TDate>>;
}

type DesktopDateTimePickerComponent = (<TDate>(
  props: DesktopDateTimePickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 *
 * Demos:
 *
 * - [Date Time Picker](https://mui.com/x/react-date-pickers/date-time-picker/)
 *
 * API:
 *
 * - [DesktopDateTimePicker API](https://mui.com/x/api/date-pickers/desktop-date-time-picker/)
 */
export const DesktopDateTimePicker = React.forwardRef(function DesktopDateTimePicker<TDate>(
  inProps: DesktopDateTimePickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useDateTimePickerDefaultizedProps<TDate, DesktopDateTimePickerProps<TDate>>(
    inProps,
    'MuiDesktopDateTimePicker',
  );

  const validationError = useDateTimeValidation(props) !== null;

  const { pickerProps, inputProps, wrapperProps } = usePickerState(
    props,
    dateTimePickerValueManager,
  );

  const {
    onChange,
    ToolbarComponent = DateTimePickerToolbar,
    value,
    components: providedComponents,
    componentsProps,
    localeText,
    hideTabs = true,
    ...other
  } = props;
  const components = React.useMemo<DesktopDateTimePickerProps<TDate>['components']>(
    () => ({ Tabs: DateTimePickerTabs, ...providedComponents }),
    [providedComponents],
  );

  const AllDateInputProps = {
    ...inputProps,
    ...other,
    components,
    componentsProps,
    ref,
    validationError,
  };

  return (
    <DesktopWrapper
      {...wrapperProps}
      DateInputProps={AllDateInputProps}
      KeyboardDateInputComponent={KeyboardDateInput}
      components={components}
      componentsProps={componentsProps}
      localeText={localeText}
    >
      <CalendarOrClockPicker
        {...pickerProps}
        autoFocus
        toolbarTitle={props.label || props.toolbarTitle}
        ToolbarComponent={ToolbarComponent}
        DateInputProps={AllDateInputProps}
        components={components}
        componentsProps={componentsProps}
        hideTabs={hideTabs}
        {...other}
      />
    </DesktopWrapper>
  );
}) as DesktopDateTimePickerComponent;

DesktopDateTimePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Regular expression to detect "accepted" symbols.
   * @default /\dap/gi
   */
  acceptRegex: PropTypes.instanceOf(RegExp),
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm: PropTypes.bool,
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock: PropTypes.bool,
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  /**
   * className applied to the root component.
   */
  className: PropTypes.string,
  /**
   * If `true` the popup or dialog will immediately close after submitting full date.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect: PropTypes.bool,
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
   * Date tab icon.
   */
  dateRangeIcon: PropTypes.node,
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {string} day The day of week provided by the adapter's method `getWeekdays`.
   * @returns {string} The name to display.
   * @default (day) => day.charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * Default calendar month displayed when `value={null}`.
   */
  defaultCalendarMonth: PropTypes.any,
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true` disable values before the current time
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * Disable mask on the keyboard, this should be used rarely. Consider passing proper mask for your format.
   * @default false
   */
  disableMaskedInput: PropTypes.bool,
  /**
   * Do not render open picker button (renders only text field with validation).
   * @default false
   */
  disableOpenPicker: PropTypes.bool,
  /**
   * If `true` disable values after the current time.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Calendar will show more weeks in order to match this value.
   * Put it to 6 for having fix number of week in Gregorian calendars
   * @default undefined
   */
  fixedWeekNumber: PropTypes.number,
  /**
   * Get aria-label text for control that opens picker dialog. Aria-label text must include selected date. @DateIOType
   * @template TDate
   * @param {TDate | null} date The date from which we want to add an aria-text.
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @returns {string} The aria-text to render inside the dialog.
   * @default (date, utils) => `Choose date, selected date is ${utils.format(date, 'fullDate')}`
   */
  getOpenDialogAriaText: PropTypes.func,
  /**
   * Toggles visibility of date time switching tabs
   * @default false for mobile, true for desktop
   */
  hideTabs: PropTypes.bool,
  ignoreInvalidInputs: PropTypes.bool,
  /**
   * Props to pass to keyboard input adornment.
   */
  InputAdornmentProps: PropTypes.object,
  /**
   * Format string.
   */
  inputFormat: PropTypes.string,
  InputProps: PropTypes.object,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  label: PropTypes.node,
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Locale for components texts
   */
  localeText: PropTypes.object,
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   */
  mask: PropTypes.string,
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime: PropTypes.any,
  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime: PropTypes.any,
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate: PropTypes.any,
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime: PropTypes.any,
  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime: PropTypes.any,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
  /**
   * Callback fired when date is accepted @DateIOType.
   * @template TValue
   * @param {TValue} value The value that was just accepted.
   */
  onAccept: PropTypes.func,
  /**
   * Callback fired when the value (the selected date) changes @DateIOType.
   * @template TValue
   * @param {TValue} value The new value.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see open).
   */
  onClose: PropTypes.func,
  /**
   * Callback that fired when input value or new `value` prop validation returns **new** validation error (or value is valid after error).
   * In case of validation error detected `reason` prop return non-null value and `TextField` must be displayed in `error` state.
   * This can be used to render appropriate form error.
   *
   * [Read the guide](https://next.material-ui-pickers.dev/guides/forms) about form integration and error displaying.
   * @DateIOType
   *
   * @template TError, TValue
   * @param {TError} reason The reason why the current value is not valid.
   * @param {TValue} value The invalid value.
   */
  onError: PropTypes.func,
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see open).
   */
  onOpen: PropTypes.func,
  /**
   * Callback fired on view change.
   * @param {CalendarOrClockPickerView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange: PropTypes.func,
  /**
   * Control the popup or dialog open state.
   */
  open: PropTypes.bool,
  /**
   * Props to pass to keyboard adornment button.
   */
  OpenPickerButtonProps: PropTypes.object,
  /**
   * First view to show.
   * Must be a valid option from `views` list
   * @default 'day'
   */
  openTo: PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']),
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  /**
   * Make picker read only.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations: PropTypes.bool,
  /**
   * The `renderInput` prop allows you to customize the rendered input.
   * The `props` argument of this render prop contains props of [TextField](https://mui.com/material-ui/api/text-field/#props) that you need to forward.
   * Pay specific attention to the `ref` and `inputProps` keys.
   * @example ```jsx
   * renderInput={props => <TextField {...props} />}
   * ````
   * @param {MuiTextFieldPropsType} props The props of the input.
   * @returns {React.ReactNode} The node to render as the input.
   */
  renderInput: PropTypes.func.isRequired,
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading: PropTypes.func,
  /**
   * Custom formatter to be passed into Rifm component.
   * @param {string} str The un-formatted string.
   * @returns {string} The formatted string.
   */
  rifmFormatter: PropTypes.func,
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific months dynamically.
   * Works like `shouldDisableDate` but for month selection view @DateIOType.
   * @template TDate
   * @param {TDate} month The month to check.
   * @returns {boolean} If `true` the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} view The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime: PropTypes.func,
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Returns `true` if the year should be disabled.
   */
  shouldDisableYear: PropTypes.func,
  /**
   * If `true`, days that have `outsideCurrentMonth={true}` are displayed.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  /**
   * If `true`, show the toolbar even in desktop mode.
   */
  showToolbar: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Time tab icon.
   */
  timeIcon: PropTypes.node,
  /**
   * Component that will replace default toolbar renderer.
   * @default DateTimePickerToolbar
   */
  ToolbarComponent: PropTypes.elementType,
  /**
   * Date format, that is displaying in toolbar.
   */
  toolbarFormat: PropTypes.string,
  /**
   * Mobile picker date value placeholder, displaying if `value` === `null`.
   * @default '–'
   */
  toolbarPlaceholder: PropTypes.node,
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select date & time'
   */
  toolbarTitle: PropTypes.node,
  /**
   * The value of the picker.
   */
  value: PropTypes.any,
  /**
   * Array of views to show.
   * @default ['year', 'day', 'hours', 'minutes']
   */
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired,
  ),
} as any;
