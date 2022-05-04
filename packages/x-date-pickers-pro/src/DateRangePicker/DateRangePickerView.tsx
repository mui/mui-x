import * as React from 'react';
import PropTypes from 'prop-types';
import { Watermark } from '@mui/x-license-pro';
import {
  BasePickerProps,
  useUtils,
  WrapperVariant,
  WrapperVariantContext,
  MobileKeyboardInputView,
  defaultReduceAnimations,
  PickerSelectionState,
  ExportedCalendarPickerProps,
  useCalendarState,
} from '@mui/x-date-pickers/internals';
import { DateRange, CurrentlySelectingRangeEndProps } from '../internal/models/dateRange';
import { isRangeValid } from '../internal/utils/date-utils';
import { calculateRangeChange } from './date-range-manager';
import { DateRangePickerToolbar } from './DateRangePickerToolbar';
import {
  DateRangePickerViewMobile,
  DateRangePickerViewMobileSlotsComponent,
  DateRangePickerViewMobileSlotsComponentsProps,
} from './DateRangePickerViewMobile';
import { DateRangePickerInput, DateRangeInputProps } from './DateRangePickerInput';
import {
  DateRangePickerViewDesktop,
  ExportedDesktopDateRangeCalendarProps,
} from './DateRangePickerViewDesktop';
import { getReleaseInfo } from '../internal/utils/releaseInfo';

const releaseInfo = getReleaseInfo();

export interface DateRangePickerViewSlotsComponent
  extends DateRangePickerViewMobileSlotsComponent {}

export interface DateRangePickerViewSlotsComponentsProps
  extends DateRangePickerViewMobileSlotsComponentsProps {}

export interface ExportedDateRangePickerViewProps<TInputDate, TDate>
  extends ExportedDesktopDateRangeCalendarProps<TDate>,
    Omit<ExportedCalendarPickerProps<TDate>, 'onYearChange' | 'renderDay'>,
    Omit<
      BasePickerProps<DateRange<TInputDate>, TDate, DateRange<TDate>>,
      'value' | 'onChange' | 'orientation'
    > {
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: Partial<DateRangePickerViewSlotsComponent>;
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps?: Partial<DateRangePickerViewSlotsComponentsProps>;
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching?: boolean;
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select date range'
   */
  toolbarTitle?: React.ReactNode;
}

interface DateRangePickerViewProps<TInputDate, TDate>
  extends CurrentlySelectingRangeEndProps,
    ExportedDateRangePickerViewProps<TInputDate, TDate> {
  calendars: 1 | 2 | 3;
  open: boolean;
  startText: React.ReactNode;
  endText: React.ReactNode;
  isMobileKeyboardViewOpen: boolean;
  toggleMobileKeyboardView: () => void;
  DateInputProps: DateRangeInputProps<TInputDate, TDate>;
  date: DateRange<TDate>;
  onDateChange: (
    date: DateRange<TDate>,
    currentWrapperVariant: WrapperVariant,
    isFinish?: PickerSelectionState,
  ) => void;
}

/**
 * @ignore - internal component.
 */
