'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_useId as useId,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { DateCalendarProps, DateCalendarDefaultizedProps } from './DateCalendar.types';
import { useCalendarState } from './useCalendarState';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from './PickersFadeTransitionGroup';
import { DayCalendar } from './DayCalendar';
import { MonthCalendar } from '../MonthCalendar';
import { YearCalendar } from '../YearCalendar';
import { useViews } from '../internals/hooks/useViews';
import { PickersCalendarHeader, PickersCalendarHeaderProps } from '../PickersCalendarHeader';
import {
  findClosestEnabledDate,
  applyDefaultDate,
  mergeDateAndTime,
} from '../internals/utils/date-utils';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { useDefaultReduceAnimations } from '../internals/hooks/useDefaultReduceAnimations';
import { DateCalendarClasses, getDateCalendarUtilityClass } from './dateCalendarClasses';
import { BaseDateValidationProps } from '../internals/models/validation';
import { useControlledValueWithTimezone } from '../internals/hooks/useValueWithTimezone';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { VIEW_HEIGHT } from '../internals/constants/dimensions';
import { PickerOwnerState, PickerValidDate } from '../models';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

const useUtilityClasses = (classes: Partial<DateCalendarClasses> | undefined) => {
  const slots = {
    root: ['root'],
    viewTransitionContainer: ['viewTransitionContainer'],
  };

  return composeClasses(slots, getDateCalendarUtilityClass, classes);
};

