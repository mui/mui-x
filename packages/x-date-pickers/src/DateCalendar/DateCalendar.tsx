import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, Theme, useThemeProps } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import {
  unstable_composeClasses as composeClasses,
  unstable_useId as useId,
  unstable_useEventCallback as useEventCallback,
  unstable_useControlled as useControlled,
} from '@mui/utils';
import { useCalendarState } from './useCalendarState';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from './PickersFadeTransitionGroup';
import {
  DayCalendar,
  DayCalendarProps,
  DayCalendarSlotsComponent,
  DayCalendarSlotsComponentsProps,
  ExportedDayCalendarProps,
} from './DayCalendar';
import { MonthCalendar, MonthCalendarProps } from '../MonthCalendar';
import { YearCalendar, YearCalendarProps } from '../YearCalendar';
import { PickerOnChangeFn, useViews } from '../internals/hooks/useViews';
import {
  PickersCalendarHeader,
  ExportedCalendarHeaderProps,
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
} from './PickersCalendarHeader';
import { findClosestEnabledDate, applyDefaultDate } from '../internals/utils/date-utils';
import { CalendarPickerView } from '../internals/models';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { defaultReduceAnimations } from '../internals/utils/defaultReduceAnimations';
import { DateCalendarClasses, getDateCalendarUtilityClass } from './dateCalendarClasses';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/hooks/validation/models';
import { DefaultizedProps } from '../internals/models/helpers';

export interface DateCalendarSlotsComponent<TDate>
  extends PickersCalendarHeaderSlotsComponent,
    DayCalendarSlotsComponent<TDate> {}

export interface DateCalendarSlotsComponentsProps<TDate>
  extends PickersCalendarHeaderSlotsComponentsProps,
    DayCalendarSlotsComponentsProps<TDate> {}

export interface DateCalendarProps<TDate>
  extends ExportedDayCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    DayValidationProps<TDate>,
    YearValidationProps<TDate>,
    MonthValidationProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  autoFocus?: boolean;
  className?: string;
  classes?: Partial<DateCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DateCalendarSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DateCalendarSlotsComponentsProps<TDate>;
  value: TDate | null;
  /**
   * Default calendar month displayed when `value={null}`.
   */
  defaultCalendarMonth?: TDate;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback fired on view change.
   * @param {CalendarPickerView} view The new view.
   */
  onViewChange?: (view: CalendarPickerView) => void;
  /**
   * Callback fired on date change
   */
  onChange: PickerOnChangeFn<TDate>;
  /**
   * Initially open view.
   * @default 'day'
   */
  openTo?: CalendarPickerView;
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations?: boolean;
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading?: () => React.ReactNode;
  /**
   * Controlled open view.
   */
  view?: CalendarPickerView;
  /**
   * Views for calendar picker.
   * @default ['year', 'day']
   */
  views?: readonly CalendarPickerView[];
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange?: (year: TDate) => void;
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange?: (month: TDate) => void | Promise<void>;
  focusedView?: CalendarPickerView | null;
  onFocusedViewChange?: (view: CalendarPickerView) => (newHasFocus: boolean) => void;
}

export type ExportedDateCalendarProps<TDate> = Omit<
  DateCalendarProps<TDate>,
  | 'value'
  | 'view'
  | 'views'
  | 'openTo'
  | 'onChange'
  | 'changeView'
  | 'slideDirection'
  | 'currentMonth'
  | 'className'
  | 'classes'
  | 'components'
  | 'componentsProps'
  | 'onFocusedViewChange'
  | 'focusedView'
>;

export type DateCalendarDefaultizedProps<TDate> = DefaultizedProps<
  DateCalendarProps<TDate>,
  | 'views'
  | 'openTo'
  | 'loading'
  | 'reduceAnimations'
  | 'renderLoading'
  | keyof BaseDateValidationProps<TDate>
