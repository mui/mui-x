import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { PickersDay, PickersDayProps } from '../PickersDay/PickersDay';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { PickerOnChangeFn } from '../internals/hooks/useViews';
import { DAY_SIZE, DAY_MARGIN } from '../internals/constants/dimensions';
import { PickerSelectionState } from '../internals/hooks/usePickerState';
import {
  PickersSlideTransition,
  SlideDirection,
  SlideTransitionProps,
} from './PickersSlideTransition';
import { DayValidationProps } from '../internals/hooks/validation/models';
import { useIsDayDisabled } from '../internals/hooks/validation/useDateValidation';
import { findClosestEnabledDate } from '../internals/utils/date-utils';

export interface ExportedDayPickerProps<TDate>
  extends DayValidationProps<TDate>,
    Pick<PickersDayProps<TDate>, 'disableHighlightToday' | 'showDaysOutsideCurrentMonth'> {
  autoFocus?: boolean;
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading?: boolean;
  /**
   * Custom renderer for day. Check the [PickersDay](https://mui.com/x/api/date-pickers/pickers-day/) component.
   * @template TDate
   * @param {TDate} day The day to render.
   * @param {Array<TDate | null>} selectedDays The days currently selected.
   * @param {PickersDayProps<TDate>} pickersDayProps The props of the day to render.
   * @returns {JSX.Element} The element representing the day.
   */
  renderDay?: (
    day: TDate,
    selectedDays: TDate[],
    pickersDayProps: PickersDayProps<TDate>,
  ) => JSX.Element;
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => "..."
   */
  renderLoading?: () => React.ReactNode;
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {string} day The day of week provided by the adapter's method `getWeekdays`.
   * @returns {string} The name to display.
   * @default (day) => day.charAt(0).toUpperCase()
   */
  dayOfWeekFormatter?: (day: string) => string;
}

export interface DayPickerProps<TDate> extends ExportedDayPickerProps<TDate> {
  autoFocus?: boolean;
  className?: string;
  currentMonth: TDate;
  selectedDays: (TDate | null)[];
  onSelectedDaysChange: PickerOnChangeFn<TDate>;
  disabled?: boolean;
  focusedDay: TDate | null;
  isMonthSwitchingAnimating: boolean;
  onFocusedDayChange: (newFocusedDay: TDate) => void;
  onMonthSwitchingAnimationEnd: () => void;
  readOnly?: boolean;
  reduceAnimations: boolean;
  slideDirection: SlideDirection;
  TransitionProps?: Partial<SlideTransitionProps>;
  onDayBlur?: (day: TDate) => void;
}

const defaultDayOfWeekFormatter = (day: string) => day.charAt(0).toUpperCase();

const weeksContainerHeight = (DAY_SIZE + DAY_MARGIN * 2) * 6;

const PickersCalendarDayHeader = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const PickersCalendarWeekDayLabel = styled(Typography)(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
}));

const PickersCalendarLoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: weeksContainerHeight,
});

const PickersCalendarSlideTransition = styled(PickersSlideTransition)({
  minHeight: weeksContainerHeight,
});

const PickersCalendarWeekContainer = styled('div')({ overflow: 'hidden' });

