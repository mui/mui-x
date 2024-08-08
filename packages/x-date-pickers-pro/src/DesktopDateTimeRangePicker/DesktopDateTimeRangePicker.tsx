import * as React from 'react';
import PropTypes from 'prop-types';
import {
  DefaultizedProps,
  extractValidationProps,
  isDatePickerView,
  isInternalTimeView,
  PickerViewRenderer,
  PickerViewsRendererProps,
  resolveDateTimeFormat,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import { refType } from '@mui/utils';
import {
  renderDigitalClockTimeView,
  renderMultiSectionDigitalClockTimeView,
} from '@mui/x-date-pickers/timeViewRenderers';
import {
  multiSectionDigitalClockClasses,
  multiSectionDigitalClockSectionClasses,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import Divider from '@mui/material/Divider';
import { digitalClockClasses } from '@mui/x-date-pickers/DigitalClock';
import type { PickersActionBarAction } from '@mui/x-date-pickers/PickersActionBar';
import { DesktopDateTimePickerLayout } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { rangeValueManager } from '../internals/utils/valueManagers';
import { DesktopDateTimeRangePickerProps } from './DesktopDateTimeRangePicker.types';
import { renderDateRangeViewCalendar } from '../dateRangeViewRenderers';
import {
  useDesktopRangePicker,
  UseDesktopRangePickerProps,
} from '../internals/hooks/useDesktopRangePicker';
import { validateDateTimeRange } from '../internals/utils/validation/validateDateTimeRange';
import { DateTimeRangePickerView } from '../internals/models';
import { DateRange } from '../models';
import {
  DateTimeRangePickerRenderers,
  useDateTimeRangePickerDefaultizedProps,
} from '../DateTimeRangePicker/shared';
import { MultiInputDateTimeRangeField } from '../MultiInputDateTimeRangeField';
import { DateTimeRangePickerTimeWrapper } from '../DateTimeRangePicker/DateTimeRangePickerTimeWrapper';
import { RANGE_VIEW_HEIGHT } from '../internals/constants/dimensions';

const rendererInterceptor = function rendererInterceptor<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
>(
  inViewRenderers: DateTimeRangePickerRenderers<TDate, DateTimeRangePickerView, any>,
  popperView: DateTimeRangePickerView,
  rendererProps: PickerViewsRendererProps<
    DateRange<TDate>,
    DateTimeRangePickerView,
    DefaultizedProps<
      Omit<
        UseDesktopRangePickerProps<
          TDate,
          DateTimeRangePickerView,
          TEnableAccessibleFieldDOMStructure,
          any,
          any
        >,
        'onChange' | 'sx' | 'className'
      >,
      'rangePosition' | 'onRangePositionChange' | 'openTo'
    >,
    {}
  >,
) {
  const { openTo, rangePosition, ...otherProps } = rendererProps;
  const finalProps = {
    ...otherProps,
    rangePosition,
    focusedView: null,
    sx: [
      {
        [`&.${multiSectionDigitalClockClasses.root}`]: {
          borderBottom: 0,
        },
        [`&.${multiSectionDigitalClockClasses.root}, .${multiSectionDigitalClockSectionClasses.root}, &.${digitalClockClasses.root}`]:
          {
            maxHeight: RANGE_VIEW_HEIGHT,
          },
      },
    ],
  };
  const isTimeViewActive = isInternalTimeView(popperView);
  return (
    <React.Fragment>
      {inViewRenderers.day?.({
        ...rendererProps,
        availableRangePositions: [rangePosition],
        view: !isTimeViewActive ? popperView : 'day',
        views: rendererProps.views.filter(isDatePickerView),
        sx: [{ gridColumn: 1 }, ...finalProps.sx],
      })}
      <Divider orientation="vertical" sx={{ gridColumn: 2 }} />
      <DateTimeRangePickerTimeWrapper
        {...finalProps}
        view={isTimeViewActive ? popperView : 'hours'}
        views={finalProps.views.filter(isInternalTimeView)}
        openTo={isInternalTimeView(openTo) ? openTo : 'hours'}
        viewRenderer={
          inViewRenderers[isTimeViewActive ? popperView : 'hours'] as PickerViewRenderer<
            DateRange<TDate>,
            DateTimeRangePickerView,
            any,
            {}
          >
        }
        sx={[{ gridColumn: 3 }, ...finalProps.sx]}
      />
    </React.Fragment>
  );
};

type DesktopDateRangePickerComponent = (<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(
  props: DesktopDateTimeRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure> &
    React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DateTimeRangePicker](https://mui.com/x/react-date-pickers/date-time-range-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [DesktopDateTimeRangePicker API](https://mui.com/x/api/date-pickers/desktop-date-time-range-picker/)
 */
const DesktopDateTimeRangePicker = React.forwardRef(function DesktopDateTimeRangePicker<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
>(
  inProps: DesktopDateTimeRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils<TDate>();
  // Props with the default values common to all date time range pickers
  const defaultizedProps = useDateTimeRangePickerDefaultizedProps<
    TDate,
    DesktopDateTimeRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure>
  >(inProps, 'MuiDesktopDateTimeRangePicker');

  const renderTimeView = defaultizedProps.shouldRenderTimeInASingleColumn
    ? renderDigitalClockTimeView
    : renderMultiSectionDigitalClockTimeView;

  const viewRenderers: DateTimeRangePickerRenderers<TDate, DateTimeRangePickerView, any> = {
    day: renderDateRangeViewCalendar,
    hours: renderTimeView,
    minutes: renderTimeView,
    seconds: renderTimeView,
    meridiem: renderTimeView,
    ...defaultizedProps.viewRenderers,
  };

  // Need to avoid adding the `meridiem` view when unexpected renderer is specified
  const shouldHoursRendererContainMeridiemView =
    viewRenderers.hours?.name === renderMultiSectionDigitalClockTimeView.name;
  const views = !shouldHoursRendererContainMeridiemView
    ? defaultizedProps.views.filter((view) => view !== 'meridiem')
    : defaultizedProps.views;
  const actionBarActions: PickersActionBarAction[] =
    defaultizedProps.shouldRenderTimeInASingleColumn ? [] : ['accept'];

  const props = {
    ...defaultizedProps,
    views,
    viewRenderers,
    format: resolveDateTimeFormat(utils, defaultizedProps),
    // force true to correctly handle `renderTimeViewClock` as a renderer
    ampmInClock: true,
    calendars: defaultizedProps.calendars ?? 1,
    slots: {
      field: MultiInputDateTimeRangeField,
      layout: DesktopDateTimePickerLayout,
      ...defaultizedProps.slots,
    },
    slotProps: {
      ...defaultizedProps.slotProps,
      field: (ownerState: any) => ({
        ...resolveComponentProps(defaultizedProps.slotProps?.field, ownerState),
        ...extractValidationProps(defaultizedProps),
        ref,
      }),
      tabs: {
        hidden: true,
        ...defaultizedProps.slotProps?.tabs,
      },
      toolbar: {
        hidden: true,
        toolbarVariant: 'desktop',
        ...defaultizedProps.slotProps?.toolbar,
      },
      actionBar: (ownerState: any) => ({
        actions: actionBarActions,
        ...resolveComponentProps(defaultizedProps.slotProps?.actionBar, ownerState),
      }),
    },
  };

  const { renderPicker } = useDesktopRangePicker<
    TDate,
    DateTimeRangePickerView,
    TEnableAccessibleFieldDOMStructure,
    typeof props
  >({
    props,
    valueManager: rangeValueManager,
    valueType: 'date-time',
    validator: validateDateTimeRange,
    rendererInterceptor,
  });

  return renderPicker();
}) as DesktopDateRangePickerComponent;

DesktopDateTimeRangePicker.propTypes = {
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
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  /**
   * The number of calendars to render on **desktop**.
   * @default 1
   */
  calendars: PropTypes.oneOf([1, 2, 3]),
  className: PropTypes.string,
  /**
   * If `true`, the popover or modal will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect: PropTypes.bool,
  /**
   * Position the current month is rendered in.
   * @default 1
   */
  currentMonthCalendarPosition: PropTypes.oneOf([1, 2, 3]),
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {TDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: TDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * The initial position in the edited date range.
   * Used when the component is not controlled.
   * @default 'start'
   */
  defaultRangePosition: PropTypes.oneOf(['end', 'start']),
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.arrayOf(PropTypes.object),
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching: PropTypes.bool,
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, editing dates by dragging is disabled.
   * @default false
   */
  disableDragEditing: PropTypes.bool,
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
   * If `true`, the open picker button will not be rendered (renders only the field).
   * @default false
   */
  disableOpenPicker: PropTypes.bool,
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * If `true`, the week number will be display in the calendar.
   */
  displayWeekNumber: PropTypes.bool,
  /**
   * @default false
   */
  enableAccessibleFieldDOMStructure: PropTypes.any,
  /**
   * The day view will show as many weeks as needed after the end of the current month to match this value.
   * Put it to 6 to have a fixed number of weeks in Gregorian calendars
   */
  fixedWeekNumber: PropTypes.number,
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format: PropTypes.string,
  /**
   * Density of the format when rendered in the input.
   * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
   * @default "dense"
   */
  formatDensity: PropTypes.oneOf(['dense', 'spacious']),
  /**
   * Pass a ref to the `input` element.
   * Ignored if the field has several inputs.
   */
  inputRef: refType,
  /**
   * The label content.
   * Ignored if the field has several inputs.
   */
  label: PropTypes.node,
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
   * Name attribute used by the `input` element in the Field.
   * Ignored if the field has several inputs.
   */
  name: PropTypes.string,
  /**
   * Callback fired when the value is accepted.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value that was just accepted.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onAccept: PropTypes.func,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see `open`).
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * If the error has a non-null value, then the `TextField` will be rendered in `error` state.
   *
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TError} error The new error describing why the current value is not valid.
   * @param {TValue} value The value associated to the error.
   */
  onError: PropTypes.func,
  /**
   * Callback fired on month change.
   * @template TDate
   * @param {TDate} month The new month.
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see `open`).
   */
  onOpen: PropTypes.func,
  /**
   * Callback fired when the range position changes.
   * @param {RangePosition} rangePosition The new range position.
   */
  onRangePositionChange: PropTypes.func,
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Control the popup or dialog open state.
   * @default false
   */
  open: PropTypes.bool,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: PropTypes.oneOf(['day', 'hours', 'minutes', 'seconds']),
  /**
   * The position in the currently edited date range.
   * Used when the component position is controlled.
   */
  rangePosition: PropTypes.oneOf(['end', 'start']),
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
   * Component rendered on the "day" view when `props.loading` is true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading: PropTypes.func,
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
   * Disable specific time.
   * @template TDate
   * @param {TDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: PropTypes.func,
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
   * If `true`, disabled digital clock items will not be rendered.
   * @default false
   */
  skipDisabled: PropTypes.bool,
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
   * Amount of time options below or at which the single column time renderer is used.
   * @default 24
   */
  thresholdToRenderTimeInASingleColumn: PropTypes.number,
  /**
   * The time steps between two time unit options.
   * For example, if `timeStep.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * When single column time renderer is used, only `timeStep.minutes` will be used.
   * @default{ hours: 1, minutes: 5, seconds: 5 }
   */
  timeSteps: PropTypes.shape({
    hours: PropTypes.number,
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  }),
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
  value: PropTypes.arrayOf(PropTypes.object),
  /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']),
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers: PropTypes.shape({
    day: PropTypes.func,
    hours: PropTypes.func,
    meridiem: PropTypes.func,
    minutes: PropTypes.func,
    seconds: PropTypes.func,
  }),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'hours', 'minutes', 'seconds']).isRequired),
} as any;

export { DesktopDateTimeRangePicker };
