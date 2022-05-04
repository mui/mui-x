import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { MonthPicker } from '../MonthPicker/MonthPicker';
import { useCalendarState } from './useCalendarState';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { PickersFadeTransitionGroup } from './PickersFadeTransitionGroup';
import { DayPicker, ExportedDayPickerProps } from './DayPicker';
import { PickerOnChangeFn, useViews } from '../internals/hooks/useViews';
import {
  PickersCalendarHeader,
  ExportedCalendarHeaderProps,
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
} from './PickersCalendarHeader';
import { YearPicker, ExportedYearPickerProps } from '../YearPicker/YearPicker';
import { findClosestEnabledDate } from '../internals/utils/date-utils';
import { CalendarPickerView } from '../internals/models';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { defaultReduceAnimations } from '../internals/utils/defaultReduceAnimations';
import { CalendarPickerClasses, getCalendarPickerUtilityClass } from './calendarPickerClasses';

export interface CalendarPickerSlotsComponent extends PickersCalendarHeaderSlotsComponent {}

export interface CalendarPickerSlotsComponentsProps
  extends PickersCalendarHeaderSlotsComponentsProps {}

export interface CalendarPickerProps<TDate>
  extends ExportedDayPickerProps<TDate>,
    ExportedYearPickerProps<TDate>,
    ExportedCalendarHeaderProps<TDate> {
  className?: string;
  classes?: Partial<CalendarPickerClasses>;
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: Partial<CalendarPickerSlotsComponent>;
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps?: Partial<CalendarPickerSlotsComponentsProps>;
  date: TDate | null;
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
   * @default false
   */
  disableFuture?: boolean;
  /**
   * @default false
   */
  disablePast?: boolean;
  /**
   * Max selectable date. @DateIOType
   */
  maxDate?: TDate;
  /**
   * Min selectable date. @DateIOType
   */
  minDate?: TDate;
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
   * Callback firing on month change. @DateIOType
   * @template TDate
   * @param {TDate} month The new month.
   */
  onMonthChange?: (month: TDate) => void;
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
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to check.
   * @returns {boolean} If `true` the day will be disabled.
   */
  shouldDisableDate?: (day: TDate) => boolean;
  /**
   * Controlled open view.
   */
  view?: CalendarPickerView;
  /**
   * Views for calendar picker.
   * @default ['year', 'day']
   */
  views?: readonly CalendarPickerView[];
}

export type ExportedCalendarPickerProps<TDate> = Omit<
  CalendarPickerProps<TDate>,
  | 'date'
  | 'view'
  | 'views'
  | 'openTo'
  | 'onChange'
  | 'changeView'
  | 'slideDirection'
  | 'currentMonth'
  | 'className'
  | 'classes'
>;

const useUtilityClasses = (
  ownerState: CalendarPickerProps<any> & { classes?: Partial<CalendarPickerClasses> },
) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    viewTransitionContainer: ['viewTransitionContainer'],
  };

  return composeClasses(slots, getCalendarPickerUtilityClass, classes);
};

const CalendarPickerRoot = styled(PickerViewRoot, {
  name: 'MuiCalendarPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: CalendarPickerProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
});

const CalendarPickerViewTransitionContainer = styled(PickersFadeTransitionGroup, {
  name: 'MuiCalendarPicker',
  slot: 'ViewTransitionContainer',
  overridesResolver: (props, styles) => styles.viewTransitionContainer,
})<{ ownerState: CalendarPickerProps<any> }>({
  overflowY: 'auto',
});

