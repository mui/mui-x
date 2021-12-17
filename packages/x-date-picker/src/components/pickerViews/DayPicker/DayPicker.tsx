import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DayPickerProps } from './DayPickerProps';
import { PickerViewSlideTransition } from '../PickerViewSlideTransition'
import {useDateUtils, useNow} from '../../../hooks/utils/useDateUtils';
import { DAY_MARGIN, DAY_SIZE } from '../../../constants/dimensions';
import { Day, DayProps} from "../Day";

/**
 * TODO: Move to usePickerState
 */
export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

const DayPickerHeader = styled('div', { skipSx: true })({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const DayPickerWeekDayLabel = styled(Typography, { skipSx: true })(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
}));

const weeksContainerHeight = (DAY_SIZE + DAY_MARGIN * 4) * 6;

const DayPickerLoadingContainer = styled('div', { skipSx: true })({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: weeksContainerHeight,
});

const DayPickerWeekContainer = styled('div', { skipSx: true })({ overflow: 'hidden' });

const DayPickerWeek = styled('div', { skipSx: true })({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

const DayPickerSlideTransition = styled(PickerViewSlideTransition, { skipSx: true })({
  minHeight: weeksContainerHeight,
});

export function DayPicker<TDate>(props: DayPickerProps<TDate>) {
  const {
    allowSameDateSelection,
    autoFocus,
    onFocusedDayChange: changeFocusedDay,
    className,
    currentMonth,
    date,
    disabled,
    disableHighlightToday,
    focusedDay,
    isDateDisabled,
    isMonthSwitchingAnimating,
    loading,
    onChange,
    onMonthSwitchingAnimationEnd,
    readOnly,
    reduceAnimations,
    renderDay,
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    showDaysOutsideCurrentMonth,
    slideDirection,
    TransitionProps,
  } = props;

  const now = useNow<TDate>();
  const utils = useDateUtils<TDate>();

  const handleDaySelect = React.useCallback(
      (day: TDate, isFinish: PickerSelectionState = 'finish') => {
        if (readOnly) {
          return;
        }
        // TODO possibly buggy line figure out and add tests
        const finalDate = Array.isArray(date) ? day : utils.mergeDateAndTime(day, date || now);

        onChange(finalDate, isFinish);
      },
      [date, now, onChange, readOnly, utils],
  );

  const currentMonthNumber = utils.getMonth(currentMonth);
  const selectedDates = (Array.isArray(date) ? date : [date])
      .filter(Boolean)
      .map((selectedDateItem) => selectedDateItem && utils.startOfDay(selectedDateItem));

  // need a new ref whenever the `key` of the transition changes: http://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = currentMonthNumber;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slideNodeRef = React.useMemo(() => React.createRef<HTMLDivElement>(), [transitionKey]);

  return (
    <React.Fragment>
      <DayPickerHeader>
        {utils.getWeekdays().map((day, i) => (
          <DayPickerWeekDayLabel aria-hidden key={day + i.toString()} variant="caption">
            {day.charAt(0).toUpperCase()}
          </DayPickerWeekDayLabel>
        ))}
      </DayPickerHeader>
      {loading ? <DayPickerLoadingContainer>{renderLoading()}</DayPickerLoadingContainer> : (
          <DayPickerSlideTransition
              transKey={transitionKey}
              onExited={onMonthSwitchingAnimationEnd}
              reduceAnimations={reduceAnimations}
              slideDirection={slideDirection}
              className={className}
              {...TransitionProps}
              nodeRef={slideNodeRef}
          >
            <DayPickerWeekContainer
                data-mui-test="pickers-calendar"
                ref={slideNodeRef}
                role="grid"
            >
              {utils.getWeekArray(currentMonth).map((week) => (
                  <DayPickerWeek role="row" key={`week-${week[0]}`}>
                    {week.map((day) => {
                      const pickersDayProps: DayProps<TDate> = {
                        key: (day as any)?.toString(),
                        day,
                        isAnimating: isMonthSwitchingAnimating,
                        disabled: disabled || isDateDisabled(day),
                        allowSameDateSelection,
                        autoFocus: autoFocus && focusedDay !== null && utils.isSameDay(day, focusedDay),
                        today: utils.isSameDay(day, now),
                        outsideCurrentMonth: utils.getMonth(day) !== currentMonthNumber,
                        selected: selectedDates.some(
                            (selectedDate) => selectedDate && utils.isSameDay(selectedDate, day),
                        ),
                        disableHighlightToday,
                        showDaysOutsideCurrentMonth,
                        onDayFocus: changeFocusedDay,
                        onDaySelect: handleDaySelect,
                      };

                      return renderDay ? (
                          renderDay(day, selectedDates, pickersDayProps)
                      ) : (
                          <div role="cell" key={pickersDayProps.key}>
                            <Day {...pickersDayProps} />
                          </div>
                      );
                    })}
                  </DayPickerWeek>
              ))}
            </DayPickerWeekContainer>
          </DayPickerSlideTransition>
      )}
    </React.Fragment>
  );
};
