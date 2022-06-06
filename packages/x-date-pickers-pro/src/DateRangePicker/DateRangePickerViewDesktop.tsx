import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  useDefaultDates,
  useUtils,
  useLocaleText,
  ExportedDateValidationProps,
  PickersArrowSwitcher,
  ExportedArrowSwitcherProps,
  usePreviousMonthDisabled,
  useNextMonthDisabled,
  DayPicker,
  buildDeprecatedPropsWarning,
  DayPickerProps,
} from '@mui/x-date-pickers/internals';
import { calculateRangePreview } from './date-range-manager';
import { DateRange } from '../internal/models';
import { DateRangePickerDay, DateRangePickerDayProps } from '../DateRangePickerDay';
import { isWithinRange, isStartOfRange, isEndOfRange } from '../internal/utils/date-utils';
import { doNothing } from '../internal/utils/utils';

export interface ExportedDesktopDateRangeCalendarProps<TDate> {
  /**
   * The number of calendars that render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Custom renderer for `<DateRangePicker />` days. @DateIOType
   * @example (date, dateRangePickerDayProps) => <DateRangePickerDay {...dateRangePickerDayProps} />
   * @template TDate
   * @param {TDate} day The day to render.
   * @param {DateRangePickerDayProps<TDate>} dateRangePickerDayProps The props of the day to render.
   * @returns {JSX.Element} The element representing the day.
   */
  renderDay?: (day: TDate, dateRangePickerDayProps: DateRangePickerDayProps<TDate>) => JSX.Element;
}

interface DesktopDateRangeCalendarProps<TDate>
  extends ExportedDesktopDateRangeCalendarProps<TDate>,
    Omit<DayPickerProps<TDate>, 'selectedDays' | 'renderDay' | 'onFocusedDayChange'>,
    ExportedDateValidationProps<TDate>,
    ExportedArrowSwitcherProps {
  calendars: 1 | 2 | 3;
  parsedValue: DateRange<TDate>;
  changeMonth: (date: TDate) => void;
  currentlySelectingRangeEnd: 'start' | 'end';
}

const DateRangePickerViewDesktopRoot = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