export function DateRangePickerView<TInputDate, TDate>(
  props: DateRangePickerViewProps<TInputDate, TDate>,
) {
  const {
    calendars,
    className,
    currentlySelectingRangeEnd,
    date,
    DateInputProps,
    defaultCalendarMonth,
    disableAutoMonthSwitching = false,
    disableFuture,
    disableHighlightToday,
    disablePast,
    endText,
    isMobileKeyboardViewOpen,
    maxDate,
    minDate,
    onDateChange,
    onMonthChange,
    open,
    reduceAnimations = defaultReduceAnimations,
    setCurrentlySelectingRangeEnd,
    shouldDisableDate,
    showToolbar,
    startText,
    toggleMobileKeyboardView,
    toolbarFormat,
    toolbarTitle,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const [start, end] = date;
  const {
    changeMonth,
    calendarState,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
    changeFocusedDay,
  } = useCalendarState({
    date: start || end,
    defaultCalendarMonth,
    disableFuture,
    disablePast,
    disableSwitchToMonthOnDayFocus: true,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate,
  });

  const toShowToolbar = showToolbar ?? wrapperVariant !== 'desktop';

  const scrollToDayIfNeeded = (day: TDate | null) => {
    if (!day || !utils.isValid(day) || isDateDisabled(day)) {
      return;
    }

    const currentlySelectedDate = currentlySelectingRangeEnd === 'start' ? start : end;
    if (currentlySelectedDate === null) {
      // do not scroll if one of ages is not selected
      return;
    }

    const displayingMonthRange = wrapperVariant === 'mobile' ? 0 : calendars - 1;
    const currentMonthNumber = utils.getMonth(calendarState.currentMonth);
    const requestedMonthNumber = utils.getMonth(day);

    if (
      !utils.isSameYear(calendarState.currentMonth, day) ||
      requestedMonthNumber < currentMonthNumber ||
      requestedMonthNumber > currentMonthNumber + displayingMonthRange
    ) {
      const newMonth =
        currentlySelectingRangeEnd === 'start'
          ? currentlySelectedDate
          : // If need to focus end, scroll to the state when "end" is displaying in the last calendar
            utils.addMonths(currentlySelectedDate, -displayingMonthRange);

      changeMonth(newMonth);
    }
  };

  React.useEffect(() => {
    if (disableAutoMonthSwitching || !open) {
      return;
    }

    scrollToDayIfNeeded(currentlySelectingRangeEnd === 'start' ? start : end);
  }, [currentlySelectingRangeEnd, date]); // eslint-disable-line

  const handleChange = React.useCallback(
    (newDate: TDate | null) => {
      const { nextSelection, newRange } = calculateRangeChange({
        newDate,
        utils,
        range: date,
        currentlySelectingRangeEnd,
      });

      setCurrentlySelectingRangeEnd(nextSelection);

      const isFullRangeSelected =
        currentlySelectingRangeEnd === 'end' && isRangeValid(utils, newRange);

      onDateChange(
        newRange as DateRange<TDate>,
        wrapperVariant,
        isFullRangeSelected ? 'finish' : 'partial',
      );
    },
    [
      currentlySelectingRangeEnd,
      date,
      onDateChange,
      setCurrentlySelectingRangeEnd,
      utils,
      wrapperVariant,
    ],
  );

  const renderView = () => {
    const sharedCalendarProps = {
      date,
      isDateDisabled,
      changeFocusedDay,
      onChange: handleChange,
      reduceAnimations,
      disableHighlightToday,
      onMonthSwitchingAnimationEnd,
      changeMonth,
      currentlySelectingRangeEnd,
      disableFuture,
      disablePast,
      minDate,
      maxDate,
      ...calendarState,
      ...other,
    };

    switch (wrapperVariant) {
      case 'desktop': {
        return <DateRangePickerViewDesktop calendars={calendars} {...sharedCalendarProps} />;
      }

      default: {
        return <DateRangePickerViewMobile {...sharedCalendarProps} />;
      }
    }
  };

  return (
    <div className={className}>
      <Watermark packageName="x-date-pickers-pro" releaseInfo={releaseInfo} />
      {toShowToolbar && (
        <DateRangePickerToolbar
          date={date}
          isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
          toggleMobileKeyboardView={toggleMobileKeyboardView}
          currentlySelectingRangeEnd={currentlySelectingRangeEnd}
          setCurrentlySelectingRangeEnd={setCurrentlySelectingRangeEnd}
          startText={startText}
          endText={endText}
          toolbarTitle={toolbarTitle}
          toolbarFormat={toolbarFormat}
        />
      )}

      {isMobileKeyboardViewOpen ? (
        <MobileKeyboardInputView>
          <DateRangePickerInput disableOpenPicker ignoreInvalidInputs {...DateInputProps} />
        </MobileKeyboardInputView>
      ) : (
        renderView()
      )}
    </div>
  );
}

DateRangePickerView.propTypes = {
  calendars: PropTypes.oneOf([1, 2, 3]),
  disableAutoMonthSwitching: PropTypes.bool,
};
