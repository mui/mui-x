'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { StaticDateTimePickerProps } from './StaticDateTimePicker.types';
import {
  DateTimePickerViewRenderers,
  useDateTimePickerDefaultizedProps,
} from '../DateTimePicker/shared';
import { renderTimeViewClock } from '../timeViewRenderers';
import { renderDateViewCalendar } from '../dateViewRenderers';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { useStaticPicker } from '../internals/hooks/useStaticPicker';
import { DateOrTimeView } from '../models';
import { validateDateTime } from '../validation';

type StaticDateTimePickerComponent = ((
  props: StaticDateTimePickerProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DateTimePicker](https://mui.com/x/react-date-pickers/date-time-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [StaticDateTimePicker API](https://mui.com/x/api/date-pickers/static-date-time-picker/)
 */
const StaticDateTimePicker = React.forwardRef(function StaticDateTimePicker(
  inProps: StaticDateTimePickerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const defaultizedProps = useDateTimePickerDefaultizedProps<
    DateOrTimeView,
    StaticDateTimePickerProps
  >(inProps, 'MuiStaticDateTimePicker');

  const displayStaticWrapperAs = defaultizedProps.displayStaticWrapperAs ?? 'mobile';
  const ampmInClock = defaultizedProps.ampmInClock ?? displayStaticWrapperAs === 'desktop';

  const viewRenderers: DateTimePickerViewRenderers<DateOrTimeView, any> = {
    day: renderDateViewCalendar,
    month: renderDateViewCalendar,
    year: renderDateViewCalendar,
    hours: renderTimeViewClock,
    minutes: renderTimeViewClock,
    seconds: renderTimeViewClock,
    ...defaultizedProps.viewRenderers,
  };

  // Props with the default values specific to the static variant
  const props = {
    ...defaultizedProps,
    viewRenderers,
    displayStaticWrapperAs,
    ampmInClock,
    yearsPerRow: defaultizedProps.yearsPerRow ?? (displayStaticWrapperAs === 'mobile' ? 3 : 4),
    slotProps: {
      ...defaultizedProps.slotProps,
      tabs: {
        hidden: displayStaticWrapperAs === 'desktop',
        ...defaultizedProps.slotProps?.tabs,
      },
      toolbar: {
        hidden: displayStaticWrapperAs === 'desktop',
        ampmInClock,
        ...defaultizedProps.slotProps?.toolbar,
      },
    },
  };

  const { renderPicker } = useStaticPicker<DateOrTimeView, typeof props>({
    props,
    valueManager: singleItemValueManager,
    valueType: 'date-time',
    validator: validateDateTime,
    ref,
  });

  return renderPicker();
}) as StaticDateTimePickerComponent;

StaticDateTimePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm: PropTypes.bool,
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default true on desktop, false on mobile
   */
  ampmInClock: PropTypes.bool,
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {PickerValidDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.object,
  /**
   * If `true`, the component is disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
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
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: PropTypes.oneOf(['desktop', 'mobile']),
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber: PropTypes.bool,
  /**
   * The day view will show as many weeks as needed after the end of the current month to match this value.
   * Put it to 6 to have a fixed number of weeks in Gregorian calendars
   */
  fixedWeekNumber: PropTypes.number,
  /**
   * If `true`, calls `renderLoading` instead of rendering the day calendar.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText: PropTypes.object,
  /**
   * Maximal selectable date.
   * @default 2099-12-31
   */
  maxDate: PropTypes.object,
  /**
   * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
   */
  maxDateTime: PropTypes.object,
  /**
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime: PropTypes.object,
  /**
   * Minimal selectable date.
   * @default 1900-01-01
   */
  minDate: PropTypes.object,
  /**
   * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
   */
  minDateTime: PropTypes.object,
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime: PropTypes.object,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
  /**
   * Months rendered per row.
   * @default 3
   */
  monthsPerRow: PropTypes.oneOf([3, 4]),
  /**
   * Callback fired when the value is accepted.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value that was just accepted.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onAccept: PropTypes.func,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when component requests to be closed.
   * Can be fired when selecting (by default on `desktop` mode) or clearing a value.
   * @deprecated Please avoid using as it will be removed in next major version.
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the error associated with the current value changes.
   * When a validation error is detected, the `error` parameter contains a non-null value.
   * This can be used to render an appropriate form error.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {TError} error The reason why the current value is not valid.
   * @param {TValue} value The value associated with the error.
   */
  onError: PropTypes.func,
  /**
   * Callback fired on month change.
   * @param {PickerValidDate} month The new month.
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Callback fired on year change.
   * @param {PickerValidDate} year The new year.
   */
  onYearChange: PropTypes.func,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']),
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  /**
   * If `true`, the component is read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations: PropTypes.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
   */
  referenceDate: PropTypes.object,
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span>...</span>
   */
  renderLoading: PropTypes.func,
  /**
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @param {PickerValidDate} day The date to test.
   * @returns {boolean} If `true` the date will be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific month.
   * @param {PickerValidDate} month The month to test.
   * @returns {boolean} If `true`, the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
  /**
   * Disable specific time.
   * @param {PickerValidDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: PropTypes.func,
  /**
   * Disable specific year.
   * @param {PickerValidDate} year The year to test.
   * @returns {boolean} If `true`, the year will be disabled.
   */
  shouldDisableYear: PropTypes.func,
  /**
   * If `true`, days outside the current month are rendered:
   *
   * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
   *
   * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
   *
   * - ignored if `calendars` equals more than `1` on range pickers.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
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
   * The system prop that allows defining system overrides as well as additional CSS styles.
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
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.object,
  /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */
  view: PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']),
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers: PropTypes.shape({
    day: PropTypes.func,
    hours: PropTypes.func,
    minutes: PropTypes.func,
    month: PropTypes.func,
    seconds: PropTypes.func,
    year: PropTypes.func,
  }),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'minutes', 'month', 'seconds', 'year']).isRequired,
  ),
  /**
   * Years are displayed in ascending (chronological) order by default.
   * If `desc`, years are displayed in descending order.
   * @default 'asc'
   */
  yearsOrder: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Years rendered per row.
   * @default `4` when `displayStaticWrapperAs === 'desktop'`, `3` otherwise.
   */
  yearsPerRow: PropTypes.oneOf([3, 4]),
} as any;

export { StaticDateTimePicker };