type CalendarPickerComponent = (<TDate>(
  props: CalendarPickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/x/react-date-pickers/date-picker/)
 *
 * API:
 *
 * - [CalendarPicker API](https://mui.com/x/api/date-pickers/calendar-picker/)
 */
const CalendarPicker = React.forwardRef(function CalendarPicker<TDate>(
  inProps: CalendarPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiCalendarPicker',
  });

  const {
    autoFocus,
    onViewChange,
    date,
    disableFuture = false,
    disablePast = false,
    defaultCalendarMonth,
    loading = false,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onChange,
    onMonthChange,
    reduceAnimations = defaultReduceAnimations,
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    shouldDisableDate,
    shouldDisableYear,
    view,
    views = ['year', 'day'],
    openTo = 'day',
    className,
    ...other
  } = props;

  const utils = useUtils<TDate>();

  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  const { openView, setOpenView } = useViews({
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
    isDateDisabled,
    handleChangeMonth,
    onMonthSwitchingAnimationEnd,
  } = useCalendarState({
    date,
    defaultCalendarMonth,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture,
  });

  React.useEffect(() => {
    if (date && isDateDisabled(date)) {
      const closestEnabledDate = findClosestEnabledDate<TDate>({
        utils,
        date,
        minDate,
        maxDate,
        disablePast,
        disableFuture,
        shouldDisableDate: isDateDisabled,
      });

      onChange(closestEnabledDate, 'partial');
    }
    // This call is too expensive to run it on each prop change.
    // So just ensure that we are not rendering disabled as selected on mount.
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (date) {
      changeMonth(date);
    }
  }, [date]); // eslint-disable-line

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const monthPickerProps = {
    className,
    date,
    disabled: other.disabled,
    disablePast,
    disableFuture,
    onChange,
    minDate,
    maxDate,
    onMonthChange,
    readOnly: other.readOnly,
  };

  return (
    <CalendarPickerRoot ref={ref} className={clsx(classes.root, className)} ownerState={ownerState}>
      <PickersCalendarHeader
        {...other}
        views={views}
        openView={openView}
        currentMonth={calendarState.currentMonth}
        onViewChange={setOpenView}
        onMonthChange={(newMonth, direction) => handleChangeMonth({ newMonth, direction })}
        minDate={minDate}
        maxDate={maxDate}
        disablePast={disablePast}
        disableFuture={disableFuture}
        reduceAnimations={reduceAnimations}
      />
      <CalendarPickerViewTransitionContainer
        reduceAnimations={reduceAnimations}
        className={classes.viewTransitionContainer}
        transKey={openView}
        ownerState={ownerState}
      >
        <div>
          {openView === 'year' && (
            <YearPicker
              {...other}
              autoFocus={autoFocus}
              date={date}
              onChange={onChange}
              minDate={minDate}
              maxDate={maxDate}
              disableFuture={disableFuture}
              disablePast={disablePast}
              isDateDisabled={isDateDisabled}
              shouldDisableYear={shouldDisableYear}
              onFocusedDayChange={changeFocusedDay}
            />
          )}

          {openView === 'month' && <MonthPicker {...monthPickerProps} />}

          {openView === 'day' && (
            <DayPicker
              {...other}
              {...calendarState}
              autoFocus={autoFocus}
              onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
              onFocusedDayChange={changeFocusedDay}
              reduceAnimations={reduceAnimations}
              date={date}
              onChange={onChange}
              isDateDisabled={isDateDisabled}
              loading={loading}
              renderLoading={renderLoading}
            />
          )}
        </div>
      </CalendarPickerViewTransitionContainer>
    </CalendarPickerRoot>
  );
}) as CalendarPickerComponent;

CalendarPicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, `onChange` is fired on click even if the same date is selected.
   * @default false
   */
  allowSameDateSelection: PropTypes.bool,
  autoFocus: PropTypes.bool,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps: PropTypes.object,
  date: PropTypes.any,
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
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, todays date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Get aria-label text for switching between views button.
   * @param {CalendarPickerView} currentView The view from which we want to get the button text.
   * @returns {string} The label of the view.
   */
  getViewSwitchingButtonText: PropTypes.func,
  /**
   * Left arrow icon aria-label text.
   */
  leftArrowButtonText: PropTypes.string,
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Max selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Min selectable date. @DateIOType
   */
  minDate: PropTypes.any,
  /**
   * Callback fired on date change
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Callback firing on month change. @DateIOType
   * @template TDate
   * @param {TDate} month The new month.
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
   * Custom renderer for day. Check the [PickersDay](https://mui.com/x/api/date-pickers/pickers-day/) component.
   * @template TDate
   * @param {TDate} day The day to render.
   * @param {Array<TDate | null>} selectedDates The dates currently selected.
   * @param {PickersDayProps<TDate>} pickersDayProps The props of the day to render.
   * @returns {JSX.Element} The element representing the day.
   */
  renderDay: PropTypes.func,
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading: PropTypes.func,
  /**
   * Right arrow icon aria-label text.
   */
  rightArrowButtonText: PropTypes.string,
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to check.
   * @returns {boolean} If `true` the day will be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Return `true` if the year should be disabled.
   */
  shouldDisableYear: PropTypes.func,
  /**
   * If `true`, days that have `outsideCurrentMonth={true}` are displayed.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
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

export { CalendarPicker };
