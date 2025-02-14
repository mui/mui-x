'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TransitionGroupProps } from 'react-transition-group/TransitionGroup';
import { alpha, styled, useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import useSlotProps from '@mui/utils/useSlotProps';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { Calendar, useCalendarContext } from '../internals/base/Calendar';
import { usePickerTranslations } from '../hooks';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';
import { useUtils } from '../internals/hooks/useUtils';
import { useDateCalendar2Context, useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DAYS_GRID_BODY_HEIGHT, useLoadingPanel } from './DateCalendar2.utils';

const DaysCalendar2DayGridRoot = styled(Calendar.DayGrid, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridRoot',
  overridesResolver: (props, styles) => styles.dayGridRoot,
})({});

const DateCalendar2DayGridHeader = styled(Calendar.DayGridHeader, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridHeader',
  overridesResolver: (props, styles) => styles.dayGridHeader,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const DateCalendar2DayGridWeekNumberHeaderCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridWeekNumberHeaderCell',
  overridesResolver: (props, styles) => styles.dayGridWeekNumberHeaderCell,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.disabled,
}));

const DateCalendar2DayGridHeaderCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridHeaderCell',
  overridesResolver: (props, styles) => styles.dayGridHeaderCell,
})(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
}));

const DateCalendar2DayGridBodyNoTransition = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DayGridBodyNoTransition',
  overridesResolver: (props, styles) => styles.dayGridBodyNoTransition,
})({
  minHeight: DAYS_GRID_BODY_HEIGHT,
});

const DateCalendar2DayGridBodyTransitionGroup = styled(TransitionGroup, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridBodyTransitionGroup',
  overridesResolver: (props, styles) => styles.dayGridBodyTransitionGroup,
})<TransitionGroupProps>(({ theme }) => {
  const slideTransition = theme.transitions.create('transform', {
    duration: theme.transitions.duration.complex,
    easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)',
  });
  return {
    minHeight: DAYS_GRID_BODY_HEIGHT,
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    '& > *': {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
    },
    '& .day-grid-enter-left': {
      willChange: 'transform',
      transform: 'translate(100%)',
      zIndex: 1,
    },
    '& .day-grid-enter-right': {
      willChange: 'transform',
      transform: 'translate(-100%)',
      zIndex: 1,
    },
    '& .day-grid-enter-active': {
      transform: 'translate(0%)',
      transition: slideTransition,
    },
    '& .day-grid-exit': {
      transform: 'translate(0%)',
    },
    '& .day-grid-exit-active-left': {
      willChange: 'transform',
      transform: 'translate(-100%)',
      transition: slideTransition,
      zIndex: 0,
    },
    '& .day-grid-exit-active-right': {
      willChange: 'transform',
      transform: 'translate(100%)',
      transition: slideTransition,
      zIndex: 0,
    },
  };
});

export const DateCalendar2DayGridBody = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DayGridBody',
  overridesResolver: (props, styles) => styles.dayGridBody,
})({ overflow: 'hidden' });

export const DateCalendar2DayGridRow = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DayGridRow',
  overridesResolver: (props, styles) => styles.dayGridRow,
})({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

const DateCalendar2DayGridWeekNumberCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DayGridWeekNumberCell',
  overridesResolver: (props, styles) => styles.dayGridWeekNumberCell,
})(({ theme }) => ({
  ...theme.typography.caption,
  width: DAY_SIZE,
  height: DAY_SIZE,
  padding: 0,
  margin: `0 ${DAY_MARGIN}px`,
  color: theme.palette.text.disabled,
  fontSize: '0.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'inline-flex',
}));