const DateRangePickerViewDesktopContainer = styled('div')(({ theme }) => ({
  '&:not(:last-of-type)': {
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

const DateRangePickerViewDesktopCalendar = styled(DayPicker)({
  minWidth: 312,
  minHeight: 288,
}) as typeof DayPicker;

const DateRangePickerViewDesktopArrowSwitcher = styled(PickersArrowSwitcher)({
  padding: '16px 16px 8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

function getCalendarsArray(calendars: ExportedDesktopDateRangeCalendarProps<unknown>['calendars']) {
  switch (calendars) {
    case 1:
      return [0];
    case 2:
      return [0, 0];
    case 3:
      return [0, 0, 0];
    // this will not work in IE11, but allows to support any amount of calendars
    default:
      return new Array(calendars).fill(0);
  }
}

const deprecatedPropsWarning = buildDeprecatedPropsWarning(
  'Props for translation are deprecated. See https://mui.com/x/react-date-pickers/localization for more information.',
);

/**
 * @ignore - internal component.
 */
export function DateRangePickerViewDesktop<TDate>(props: DesktopDateRangeCalendarProps<TDate>) {
  const {
    calendars,
    changeMonth,
    components,
    componentsProps,
    currentlySelectingRangeEnd,
    currentMonth,
    parsedValue,
    disableFuture,
    disablePast,
    leftArrowButtonText: leftArrowButtonTextProp,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onSelectedDaysChange,
    renderDay = (_, dateRangeProps) => <DateRangePickerDay {...dateRangeProps} />,
    rightArrowButtonText: rightArrowButtonTextProp,
    ...other
  } = props;

  deprecatedPropsWarning({
    leftArrowButtonText: leftArrowButtonTextProp,
    rightArrowButtonText: rightArrowButtonTextProp,
  });

  const localeText = useLocaleText();

  const leftArrowButtonText = leftArrowButtonTextProp ?? localeText.previousMonth;
  const rightArrowButtonText = rightArrowButtonTextProp ?? localeText.nextMonth;

  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  const [rangePreviewDay, setRangePreviewDay] = React.useState<TDate | null>(null);

  const isNextMonthDisabled = useNextMonthDisabled(currentMonth, { disableFuture, maxDate });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(currentMonth, { disablePast, minDate });

  const previewingRange = calculateRangePreview({
    utils,
    range: parsedValue,
    newDate: rangePreviewDay,
    currentlySelectingRangeEnd,
  });

  const handleSelectedDayChange = React.useCallback<DayPickerProps<TDate>['onSelectedDaysChange']>(
    (day) => {
      setRangePreviewDay(null);
      onSelectedDaysChange(day);
    },
    [onSelectedDaysChange],
  );

  const handlePreviewDayChange = (newPreviewRequest: TDate) => {
    if (!isWithinRange(utils, newPreviewRequest, parsedValue)) {
      setRangePreviewDay(newPreviewRequest);
    } else {
      setRangePreviewDay(null);
    }
  };

  const CalendarTransitionProps = React.useMemo(
    () => ({
      onMouseLeave: () => setRangePreviewDay(null),
    }),
    [],
  );

  const selectNextMonth = React.useCallback(() => {
    changeMonth(utils.getNextMonth(currentMonth));
  }, [changeMonth, currentMonth, utils]);

  const selectPreviousMonth = React.useCallback(() => {
    changeMonth(utils.getPreviousMonth(currentMonth));
  }, [changeMonth, currentMonth, utils]);

  return (
    <DateRangePickerViewDesktopRoot>
      {getCalendarsArray(calendars).map((_, index) => {
        const monthOnIteration = utils.setMonth(currentMonth, utils.getMonth(currentMonth) + index);

        return (
          <DateRangePickerViewDesktopContainer key={index}>
            <DateRangePickerViewDesktopArrowSwitcher
              onLeftClick={selectPreviousMonth}
              onRightClick={selectNextMonth}
              isLeftHidden={index !== 0}
              isRightHidden={index !== calendars - 1}
              isLeftDisabled={isPreviousMonthDisabled}
              isRightDisabled={isNextMonthDisabled}
              leftArrowButtonText={leftArrowButtonText}
              components={components}
              componentsProps={componentsProps}
              rightArrowButtonText={rightArrowButtonText}
            >
              {utils.format(monthOnIteration, 'monthAndYear')}
            </DateRangePickerViewDesktopArrowSwitcher>
            <DateRangePickerViewDesktopCalendar<TDate>
              {...other}
              minDate={minDate}
              maxDate={maxDate}
              disablePast={disablePast}
              disableFuture={disableFuture}
              key={index}
              selectedDays={parsedValue}
              onFocusedDayChange={doNothing}
              onSelectedDaysChange={handleSelectedDayChange}
              currentMonth={monthOnIteration}
              TransitionProps={CalendarTransitionProps}
              renderDay={(day, __, DayProps) =>
                renderDay(day, {
                  isPreviewing: isWithinRange(utils, day, previewingRange),
                  isStartOfPreviewing: isStartOfRange(utils, day, previewingRange),
                  isEndOfPreviewing: isEndOfRange(utils, day, previewingRange),
                  isHighlighting: isWithinRange(utils, day, parsedValue),
                  isStartOfHighlighting: isStartOfRange(utils, day, parsedValue),
                  isEndOfHighlighting: isEndOfRange(utils, day, parsedValue),
                  onMouseEnter: () => handlePreviewDayChange(day),
                  ...DayProps,
                })
              }
            />
          </DateRangePickerViewDesktopContainer>
        );
      })}
    </DateRangePickerViewDesktopRoot>
  );
}
