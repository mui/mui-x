'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import refType from '@mui/utils/refType';
import {
  DIALOG_WIDTH,
  VIEW_HEIGHT,
  isInternalTimeView,
  isDatePickerView,
  PickerViewRenderer,
  TimeViewWithMeridiem,
  resolveDateTimeFormat,
  PickerRangeValue,
  PickerViewRendererLookup,
  PickerRendererInterceptorProps,
  TIME_VIEWS,
} from '@mui/x-date-pickers/internals';
import { extractValidationProps } from '@mui/x-date-pickers/validation';
import { PickerOwnerState } from '@mui/x-date-pickers/models';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import {
  renderDigitalClockTimeView,
  renderMultiSectionDigitalClockTimeView,
} from '@mui/x-date-pickers/timeViewRenderers';
import {
  multiSectionDigitalClockClasses,
  multiSectionDigitalClockSectionClasses,
} from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { digitalClockClasses } from '@mui/x-date-pickers/DigitalClock';
import { usePickerAdapter } from '@mui/x-date-pickers/hooks';
import { rangeValueManager } from '../internals/utils/valueManagers';
import { MobileDateTimeRangePickerProps } from './MobileDateTimeRangePicker.types';
import { renderDateRangeViewCalendar } from '../dateRangeViewRenderers';
import { useMobileRangePicker } from '../internals/hooks/useMobileRangePicker';
import { validateDateTimeRange } from '../validation';
import { DateTimeRangePickerView } from '../internals/models';
import { useDateTimeRangePickerDefaultizedProps } from '../DateTimeRangePicker/shared';
import { SingleInputDateTimeRangeField } from '../SingleInputDateTimeRangeField';
import { DateTimeRangePickerTimeWrapper } from '../DateTimeRangePicker/DateTimeRangePickerTimeWrapper';
import { RANGE_VIEW_HEIGHT } from '../internals/constants/dimensions';
import { usePickerRangePositionContext } from '../hooks';
import { PickerRangeStep } from '../internals/utils/createRangePickerStepNavigation';

const STEPS: PickerRangeStep[] = [
  { views: ['day'], rangePosition: 'start' },
  { views: TIME_VIEWS, rangePosition: 'start' },
  { views: ['day'], rangePosition: 'end' },
  { views: TIME_VIEWS, rangePosition: 'end' },
];

const rendererInterceptor = function RendererInterceptor(
  props: PickerRendererInterceptorProps<PickerRangeValue, DateTimeRangePickerView, any>,
) {
  const { viewRenderers, popperView, rendererProps } = props;
  const { rangePosition } = usePickerRangePositionContext();
  const { view, openTo, ...otherRendererProps } = rendererProps;

  const finalProps = {
    ...otherRendererProps,
    sx: [
      {
        width: DIALOG_WIDTH,
        [`.${multiSectionDigitalClockSectionClasses.root}`]: {
          flex: 1,
          // account for the border on `MultiSectionDigitalClock`
          maxHeight: VIEW_HEIGHT - 1,
          [`.${multiSectionDigitalClockSectionClasses.item}`]: {
            width: 'auto',
          },
        },
        [`&.${digitalClockClasses.root}`]: {
          maxHeight: RANGE_VIEW_HEIGHT,
          [`.${digitalClockClasses.item}`]: {
            justifyContent: 'center',
          },
        },
        [`&.${multiSectionDigitalClockClasses.root}, .${multiSectionDigitalClockSectionClasses.root}`]:
          {
            maxHeight: RANGE_VIEW_HEIGHT - 1,
          },
      },
    ],
  };
  const isTimeView = isInternalTimeView(popperView);
  const viewRenderer = viewRenderers[popperView];
  if (!viewRenderer) {
    return null;
  }
  if (isTimeView) {
    return (
      <DateTimeRangePickerTimeWrapper
        {...finalProps}
        viewRenderer={viewRenderer as PickerViewRenderer<PickerRangeValue, any>}
        view={view && isInternalTimeView(view) ? view : 'hours'}
        views={finalProps.views as TimeViewWithMeridiem[]}
        openTo={isInternalTimeView(openTo) ? openTo : 'hours'}
      />
    );
  }
  // avoiding problem of `props: never`
  const typedViewRenderer = viewRenderer as PickerViewRenderer<PickerRangeValue, any>;

  return typedViewRenderer({
    ...finalProps,
    availableRangePositions: [rangePosition],
    views: finalProps.views.filter(isDatePickerView),
    view: view && isDatePickerView(view) ? view : 'day',
    openTo: isDatePickerView(openTo) ? openTo : 'day',
  });
};