const DateCalendar2DayCell = styled((props) => <ButtonBase centerRipple {...props} />, {
  name: 'MuiDateCalendar2',
  slot: 'DayCell',
  overridesResolver: (props, styles) => styles.dayCell,
})(({ theme }) => ({
  ...theme.typography.caption,
  width: DAY_SIZE,
  height: DAY_SIZE,
  borderRadius: '50%',
  padding: 0,
  margin: `0 ${DAY_MARGIN}px`,

  // explicitly setting to `transparent` to avoid potentially getting impacted by change from the overridden component
  backgroundColor: 'transparent',
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.short,
  }),
  color: (theme.vars || theme).palette.text.primary,
  '@media (pointer: fine)': {
    '&:hover': {
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.hoverOpacity})`
        : alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
    },
  },
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
    '&[data-selected]': {
      willChange: 'background-color',
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
  '&[data-selected]': {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      willChange: 'background-color',
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
  '&[data-disabled]:not([data-selected])': {
    color: (theme.vars || theme).palette.text.disabled,
  },
  '&[data-disabled][data-selected]': {
    opacity: 0.6,
  },
  '&[data-outside-month]': {
    color: (theme.vars || theme).palette.text.secondary,
    pointerEvents: 'none',
  },
  '&[data-current]:not([data-selected])': {
    border: `1px solid ${(theme.vars || theme).palette.text.secondary}`,
  },
}));

const DateCalendar2DayCellLoading = styled(Skeleton, {
  name: 'MuiDayCalendarSkeleton',
  slot: 'DaySkeleton',
  overridesResolver: (props, styles) => styles.daySkeleton,
})({
  margin: `0 ${DAY_MARGIN}px`,
  '&[data-outside-month="true"]': {
    visibility: 'hidden',
  },
});

const WrappedDayCell = React.forwardRef(function WrappedDayCell(
  props: React.HTMLAttributes<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();

  const DayCell = slots?.dayButton ?? DateCalendar2DayCell;
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

const renderDay = (props: any) => <WrappedDayCell {...props} />;
const renderRow = (props: any) => <DateCalendar2DayGridRow {...props} />;

const WrappedDateCalendar2DayGridBody = React.forwardRef(function WrappedDateCalendar2DayGridBody(
  props: Calendar.DayGridBody.Props & { displayWeekNumber: boolean },
  ref: React.Ref<HTMLDivElement>,
) {
  const translations = usePickerTranslations();
  const { displayWeekNumber, ...other } = props;
  const { classes } = useDateCalendar2PrivateContext();
  const utils = useUtils();

  const renderBodyChildren = React.useCallback<
    Exclude<Calendar.DayGridBody.Props['children'], undefined>
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
    <Calendar.DayGridBody {...other} ref={ref} render={<DateCalendar2DayGridBody />}>
      {renderBodyChildren}
    </Calendar.DayGridBody>
  );
});

function WrappedDateCalendar2DayGridBodyWithTransition(
  props: Partial<CSSTransitionProps> & { displayWeekNumber: boolean },
) {
  const { displayWeekNumber, onExit, ...other } = props;
  const theme = useTheme();
  const { classes } = useDateCalendar2PrivateContext();
  const ref = React.createRef<HTMLDivElement>();

  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      timeout={theme.transitions.duration.complex}
      nodeRef={ref}
      {...other}
    >
      <WrappedDateCalendar2DayGridBody
        ref={ref}
        className={classes.dayGridBody}
        displayWeekNumber={displayWeekNumber}
        freezeCurrentMonth={!props.in}
      />
    </CSSTransition>
  );
}

const DateCalendar2DayGridBodyLoading = React.memo(function DateCalendar2DayGridBodyLoading(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
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
    <DateCalendar2DayGridBody {...props}>
      {Array.from({ length: 4 }, (_, weekIndex) => (
        <DateCalendar2DayGridRow key={weekIndex}>
          {Array.from({ length: 7 }, (_day, dayIndex) => (
            <DateCalendar2DayCellLoading
              key={dayIndex}
              variant="circular"
              width={DAY_SIZE}
              height={DAY_SIZE}
              data-outside-month={isDayHidden(weekIndex, dayIndex, 4)}
            />
          ))}
        </DateCalendar2DayGridRow>
      ))}
    </DateCalendar2DayGridBody>
  );
});

export const DateCalendar2DayGrid = React.forwardRef(function DateCalendar2DayGrid(
  props: DateCalendar2DayGridProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const translations = usePickerTranslations();
  const utils = useUtils();
  const { visibleDate } = useCalendarContext();
  const { classes, loading, labelId } = useDateCalendar2PrivateContext();
  const { reduceAnimations } = useDateCalendar2Context();
  const renderLoadingPanel = useLoadingPanel({
    view: 'year',
    defaultComponent: DateCalendar2DayGridBodyLoading,
  });
  const { displayWeekNumber, fixedWeekNumber, className, ...other } = props;

  // We need a new ref whenever the `key` of the transition changes: https://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = utils.formatByString(
    visibleDate,
    `${utils.formats.year}-${utils.formats.month}`,
  );

  const prevVisibleDate = React.useRef(visibleDate);
  const slideDirection = utils.isBefore(prevVisibleDate.current, visibleDate) ? 'left' : 'right';

  useEnhancedEffect(() => {
    prevVisibleDate.current = visibleDate;
  }, [visibleDate]);

  // TODO: Try to move slide direction to a data-direction attribute
  const dayGridTransitionClasses = {
    exit: 'day-grid-exit',
    enterActive: 'day-grid-enter-active',
    enter: `day-grid-enter-${slideDirection}`,
    exitActive: `day-grid-exit-active-${slideDirection}`,
  };

  return (
    <DaysCalendar2DayGridRoot
      aria-labelledby={labelId}
      className={clsx(className, classes.dayGridRoot)}
      ref={ref}
      {...other}
    >
      <DateCalendar2DayGridHeader className={classes.dayGridHeader}>
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
                render={<DateCalendar2DayGridHeaderCell variant="caption" />}
              />
            ))}
          </React.Fragment>
        )}
      </DateCalendar2DayGridHeader>
      {loading && renderLoadingPanel()}
      {!loading && reduceAnimations && (
        <DateCalendar2DayGridBodyNoTransition>
          <WrappedDateCalendar2DayGridBody
            className={classes.dayGridBody}
            displayWeekNumber={displayWeekNumber}
            fixedWeekNumber={fixedWeekNumber}
          />
        </DateCalendar2DayGridBodyNoTransition>
      )}
      {!loading && !reduceAnimations && (
        <DateCalendar2DayGridBodyTransitionGroup
          childFactory={(element: React.ReactElement<any>) =>
            React.cloneElement(element, {
              classNames: dayGridTransitionClasses,
            })
          }
          role="presentation"
          className={classes.dayGridBodyTransitionGroup}
        >
          <WrappedDateCalendar2DayGridBodyWithTransition
            key={transitionKey}
            displayWeekNumber={displayWeekNumber}
            fixedWeekNumber={fixedWeekNumber}
          />
        </DateCalendar2DayGridBodyTransitionGroup>
      )}
    </DaysCalendar2DayGridRoot>
  );
});

interface DateCalendar2DayGridProps
  extends Pick<Calendar.DayGridBody.Props, 'fixedWeekNumber'>,
    React.HTMLAttributes<HTMLDivElement> {
  displayWeekNumber: boolean;
}