>;

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
    value,
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
    view,
    views,
    openTo,
    className,
    disabled,
    readOnly,
    minDate,
    maxDate,
    disableHighlightToday,
    focusedView,
    onFocusedViewChange,
    showDaysOutsideCurrentMonth,
    fixedWeekNumber,
    dayOfWeekFormatter,
    components,
    componentsProps,
    loading,
    renderLoading,
    sx,
  } = props;

  const { openView, setOpenView, openNext } = useViews({
    view,
    views,
    openTo,
    onChange,
    onViewChange,
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

  const handleDateMonthChange = React.useCallback<MonthCalendarProps<TDate>['onChange']>(
    (newDate) => {
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
        onChange(closestEnabledDate, 'finish');
        onMonthChange?.(startOfMonth);
      } else {
        openNext();
        changeMonth(startOfMonth);
      }

      changeFocusedDay(closestEnabledDate, true);
    },
    [
      changeFocusedDay,
      disableFuture,
      disablePast,
      isDateDisabled,
      maxDate,
      minDate,
      onChange,
      onMonthChange,
      changeMonth,
      openNext,
      utils,
    ],
  );

  const handleDateYearChange = React.useCallback<YearCalendarProps<TDate>['onChange']>(
    (newDate) => {
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
        onChange(closestEnabledDate, 'finish');
        onYearChange?.(closestEnabledDate);
      } else {
        openNext();
        changeMonth(startOfYear);
      }

      changeFocusedDay(closestEnabledDate, true);
    },
    [
      changeFocusedDay,
      disableFuture,
      disablePast,
      isDateDisabled,
      maxDate,
      minDate,
      onChange,
      onYearChange,
      openNext,
      utils,
      changeMonth,
    ],
  );

  const onSelectedDayChange = React.useCallback<DayCalendarProps<TDate>['onSelectedDaysChange']>(
    (day, isFinish) => {
      if (value && day) {
        // If there is a date already selected, then we want to keep its time
        return onChange(utils.mergeDateAndTime(day, value), isFinish);
      }

      return onChange(day, isFinish);
    },
    [utils, value, onChange],
  );

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

  const [internalFocusedView, setInternalFocusedView] = useControlled<CalendarPickerView | null>({
    name: 'DayCalendar',
    state: 'focusedView',
    controlled: focusedView,
    default: autoFocus ? openView : null,
  });

  const hasFocus = internalFocusedView !== null;

  const handleFocusedViewChange = useEventCallback(
    (eventView: CalendarPickerView) => (newHasFocus: boolean) => {
      if (onFocusedViewChange) {
        // Use the calendar or clock logic
        onFocusedViewChange(eventView)(newHasFocus);
        return;
      }
      // If alone, do the local modifications
      if (newHasFocus) {
        setInternalFocusedView(eventView);
      } else {
        setInternalFocusedView((prevView) => (prevView === eventView ? null : prevView));
      }
    },
  );

  const prevOpenViewRef = React.useRef(openView);
  React.useEffect(() => {
    // Set focus to the button when switching from a view to another
    if (prevOpenViewRef.current === openView) {
      return;
    }
    prevOpenViewRef.current = openView;
    handleFocusedViewChange(openView)(true);
  }, [openView, handleFocusedViewChange]);

  return (
    <DateCalendarRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      sx={sx}
    >
      <PickersCalendarHeader
        views={views}
        openView={openView}
        currentMonth={calendarState.currentMonth}
        onViewChange={setOpenView}
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
        transKey={openView}
        ownerState={ownerState}
      >
        <div>
          {openView === 'year' && (
            <YearCalendar<TDate>
              {...baseDateValidationProps}
              {...commonViewProps}
              autoFocus={autoFocus}
              value={value}
              onChange={handleDateYearChange}
              shouldDisableYear={shouldDisableYear}
              hasFocus={hasFocus}
              onFocusedViewChange={handleFocusedViewChange('year')}
            />
          )}

          {openView === 'month' && (
            <MonthCalendar<TDate>
              {...baseDateValidationProps}
              {...commonViewProps}
              autoFocus={autoFocus}
              hasFocus={hasFocus}
              className={className}
              value={value}
              onChange={handleDateMonthChange}
              shouldDisableMonth={shouldDisableMonth}
              onFocusedViewChange={handleFocusedViewChange('month')}
            />
          )}

          {openView === 'day' && (
            <DayCalendar<TDate>
              {...calendarState}
              {...baseDateValidationProps}
              {...commonViewProps}
              autoFocus={autoFocus}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              onFocusedDayChange={changeFocusedDay}
              reduceAnimations={reduceAnimations}
              selectedDays={[value]}
              onSelectedDaysChange={onSelectedDayChange}
              shouldDisableDate={shouldDisableDate}
              shouldDisableMonth={shouldDisableMonth}
              shouldDisableYear={shouldDisableYear}
              hasFocus={hasFocus}
              onFocusedViewChange={handleFocusedViewChange('day')}
              gridLabelId={gridLabelId}
              showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
              fixedWeekNumber={fixedWeekNumber}
              dayOfWeekFormatter={dayOfWeekFormatter}
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
  focusedView: PropTypes.oneOf(['day', 'month', 'year']),
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
   * Callback fired on date change
   */
  onChange: PropTypes.func.isRequired,
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
   * @param {CalendarPickerView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange: PropTypes.func,
  /**
   * Initially open view.
   * @default 'day'
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
  /**
   * Controlled open view.
   */
  view: PropTypes.oneOf(['day', 'month', 'year']),
  /**
   * Views for calendar picker.
   * @default ['year', 'day']
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired),
} as any;