const PickersCalendarWeek = styled('div')({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

/**
 * @ignore - do not document.
 */
export function DayPicker<TDate>(props: DayPickerProps<TDate>) {
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();
  const {
    autoFocus,
    onFocusedDayChange,
    className,
    currentMonth,
    selectedDays,
    disabled,
    disableHighlightToday,
    focusedDay,
    isMonthSwitchingAnimating,
    loading,
    onSelectedDaysChange,
    onMonthSwitchingAnimationEnd,
    readOnly,
    reduceAnimations,
    renderDay,
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    showDaysOutsideCurrentMonth,
    slideDirection,
    TransitionProps,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    shouldDisableDate,
    dayOfWeekFormatter = defaultDayOfWeekFormatter,
    onDayBlur,
  } = props;

  const isDateDisabled = useIsDayDisabled({
    shouldDisableDate,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const [internalFocusedDay, setInternalFocusedDay] = React.useState<TDate>(
    () => focusedDay || now,
  );

  const handleDaySelect = React.useCallback(
    (day: TDate, isFinish: PickerSelectionState = 'finish') => {
      if (readOnly) {
        return;
      }

      onSelectedDaysChange(day, isFinish);
    },
    [onSelectedDaysChange, readOnly],
  );

  const focusDay = React.useCallback(
    (day: TDate) => {
      if (!isDateDisabled(day)) {
        onFocusedDayChange(day);
        setInternalFocusedDay(day);
      }
    },
    [isDateDisabled, onFocusedDayChange],
  );

  const theme = useTheme();

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, day: TDate) {
    switch (event.key) {
      case 'ArrowUp':
        focusDay(utils.addDays(day, -7));
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusDay(utils.addDays(day, 7));
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusDay(utils.addDays(day, theme.direction === 'ltr' ? -1 : 1));
        event.preventDefault();
        break;
      case 'ArrowRight':
        focusDay(utils.addDays(day, theme.direction === 'ltr' ? 1 : -1));
        event.preventDefault();
        break;
      case 'Home':
        focusDay(utils.startOfWeek(day));
        event.preventDefault();
        break;
      case 'End':
        focusDay(utils.endOfWeek(day));
        event.preventDefault();
        break;
      case 'PageUp':
        focusDay(utils.getNextMonth(day));
        event.preventDefault();
        break;
      case 'PageDown':
        focusDay(utils.getPreviousMonth(day));
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  function handleFocus(event: React.FocusEvent<HTMLButtonElement>, day: TDate) {
    focusDay(day);
  }
  function handleBlur(event: React.FocusEvent<HTMLButtonElement>, day: TDate) {
    if (onDayBlur) {
      onDayBlur(day);
    }
  }

  const currentMonthNumber = utils.getMonth(currentMonth);
  const validSelectedDays = selectedDays
    .filter((day): day is TDate => !!day)
    .map((day) => utils.startOfDay(day));

  // need a new ref whenever the `key` of the transition changes: http://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = currentMonthNumber;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slideNodeRef = React.useMemo(() => React.createRef<HTMLDivElement>(), [transitionKey]);

  let focusableDay: TDate | null = internalFocusedDay;
  const startOfMonth = utils.startOfMonth(currentMonth);
  const endOfMonth = utils.endOfMonth(currentMonth);
  if (
    isDateDisabled(focusableDay) ||
    utils.isAfterDay(focusableDay, endOfMonth) ||
    utils.isBeforeDay(focusableDay, startOfMonth)
  ) {
    focusableDay = findClosestEnabledDate({
      utils,
      date: focusableDay,
      minDate: startOfMonth,
      maxDate: endOfMonth,
      disablePast,
      disableFuture,
      isDateDisabled,
    });
  }
  return (
    <React.Fragment>
      <PickersCalendarDayHeader>
        {utils.getWeekdays().map((day, i) => (
          <PickersCalendarWeekDayLabel aria-hidden key={day + i.toString()} variant="caption">
            {dayOfWeekFormatter?.(day) ?? day}
          </PickersCalendarWeekDayLabel>
        ))}
      </PickersCalendarDayHeader>

      {loading ? (
        <PickersCalendarLoadingContainer>{renderLoading()}</PickersCalendarLoadingContainer>
      ) : (
        <PickersCalendarSlideTransition
          transKey={transitionKey}
          onExited={onMonthSwitchingAnimationEnd}
          reduceAnimations={reduceAnimations}
          slideDirection={slideDirection}
          className={className}
          {...TransitionProps}
          nodeRef={slideNodeRef}
        >
          <PickersCalendarWeekContainer
            data-mui-test="pickers-calendar"
            ref={slideNodeRef}
            role="grid"
          >
            {utils.getWeekArray(currentMonth).map((week) => (
              <PickersCalendarWeek role="row" key={`week-${week[0]}`}>
                {week.map((day) => {
                  const isFocusableDay =
                    focusableDay !== null && utils.isSameDay(day, focusableDay);
                  const pickersDayProps: PickersDayProps<TDate> = {
                    key: (day as any)?.toString(),
                    day,
                    isAnimating: isMonthSwitchingAnimating,
                    disabled: disabled || isDateDisabled(day),
                    autoFocus: autoFocus && isFocusableDay,
                    today: utils.isSameDay(day, now),
                    outsideCurrentMonth: utils.getMonth(day) !== currentMonthNumber,
                    selected: validSelectedDays.some((selectedDay) =>
                      utils.isSameDay(selectedDay, day),
                    ),
                    disableHighlightToday,
                    showDaysOutsideCurrentMonth,
                    onKeyDown: handleKeyDown,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    onDaySelect: handleDaySelect,
                    tabIndex: isFocusableDay ? 0 : -1,
                  };

                  return renderDay ? (
                    renderDay(day, validSelectedDays, pickersDayProps)
                  ) : (
                    <div role="cell" key={pickersDayProps.key}>
                      <PickersDay {...pickersDayProps} />
                    </div>
                  );
                })}
              </PickersCalendarWeek>
            ))}
          </PickersCalendarWeekContainer>
        </PickersCalendarSlideTransition>
      )}
    </React.Fragment>
  );
}
