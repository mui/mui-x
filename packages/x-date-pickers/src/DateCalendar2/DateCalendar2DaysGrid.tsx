import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TransitionGroupProps } from 'react-transition-group/TransitionGroup';
import { alpha, styled, useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import useSlotProps from '@mui/utils/useSlotProps';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { Calendar, useCalendarContext } from '../internals/base/Calendar';
import { usePickerTranslations } from '../hooks';
import { DAY_MARGIN, DAY_SIZE } from '../internals/constants/dimensions';
import { useUtils } from '../internals/hooks/useUtils';
import { useDateCalendar2Context, useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { DateCalendar2Loadable } from './DateCalendar2Loadable';
import { DAYS_GRID_BODY_HEIGHT } from './DateCalendar2.utils';

const DaysCalendar2DaysGridRoot = styled(Calendar.DaysGrid, {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridRoot',
  overridesResolver: (props, styles) => styles.daysGridRoot,
})({});

const DateCalendar2DaysGridHeader = styled(Calendar.DaysGridHeader, {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridHeader',
  overridesResolver: (props, styles) => styles.daysGridHeader,
})({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const DateCalendar2DaysGridWeekNumberHeaderCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridWeekNumberHeaderCell',
  overridesResolver: (props, styles) => styles.daysGridWeekNumberHeaderCell,
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

const DateCalendar2DaysGridHeaderCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridHeaderCell',
  overridesResolver: (props, styles) => styles.daysGridHeaderCell,
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

const DateCalendar2DaysGridBodyNoTransition = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridBodyNoTransition',
  overridesResolver: (props, styles) => styles.daysGridBodyNoTransition,
})({
  minHeight: DAYS_GRID_BODY_HEIGHT,
});

const DateCalendar2DaysGridBodyTransitionGroup = styled(TransitionGroup, {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridBodyTransitionGroup',
  overridesResolver: (props, styles) => styles.daysGridBodyTransitionGroup,
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

export const DateCalendar2DaysGridBody = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridBody',
  overridesResolver: (props, styles) => styles.daysGridBody,
})({ overflow: 'hidden' });

export const DateCalendar2DaysGridRow = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridRow',
  overridesResolver: (props, styles) => styles.daysGridRow,
})({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

const DateCalendar2DaysGridWeekNumberCell = styled(Typography, {
  name: 'MuiDateCalendar2',
  slot: 'DaysGridWeekNumberCell',
  overridesResolver: (props, styles) => styles.daysGridWeekNumberCell,
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

const DateCalendar2DaysCell = styled((props) => <ButtonBase centerRipple {...props} />, {
  name: 'MuiDateCalendar2',
  slot: 'DaysCell',
  overridesResolver: (props, styles) => styles.daysCell,
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

const DateCalendar2DaysCellLoading = styled(Skeleton, {
  name: 'MuiDayCalendarSkeleton',
  slot: 'DaySkeleton',
  overridesResolver: (props, styles) => styles.daySkeleton,
})({
  margin: `0 ${DAY_MARGIN}px`,
  '&[data-outside-month="true"]': {
    visibility: 'hidden',
  },
});

const WrappedDaysButton = React.forwardRef(function WrappedDaysButton(
  props: React.HTMLAttributes<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();

  const DaysButton = slots?.dayButton ?? DateCalendar2DaysCell;
  const daysButtonProps = useSlotProps({
    elementType: DaysButton,
    externalSlotProps: slotProps?.day,
    externalForwardedProps: props,
    ownerState,
    className: classes.daysCell,
    additionalProps: { ref },
  });

  return <DaysButton {...daysButtonProps} />;
});

const WrappedDateCalendar2DaysGridBody = React.memo(function WrappedDateCalendar2DaysGridBody(
  props: Calendar.DaysGridBody.Props & {
    displayWeekNumber: boolean;
    nodeRef: React.RefObject<HTMLDivElement | null>;
  },
) {
  const translations = usePickerTranslations();
  const { displayWeekNumber, nodeRef, ...other } = props;
  const { classes } = useDateCalendar2PrivateContext();
  const utils = useUtils();

  return (
    <Calendar.DaysGridBody {...other} ref={nodeRef} render={<DateCalendar2DaysGridBody />}>
      {({ weeks }) => {
        return weeks.map((week) => (
          <Calendar.DaysGridRow
            render={<DateCalendar2DaysGridRow />}
            value={week}
            className={classes.daysGridRow}
            key={week.toString()}
          >
            {({ days }) => {
              const weekNumber = displayWeekNumber ? utils.getWeekNumber(days[0]) : 0;

              return (
                <React.Fragment>
                  {displayWeekNumber && (
                    <DateCalendar2DaysGridWeekNumberCell
                      role="rowheader"
                      aria-label={translations.calendarWeekNumberAriaLabelText(weekNumber)}
                      className={classes.daysGridWeekNumberCell}
                    >
                      {translations.calendarWeekNumberText(weekNumber)}
                    </DateCalendar2DaysGridWeekNumberCell>
                  )}
                  {days.map((day) => (
                    <Calendar.DaysCell
                      render={<WrappedDaysButton />}
                      value={day}
                      className={classes.daysCell}
                      key={day.toString()}
                    />
                  ))}
                </React.Fragment>
              );
            }}
          </Calendar.DaysGridRow>
        ));
      }}
    </Calendar.DaysGridBody>
  );
});

const DateCalendar2DaysGridBodyLoading = React.memo(function DateCalendar2DaysGridBodyLoading(
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
    <DateCalendar2DaysGridBody {...props}>
      {Array.from({ length: 4 }, (_, weekIndex) => (
        <DateCalendar2DaysGridRow key={weekIndex}>
          {Array.from({ length: 7 }, (_day, dayIndex) => (
            <DateCalendar2DaysCellLoading
              key={dayIndex}
              variant="circular"
              width={DAY_SIZE}
              height={DAY_SIZE}
              data-outside-month={isDayHidden(weekIndex, dayIndex, 4)}
            />
          ))}
        </DateCalendar2DaysGridRow>
      ))}
    </DateCalendar2DaysGridBody>
  );
});

export const DateCalendar2DaysGrid = React.memo(function DateCalendar2DaysGrid(
  props: DateCalendar2DaysGridProps,
) {
  const translations = usePickerTranslations();
  const theme = useTheme();
  const utils = useUtils();
  const { visibleDate } = useCalendarContext();
  const { classes, labelId } = useDateCalendar2PrivateContext();
  const { reduceAnimations } = useDateCalendar2Context();
  const { displayWeekNumber } = props;

  // We need a new ref whenever the `key` of the transition changes: https://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = utils.formatByString(
    visibleDate,
    `${utils.formats.year}-${utils.formats.month}`,
  );
  const daysGridBodyNodeRef = React.useMemo(
    () => React.createRef<HTMLDivElement>(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transitionKey],
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
    <DaysCalendar2DaysGridRoot aria-labelledby={labelId} className={classes.daysGridRoot}>
      <DateCalendar2DaysGridHeader className={classes.daysGridHeader}>
        {({ days }) => (
          <React.Fragment>
            {displayWeekNumber && (
              <DateCalendar2DaysGridWeekNumberHeaderCell
                variant="caption"
                role="columnheader"
                aria-label={translations.calendarWeekNumberHeaderLabel}
                className={classes.daysGridWeekNumberHeaderCell}
              >
                {translations.calendarWeekNumberHeaderText}
              </DateCalendar2DaysGridWeekNumberHeaderCell>
            )}
            {days.map((day) => (
              <Calendar.DaysGridHeaderCell
                value={day}
                className={classes.daysGridHeaderCell}
                key={day.toString()}
                render={<DateCalendar2DaysGridHeaderCell variant="caption" />}
              />
            ))}
          </React.Fragment>
        )}
      </DateCalendar2DaysGridHeader>
      <DateCalendar2Loadable defaultComponent={DateCalendar2DaysGridBodyLoading}>
        {reduceAnimations ? (
          <DateCalendar2DaysGridBodyNoTransition>
            <WrappedDateCalendar2DaysGridBody
              nodeRef={daysGridBodyNodeRef}
              className={classes.daysGridBody}
              displayWeekNumber={displayWeekNumber}
            />
          </DateCalendar2DaysGridBodyNoTransition>
        ) : (
          <DateCalendar2DaysGridBodyTransitionGroup
            childFactory={(element: React.ReactElement<any>) =>
              React.cloneElement(element, {
                classNames: dayGridTransitionClasses,
              })
            }
            role="presentation"
            className={classes.daysGridBodyTransitionGroup}
          >
            <CSSTransition
              mountOnEnter
              unmountOnExit
              key={transitionKey}
              timeout={theme.transitions.duration.complex}
              nodeRef={daysGridBodyNodeRef}
            >
              <WrappedDateCalendar2DaysGridBody
                nodeRef={daysGridBodyNodeRef}
                className={classes.daysGridBody}
                displayWeekNumber={displayWeekNumber}
              />
            </CSSTransition>
          </DateCalendar2DaysGridBodyTransitionGroup>
        )}
      </DateCalendar2Loadable>
    </DaysCalendar2DaysGridRoot>
  );
});

interface DateCalendar2DaysGridProps {
  displayWeekNumber: boolean;
}
