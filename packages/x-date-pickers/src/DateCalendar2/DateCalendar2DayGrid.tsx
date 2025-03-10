'use client';
import * as React from 'react';
import clsx from 'clsx';
import CSSTransition, { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { useTheme } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar, useCalendarContext } from '../internals/base/Calendar';
import { usePickerTranslations } from '../hooks';
import { useUtils } from '../internals/hooks/useUtils';
import { useDateCalendar2Context, useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';
import {
  DateCalendar2DayCell,
  DateCalendar2DayCellSkeleton,
  DateCalendar2DayGridBody,
  DateCalendar2DayGridBodyNoTransition,
  DateCalendar2DayGridBodyTransitionGroup,
  DateCalendar2DayGridHeader,
  DateCalendar2DayGridHeaderCell,
  DateCalendar2DayGridRow,
  DateCalendar2DayGridWeekNumberCell,
  DateCalendar2DayGridWeekNumberHeaderCell,
  DaysCalendar2DayGridRoot,
} from './DateCalendar2.parts';

const WrappedDayCell = React.forwardRef(function WrappedDayCell(
  props: React.HTMLAttributes<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();

  const DayCell = slots?.dayCell ?? DateCalendar2DayCell;
  const dayCellProps = useSlotProps({
    elementType: DayCell,
    externalSlotProps: slotProps?.dayCell,
    externalForwardedProps: props,
    ownerState,
    className: classes.dayCell,
    additionalProps: { ref },
  });

  return <DayCell {...dayCellProps} />;
});

const renderDayGrid = (props: any) => <DaysCalendar2DayGridRoot {...props} />;
const renderDayGridHeader = (props: any) => <DateCalendar2DayGridHeader {...props} />;
const renderDayGridBody = (props: any) => <DateCalendar2DayGridBody {...props} />;
const renderDayGridHeaderCell = (props: any) => (
  <DateCalendar2DayGridHeaderCell variant="caption" {...props} />
);
const renderRow = (props: any) => <DateCalendar2DayGridRow {...props} />;
const renderDay = (props: any) => <WrappedDayCell {...props} />;

const WrappedDateCalendar2DayGridBody = React.forwardRef(function WrappedDateCalendar2DayGridBody(
  props: Pick<Calendar.DayGridBody.Props, 'freezeMonth'>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { freezeMonth } = props;
  const translations = usePickerTranslations();
  const { classes, displayWeekNumber, fixedWeekNumber } = useDateCalendar2PrivateContext();
  const utils = useUtils();

  const children = React.useCallback<
    Exclude<Calendar.DayGridBody.Props['children'], undefined | React.ReactNode>
  >(
    ({ weeks }) =>
      weeks.map((week) => (
        <Calendar.DayGridRow
          render={renderRow}
          value={week}
          className={classes.dayGridRow}
          key={week.toString()}
        >
          {({ days }) => {
            const weekNumber = displayWeekNumber ? utils.getWeekNumber(days[0]) : 0;

            return (
              <React.Fragment>
                {displayWeekNumber && (
                  <DateCalendar2DayGridWeekNumberCell
                    role="rowheader"
                    aria-label={translations.calendarWeekNumberAriaLabelText(weekNumber)}
                    className={classes.dayGridWeekNumberCell}
                  >
                    {translations.calendarWeekNumberText(weekNumber)}
                  </DateCalendar2DayGridWeekNumberCell>
                )}
                {days.map((day) => (
                  <Calendar.DayCell
                    render={renderDay}
                    value={day}
                    className={classes.dayCell}
                    key={day.toString()}
                  />
                ))}
              </React.Fragment>
            );
          }}
        </Calendar.DayGridRow>
      )),
    [
      classes.dayGridRow,
      classes.dayCell,
      classes.dayGridWeekNumberCell,
      translations,
      utils,
      displayWeekNumber,
    ],
  );

  return (
    <Calendar.DayGridBody
      ref={ref}
      className={classes.dayGridBody}
      fixedWeekNumber={fixedWeekNumber}
      freezeMonth={freezeMonth}
      render={renderDayGridBody}
    >
      {children}
    </Calendar.DayGridBody>
  );
});

function WrappedDateCalendar2DayGridBodyWithTransition(props: Partial<CSSTransitionProps>) {
  const { onExit, ...other } = props;
  const theme = useTheme();
  const ref = React.createRef<HTMLDivElement>();

  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      timeout={theme.transitions.duration.complex}
      nodeRef={ref}
      {...other}
    >
      <WrappedDateCalendar2DayGridBody ref={ref} freezeMonth={!props.in} />
    </CSSTransition>
  );
}