function useDateCalendarDefaultizedProps(
  props: DateCalendarProps,
  name: string,
): DateCalendarDefaultizedProps {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const defaultReduceAnimations = useDefaultReduceAnimations();
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    ...themeProps,
    loading: themeProps.loading ?? false,
    disablePast: themeProps.disablePast ?? false,
    disableFuture: themeProps.disableFuture ?? false,
    openTo: themeProps.openTo ?? 'day',
    views: themeProps.views ?? ['year', 'day'],
    reduceAnimations: themeProps.reduceAnimations ?? defaultReduceAnimations,
    renderLoading:
      themeProps.renderLoading ?? (() => <span data-testid="loading-progress">...</span>),
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

const DateCalendarRoot = styled(PickerViewRoot, {
  name: 'MuiDateCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: PickerOwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  height: VIEW_HEIGHT,
});

const DateCalendarViewTransitionContainer = styled(PickersFadeTransitionGroup, {
  name: 'MuiDateCalendar',
  slot: 'ViewTransitionContainer',
  overridesResolver: (props, styles) => styles.viewTransitionContainer,
})<{ ownerState: PickerOwnerState }>({});

type DateCalendarComponent = ((
  props: DateCalendarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DatePicker](https://mui.com/x/react-date-pickers/date-picker/)
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [DateCalendar API](https://mui.com/x/api/date-pickers/date-calendar/)
 */
export const DateCalendar = React.forwardRef(function DateCalendar(
  inProps: DateCalendarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils();
  const { ownerState } = usePickerPrivateContext();
  const id = useId();
  const props = useDateCalendarDefaultizedProps(inProps, 'MuiDateCalendar');

  const {
    autoFocus,
    onViewChange,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    disableFuture,
    disablePast,
    onChange,
    onYearChange,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    view: inView,
    views,
    openTo,
    className,
    classes: classesProp,
    disabled,
    readOnly,
    minDate,
    maxDate,
    disableHighlightToday,
    focusedView: inFocusedView,
    onFocusedViewChange,
    showDaysOutsideCurrentMonth,
    fixedWeekNumber,
    dayOfWeekFormatter,
    slots,
    slotProps,
    loading,
    renderLoading,
    displayWeekNumber,
    yearsOrder,
    yearsPerRow,
    monthsPerRow,
    timezone: timezoneProp,
    ...other
  } = props;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'DateCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager: singleItemValueManager,
  });

  const { view, setView, focusedView, setFocusedView, goToNextView, setValueAndGoToNextView } =
    useViews({
      view: inView,
      views,
      openTo,
      onChange: handleValueChange,
      onViewChange,
      autoFocus,
      focusedView: inFocusedView,
      onFocusedViewChange,
    });

  const {
    referenceDate,
    calendarState,
    changeFocusedDay,
    changeMonth,
    handleChangeMonth,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
  } = useCalendarState({
    value,
    referenceDate: referenceDateProp,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture,
    timezone,
  });

  // When disabled, limit the view to the selected date
  const minDateWithDisabled = (disabled && value) || minDate;
  const maxDateWithDisabled = (disabled && value) || maxDate;

  const gridLabelId = `${id}-grid-label`;
  const hasFocus = focusedView !== null;

  const CalendarHeader = slots?.calendarHeader ?? PickersCalendarHeader;
  const calendarHeaderProps: PickersCalendarHeaderProps = useSlotProps({
    elementType: CalendarHeader,
    externalSlotProps: slotProps?.calendarHeader,
    additionalProps: {
      views,
      view,
      currentMonth: calendarState.currentMonth,
      onViewChange: setView,
      onMonthChange: (newMonth, direction) => handleChangeMonth({ newMonth, direction }),
      minDate: minDateWithDisabled,
      maxDate: maxDateWithDisabled,
      disabled,
      disablePast,
      disableFuture,
      reduceAnimations,
      timezone,
      labelId: gridLabelId,
    },
    ownerState,
  });

  const handleDateMonthChange = useEventCallback((newDate: PickerValidDate) => {
    const startOfMonth = utils.startOfMonth(newDate);
    const endOfMonth = utils.endOfMonth(newDate);

    const closestEnabledDate = isDateDisabled(newDate)
      ? findClosestEnabledDate({
          utils,
          date: newDate,
          minDate: utils.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
          maxDate: utils.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
          disablePast,
          disableFuture,
          isDateDisabled,
          timezone,
        })
      : newDate;

    if (closestEnabledDate) {
      setValueAndGoToNextView(closestEnabledDate, 'finish');
      onMonthChange?.(startOfMonth);
    } else {
      goToNextView();
      changeMonth(startOfMonth);
    }

    changeFocusedDay(closestEnabledDate, true);
  });

  const handleDateYearChange = useEventCallback((newDate: PickerValidDate) => {
    const startOfYear = utils.startOfYear(newDate);
    const endOfYear = utils.endOfYear(newDate);

    const closestEnabledDate = isDateDisabled(newDate)
      ? findClosestEnabledDate({
          utils,
          date: newDate,
          minDate: utils.isBefore(minDate, startOfYear) ? startOfYear : minDate,
          maxDate: utils.isAfter(maxDate, endOfYear) ? endOfYear : maxDate,
          disablePast,
          disableFuture,
          isDateDisabled,
          timezone,
        })
      : newDate;

    if (closestEnabledDate) {
      setValueAndGoToNextView(closestEnabledDate, 'finish');
      onYearChange?.(closestEnabledDate);
    } else {
      goToNextView();
      changeMonth(startOfYear);
    }

    changeFocusedDay(closestEnabledDate, true);
  });

  const handleSelectedDayChange = useEventCallback((day: PickerValidDate | null) => {
    if (day) {
      // If there is a date already selected, then we want to keep its time
      return handleValueChange(
        mergeDateAndTime(utils, day, value ?? referenceDate),
        'finish',
        view,
      );
    }

    return handleValueChange(day, 'finish', view);
  });

  React.useEffect(() => {
    if (value != null && utils.isValid(value)) {
      changeMonth(value);
    }
  }, [value]); // eslint-disable-line

  const classes = useUtilityClasses(classesProp);

  const baseDateValidationProps: Required<BaseDateValidationProps> = {
    disablePast,
    disableFuture,
    maxDate,
    minDate,
  };

  const commonViewProps = {
    disableHighlightToday,
    readOnly,
    disabled,
    timezone,
    gridLabelId,
    slots,
    slotProps,
  };

  const prevOpenViewRef = React.useRef(view);
  React.useEffect(() => {
    // If the view change and the focus was on the previous view
    // Then we update the focus.
    if (prevOpenViewRef.current === view) {
      return;
    }

    if (focusedView === prevOpenViewRef.current) {
      setFocusedView(view, true);
    }
    prevOpenViewRef.current = view;
  }, [focusedView, setFocusedView, view]);

  const selectedDays = React.useMemo(() => [value], [value]);

  return (
    <DateCalendarRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <CalendarHeader {...calendarHeaderProps} slots={slots} slotProps={slotProps} />
      <DateCalendarViewTransitionContainer
        reduceAnimations={reduceAnimations}
        className={classes.viewTransitionContainer}
        transKey={view}
        ownerState={ownerState}
      >
        <div>
          {view === 'year' && (
            <YearCalendar
              {...baseDateValidationProps}
              {...commonViewProps}
              value={value}
              onChange={handleDateYearChange}
              shouldDisableYear={shouldDisableYear}
              hasFocus={hasFocus}
              onFocusedViewChange={(isViewFocused) => setFocusedView('year', isViewFocused)}
              yearsOrder={yearsOrder}
              yearsPerRow={yearsPerRow}
              referenceDate={referenceDate}
            />
          )}

          {view === 'month' && (
            <MonthCalendar
              {...baseDateValidationProps}
              {...commonViewProps}
              hasFocus={hasFocus}
              className={className}
              value={value}
              onChange={handleDateMonthChange}
              shouldDisableMonth={shouldDisableMonth}
              onFocusedViewChange={(isViewFocused) => setFocusedView('month', isViewFocused)}
              monthsPerRow={monthsPerRow}
              referenceDate={referenceDate}
            />
          )}

          {view === 'day' && (
            <DayCalendar
              {...calendarState}
              {...baseDateValidationProps}
              {...commonViewProps}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              onFocusedDayChange={changeFocusedDay}
              reduceAnimations={reduceAnimations}
              selectedDays={selectedDays}
              onSelectedDaysChange={handleSelectedDayChange}
              shouldDisableDate={shouldDisableDate}
              shouldDisableMonth={shouldDisableMonth}
              shouldDisableYear={shouldDisableYear}
              hasFocus={hasFocus}
              onFocusedViewChange={(isViewFocused) => setFocusedView('day', isViewFocused)}
              showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
              fixedWeekNumber={fixedWeekNumber}
              dayOfWeekFormatter={dayOfWeekFormatter}
              displayWeekNumber={displayWeekNumber}
              loading={loading}
              renderLoading={renderLoading}
            />
          )}
        </div>
      </DateCalendarViewTransitionContainer>
    </DateCalendarRoot>
  );
}) as DateCalendarComponent;

DateCalendar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {PickerValidDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * The default selected value.
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
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
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
   * Controlled focused view.
   */
  focusedView: PropTypes.oneOf(['day', 'month', 'year']),
  /**
   * If `true`, calls `renderLoading` instead of rendering the day calendar.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
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
   * Months rendered per row.
   * @default 3
   */
  monthsPerRow: PropTypes.oneOf([3, 4]),
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TView The view type. Will be one of date or time views.
   * @param {TValue} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired on focused view change.
   * @template TView
   * @param {TView} view The new view to focus or not.
   * @param {boolean} hasFocus `true` if the view should be focused.
   */
  onFocusedViewChange: PropTypes.func,
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
  openTo: PropTypes.oneOf(['day', 'month', 'year']),
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
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
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
  view: PropTypes.oneOf(['day', 'month', 'year']),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired),
  /**
   * Years are displayed in ascending (chronological) order by default.
   * If `desc`, years are displayed in descending order.
   * @default 'asc'
   */
  yearsOrder: PropTypes.oneOf(['asc', 'desc']),
  /**
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow: PropTypes.oneOf([3, 4]),
} as any;