type MobileDateRangePickerComponent = (<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  props: MobileDateTimeRangePickerProps<TEnableAccessibleFieldDOMStructure> &
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
 * - [MobileDateTimeRangePicker API](https://mui.com/x/api/date-pickers/mobile-date-time-range-picker/)
 */
const MobileDateTimeRangePicker = React.forwardRef(function MobileDateTimeRangePicker<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
>(
  inProps: MobileDateTimeRangePickerProps<TEnableAccessibleFieldDOMStructure>,
  ref: React.Ref<HTMLDivElement>,
) {
  const adapter = usePickerAdapter();
  // Props with the default values common to all date time range pickers
  const defaultizedProps = useDateTimeRangePickerDefaultizedProps<
    MobileDateTimeRangePickerProps<TEnableAccessibleFieldDOMStructure>
  >(inProps, 'MuiMobileDateTimeRangePicker');

  const renderTimeView = defaultizedProps.shouldRenderTimeInASingleColumn
    ? renderDigitalClockTimeView
    : renderMultiSectionDigitalClockTimeView;

  const viewRenderers: PickerViewRendererLookup<any, any, any> = {
    day: renderDateRangeViewCalendar,
    hours: renderTimeView,
    minutes: renderTimeView,
    seconds: renderTimeView,
    meridiem: renderTimeView,
    ...defaultizedProps.viewRenderers,
  };

  const props = {
    ...defaultizedProps,
    viewRenderers,
    format: resolveDateTimeFormat(adapter, defaultizedProps, true),
    // Force one calendar on mobile to avoid layout issues
    calendars: 1,
    // force true to correctly handle `renderTimeViewClock` as a renderer
    ampmInClock: true,
    // force current calendar position, since we only have one calendar
    currentMonthCalendarPosition: 1,
    slots: {
      field: SingleInputDateTimeRangeField,
      ...defaultizedProps.slots,
    },
    slotProps: {
      ...defaultizedProps.slotProps,
      field: (ownerState: PickerOwnerState) => ({
        ...resolveComponentProps(defaultizedProps.slotProps?.field, ownerState),
        ...extractValidationProps(defaultizedProps),
      }),
      tabs: {
        hidden: false,
        ...defaultizedProps.slotProps?.tabs,
      },
      toolbar: {
        hidden: false,
        ...defaultizedProps.slotProps?.toolbar,
      },
    },
  };

  const { renderPicker } = useMobileRangePicker<
    DateTimeRangePickerView,
    TEnableAccessibleFieldDOMStructure,
    typeof props
  >({
    ref,
    props,
    valueManager: rangeValueManager,
    valueType: 'date-time',
    validator: validateDateTimeRange,
    rendererInterceptor,
    steps: STEPS,
  });

  return renderPicker();
}) as MobileDateRangePickerComponent;

MobileDateTimeRangePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default adapter.is12HourCycleInCurrentLocale()
   */
  ampm: PropTypes.bool,
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  /**
   * If `true`, the Picker will close after submitting the full date.
   * @default false
   */
  closeOnSelect: PropTypes.bool,
  /**
   * Position the current month is rendered in.
   * @default 1
   */
  currentMonthCalendarPosition: PropTypes.oneOf([1, 2, 3]),
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {PickerValidDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
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
   * If `true`, the component is disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
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
   * If `true`, the button to open the Picker will not be rendered (it will only render the field).
   * @deprecated Use the [field component](https://mui.com/x/react-date-pickers/fields/) instead.
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
   * @default true
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
   */
  inputRef: refType,
  /**
   * The label content.
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
   */
  name: PropTypes.string,
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
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see `open`).
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
   * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
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
  referenceDate: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.object]),
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
   * @param {PickerValidDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific time.
   * @param {PickerValidDate} value The value to check.
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
   * For example, if `timeSteps.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * When single column time renderer is used, only `timeSteps.minutes` will be used.
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

export { MobileDateTimeRangePicker };
