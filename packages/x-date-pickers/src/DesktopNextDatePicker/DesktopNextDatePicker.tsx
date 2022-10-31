import * as React from 'react';
import PropTypes from 'prop-types';
import { resolveComponentProps } from '@mui/base/utils';
import { datePickerValueManager } from '../DatePicker/shared';
import { DesktopNextDatePickerProps } from './DesktopNextDatePicker.types';
import { useNextDatePickerDefaultizedProps } from '../NextDatePicker/shared';
import { CalendarPickerView, useLocaleText } from '../internals';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';
import { Calendar } from '../internals/components/icons';
import { Unstable_DateField as DateField } from '../DateField';
import { extractValidationProps } from '../internals/utils/validation';
import { renderDateView } from '../internals/utils/viewRenderers';

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopNextDatePickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const VIEW_LOOKUP = {
  day: renderDateView,
  month: renderDateView,
  year: renderDateView,
};

const DesktopNextDatePicker = React.forwardRef(function DesktopNextDatePicker<TDate>(
  inProps: DesktopNextDatePickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();

  // Props with the default values common to all date pickers
  const { className, sx, ...defaultizedProps } = useNextDatePickerDefaultizedProps<
    TDate,
    DesktopNextDatePickerProps<TDate>
  >(inProps, 'MuiDesktopNextDatePicker');

  // Props with the default values specific to the desktop variant
  const props = {
    ...defaultizedProps,
    showToolbar: defaultizedProps.showToolbar ?? false,
    autoFocus: true,
    components: {
      OpenPickerIcon: Calendar,
      Field: DateField,
      ...defaultizedProps.components,
    },
    componentsProps: {
      ...defaultizedProps.componentsProps,
      field: (ownerState: any) => ({
        ...resolveComponentProps(defaultizedProps.componentsProps?.field, ownerState),
        ...extractValidationProps(defaultizedProps),
        ref,
        className,
        sx,
        inputRef: defaultizedProps.inputRef,
        label: defaultizedProps.label,
      }),
    },
  };

  const { renderPicker } = useDesktopPicker<TDate, CalendarPickerView, typeof props>({
    props,
    valueManager: datePickerValueManager,
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
    viewLookup: VIEW_LOOKUP,
  });

  return renderPicker();
}) as DesktopDatePickerComponent;

DesktopNextDatePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocus: PropTypes.bool,
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
   * Pass a ref to the `input` element.
   */
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  /**
   * The label content.
   */
  label: PropTypes.node,
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate: PropTypes.any,
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
   * Callback fired on view change.
   * @param {CalendarPickerView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange: PropTypes.func,
  openTo: PropTypes.any.isRequired,
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
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading: PropTypes.func,
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
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  value: PropTypes.any,
  views: PropTypes.any.isRequired,
} as any;

export { DesktopNextDatePicker };
