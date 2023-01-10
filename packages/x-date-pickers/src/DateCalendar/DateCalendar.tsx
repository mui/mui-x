import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_useId as useId,
  unstable_useEventCallback as useEventCallback,
  unstable_useControlled as useControlled,
} from '@mui/utils';
import { DateCalendarProps, DateCalendarDefaultizedProps } from './DateCalendar.types';
import { useCalendarState } from './useCalendarState';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from './PickersFadeTransitionGroup';
import { DayCalendar } from './DayCalendar';
import { MonthCalendar } from '../MonthCalendar';
import { YearCalendar } from '../YearCalendar';
import { useViews } from '../internals/hooks/useViews';
import { PickersCalendarHeader } from './PickersCalendarHeader';
import { findClosestEnabledDate, applyDefaultDate } from '../internals/utils/date-utils';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { defaultReduceAnimations } from '../internals/utils/defaultReduceAnimations';
import { getDateCalendarUtilityClass } from './dateCalendarClasses';
import { BaseDateValidationProps } from '../internals/hooks/validation/models';
import { PickerSelectionState } from '../internals/hooks/usePickerState';

const useUtilityClasses = (ownerState: DateCalendarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    viewTransitionContainer: ['viewTransitionContainer'],
  };

  return composeClasses(slots, getDateCalendarUtilityClass, classes);
};

function useDateCalendarDefaultizedProps<TDate>(
  props: DateCalendarProps<TDate>,
  name: string,
): DateCalendarDefaultizedProps<TDate> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    loading: false,
    disablePast: false,
    disableFuture: false,
    openTo: 'day',
    views: ['year', 'day'],
    reduceAnimations: defaultReduceAnimations,
    renderLoading: () => <span data-mui-test="loading-progress">...</span>,
    ...themeProps,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

const DateCalendarRoot = styled(PickerViewRoot, {
  name: 'MuiDateCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: DateCalendarProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
});

const DateCalendarViewTransitionContainer = styled(PickersFadeTransitionGroup, {
  name: 'MuiDateCalendar',
  slot: 'ViewTransitionContainer',
  overridesResolver: (props, styles) => styles.viewTransitionContainer,
})<{ ownerState: DateCalendarProps<any> }>({});

type DateCalendarComponent = (<TDate>(
  props: DateCalendarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/x/react-date-pickers/date-picker/)
 *
 * API:
 *
 * - [DateCalendar API](https://mui.com/x/api/date-pickers/date-calendar/)
 */
export const DateCalendar = React.forwardRef(function DateCalendar<TDate>(
  inProps: DateCalendarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils<TDate>();
  const id = useId();
  const props = useDateCalendarDefaultizedProps(inProps, 'MuiDateCalendar');

  const {
    autoFocus,
    onViewChange,
    value: valueProp,
    defaultValue,
    disableFuture,
    disablePast,
    defaultCalendarMonth,
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
    components,
    componentsProps,
    loading,
    renderLoading,
    displayWeekNumber,
    sx,
  } = props;

  const [value, setValue] = useControlled({
    name: 'DateCalendar',
    state: 'value',
    controlled: valueProp,
    default: defaultValue ?? null,
  });

  const handleValueChange = useEventCallback(
    (newValue: TDate | null, selectionState?: PickerSelectionState) => {
      setValue(newValue);
      onChange?.(newValue, selectionState);
    },
  );

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
    calendarState,
    changeFocusedDay,
    changeMonth,
    handleChangeMonth,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
  } = useCalendarState({
    value,
    defaultCalendarMonth,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture,
  });

  const handleDateMonthChange = useEventCallback((newDate: TDate) => {
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

  const handleDateYearChange = useEventCallback((newDate: TDate) => {
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

  const handleSelectedDayChange = useEventCallback((day: TDate | null) => {
    if (value && day) {
      // If there is a date already selected, then we want to keep its time
      return setValueAndGoToNextView(utils.mergeDateAndTime(day, value), 'finish');
    }

    return setValueAndGoToNextView(day, 'finish');
  });

  React.useEffect(() => {
    if (value != null && utils.isValid(value)) {
      changeMonth(value);
    }
  }, [value]); // eslint-disable-line

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const baseDateValidationProps: Required<BaseDateValidationProps<TDate>> = {
    disablePast,
    disableFuture,
    maxDate,
    minDate,
  };

  // When disabled, limit the view to the selected date
  const minDateWithDisabled = (disabled && value) || minDate;
  const maxDateWithDisabled = (disabled && value) || maxDate;

  const commonViewProps = {
    disableHighlightToday,
    readOnly,
    disabled,
  };

  const gridLabelId = `${id}-grid-label`;
  const hasFocus = focusedView !== null;

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
      sx={sx}
    >
      <PickersCalendarHeader
        views={views}
        view={view}
        currentMonth={calendarState.currentMonth}
        onViewChange={setView}
        onMonthChange={(newMonth, direction) => handleChangeMonth({ newMonth, direction })}
        minDate={minDateWithDisabled}
        maxDate={maxDateWithDisabled}
        disabled={disabled}
        disablePast={disablePast}
        disableFuture={disableFuture}
        reduceAnimations={reduceAnimations}
        labelId={gridLabelId}
        components={components}
        componentsProps={componentsProps}
      />
      <DateCalendarViewTransitionContainer
        reduceAnimations={reduceAnimations}
        className={classes.viewTransitionContainer}
        transKey={view}
        ownerState={ownerState}
      >
        <div>
          {view === 'year' && (
            <YearCalendar<TDate>
              {...baseDateValidationProps}
              {...commonViewProps}
              value={value}
              onChange={handleDateYearChange}
              shouldDisableYear={shouldDisableYear}
              hasFocus={hasFocus}
              onFocusedViewChange={(isViewFocused) => setFocusedView('year', isViewFocused)}
            />
          )}

          {view === 'month' && (
            <MonthCalendar<TDate>
              {...baseDateValidationProps}
              {...commonViewProps}
              hasFocus={hasFocus}
              className={className}
              value={value}
              onChange={handleDateMonthChange}
              shouldDisableMonth={shouldDisableMonth}
              onFocusedViewChange={(isViewFocused) => setFocusedView('month', isViewFocused)}
            />
          )}

          {view === 'day' && (
            <DayCalendar<TDate>
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
              gridLabelId={gridLabelId}
              showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
              fixedWeekNumber={fixedWeekNumber}
              dayOfWeekFormatter={dayOfWeekFormatter}
              displayWeekNumber={displayWeekNumber}
              components={components}
              componentsProps={componentsProps}
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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  classes: PropTypes.object,
  className: PropTypes.string,
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
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.any,
  /**
   * If `true`, the picker and text field are disabled.
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
   * Calendar will show more weeks in order to match this value.
   * Put it to 6 for having fix number of week in Gregorian calendars
   * @default undefined
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
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date.
   */
  minDate: PropTypes.any,
  /**
   * Months rendered per row.
   * @default 3
   */
  monthsPerRow: PropTypes.oneOf([3, 4]),
  /**
   * Callback fired when the value changes.
   * @template TDate
   * @param {TDate | null} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
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
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange: PropTypes.func,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: PropTypes.oneOf(['day', 'month', 'year']),
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
   * Disable specific date.
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} If `true` the date will be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific month.
   * @template TDate
   * @param {TDate} month The month to test.
   * @returns {boolean} If `true`, the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
  /**
   * Disable specific year.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} If `true`, the year will be disabled.
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
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.any,
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
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow: PropTypes.oneOf([3, 4]),
} as any;