const DateCalendar2DayGridLoadingPanel = React.memo(function DateCalendar2DayGridLoadingPanel(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const { classes, displayWeekNumber } = useDateCalendar2PrivateContext();

  const isDayHidden = (weekIndex: number, dayIndex: number, weekAmount: number) => {
    if (weekIndex === 0 && dayIndex === 0) {
      return true;
    }

    if (weekIndex === weekAmount - 1 && dayIndex > 3) {
      return true;
    }

    return false;
  };

  return (
    <DateCalendar2DayGridBody className={clsx(className, classes.dayGridBody)} {...other}>
      {Array.from({ length: 4 }, (_, weekIndex) => (
        <DateCalendar2DayGridRow key={weekIndex} className={classes.dayGridRow}>
          {displayWeekNumber && (
            <DateCalendar2DayGridWeekNumberCell className={classes.dayGridWeekNumberCell} />
          )}
          {Array.from({ length: 7 }, (_day, dayIndex) => (
            <DateCalendar2DayCellSkeleton
              key={dayIndex}
              className={classes.dayCellSkeleton}
              variant="circular"
              data-outside-month={isDayHidden(weekIndex, dayIndex, 4)}
            />
          ))}
        </DateCalendar2DayGridRow>
      ))}
    </DateCalendar2DayGridBody>
  );
});

export const DateCalendar2DayGrid = React.forwardRef(function DateCalendar2DayGrid(
  props: React.HTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const translations = usePickerTranslations();
  const utils = useUtils();
  const { visibleDate } = useCalendarContext();
  const { classes, loading, labelId, displayWeekNumber } = useDateCalendar2PrivateContext();
  const { reduceAnimations } = useDateCalendar2Context();
  const renderLoadingPanel = useLoadingPanel({
    defaultComponent: DateCalendar2DayGridLoadingPanel,
  });

  // We need a new ref whenever the `key` of the transition changes: https://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = utils.formatByString(
    visibleDate,
    `${utils.formats.year}-${utils.formats.month}`,
  );

  const prevVisibleDate = React.useRef(visibleDate);
  const slideDirection = utils.isBefore(prevVisibleDate.current, visibleDate) ? 'left' : 'right';

  React.useEffect(() => {
    prevVisibleDate.current = visibleDate;
  }, [visibleDate]);

  return (
    <Calendar.DayGrid
      aria-labelledby={labelId}
      className={clsx(className, classes.dayGridRoot)}
      render={renderDayGrid}
      ref={ref}
      {...other}
    >
      <Calendar.DayGridHeader className={classes.dayGridHeader} render={renderDayGridHeader}>
        {({ days }) => (
          <React.Fragment>
            {displayWeekNumber && (
              <DateCalendar2DayGridWeekNumberHeaderCell
                variant="caption"
                role="columnheader"
                aria-label={translations.calendarWeekNumberHeaderLabel}
                className={classes.dayGridWeekNumberHeaderCell}
              >
                {translations.calendarWeekNumberHeaderText}
              </DateCalendar2DayGridWeekNumberHeaderCell>
            )}
            {days.map((day) => (
              <Calendar.DayGridHeaderCell
                value={day}
                className={classes.dayGridHeaderCell}
                key={day.toString()}
                render={renderDayGridHeaderCell}
              />
            ))}
          </React.Fragment>
        )}
      </Calendar.DayGridHeader>
      {loading && renderLoadingPanel()}
      {!loading && reduceAnimations && (
        <DateCalendar2DayGridBodyNoTransition>
          <WrappedDateCalendar2DayGridBody />
        </DateCalendar2DayGridBodyNoTransition>
      )}
      {!loading && !reduceAnimations && (
        <DateCalendar2DayGridBodyTransitionGroup
          childFactory={(element: React.ReactElement<any>) => {
            // If we pass the classes directly to the CSSTransition component, the direction of the exiting component would not update.
            return React.cloneElement(element, {
              classNames: {
                exit: 'exit',
                enterActive: 'enter-active',
                enter: `enter-${slideDirection}`,
                exitActive: `exit-active-${slideDirection}`,
              },
            });
          }}
          role="presentation"
          className={classes.dayGridBodyTransitionGroup}
        >
          <WrappedDateCalendar2DayGridBodyWithTransition key={transitionKey} />
        </DateCalendar2DayGridBodyTransitionGroup>
      )}
    </Calendar.DayGrid>
  );
});
