import * as React from 'react';
import clsx from 'clsx';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { styled, useTheme, useThemeProps } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import useSlotProps from '@mui/utils/useSlotProps';
import useId from '@mui/utils/useId';
import useControlled from '@mui/utils/useControlled';
import { DateView } from '../models/views';
import { Calendar } from '../internals/base/Calendar';
import { DateCalendar2Header, DateCalendar2HeaderProps } from './DateCalendar2Header';
import { PickerValue } from '../internals/models';
import { DateCalendar2YearGrid } from './DateCalendar2YearGrid';
import { DateCalendar2MonthGrid } from './DateCalendar2MonthGrid';
import { DateCalendar2DayGrid } from './DateCalendar2DayGrid';
import { DIALOG_WIDTH, VIEW_HEIGHT } from '../internals/constants/dimensions';
import {
  DateCalendar2ContextValue,
  DateCalendar2PrivateContextValue,
  DateCalendar2Props,
} from './DateCalendar2.types';
import { DateCalendar2Classes, getDateCalendar2UtilityClass } from './DateCalendar2.classes';
import { DateCalendar2Context, DateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useReduceAnimations } from '../internals/hooks/useReduceAnimations';

const DEFAULT_VIEWS = { year: true, month: false, day: true };

const DateCalendar2Root = styled(Calendar.Root, {
  name: 'DateCalendar2',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  overflow: 'hidden',
  width: DIALOG_WIDTH,
  maxHeight: VIEW_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  height: VIEW_HEIGHT,
});

const DateCalendar2TransitionGroup = styled(TransitionGroup, {
  name: 'DateCalendar2',
  slot: 'TransitionGroup',
  overridesResolver: (props, styles) => styles.transitionGroup,
})({
  display: 'block',
  position: 'relative',
});

/**
 * - [x] Implementation without customization
 * - [x] Implement classes (both props.classes and built-in classes)
 * - [x] Implement theme entries
 * - [x] Implement props.slots and props.slotProps
 * - [ ] Implement all the missing props
 *   - [ ] Decide if onYearChange / onMonthChange should be used for the visible date or for the selected date.
 *   - [ ] Decide what to do with with onFocusedViewChange and focusedView
 * - [ ] Add tests
 * - [ ] Add doc examples
 *
 * Removed props:
 * - disableHighlightToday: people should be able to override using CSS (TODO: create doc example)
 * - renderLoading:  replaced by the loadingPanel slot
 * - openTo: replaced by the initialView prop
 * - onChange: replace by the onValueChange prop
 *
 * Modified props:
 * - views: is now an object with the following keys: year, month, day
 *
 * Theme entries that DateCalendar2 would eventually replace:
 * - MuiDateCalendar
 * - MuiDayCalendar
 * - MuiDayCalendarSkeleton
 * - MuiMonthCalendar
 * - MuiPickersArrowSwitcher (would also be inlined in the new Clock component if we keep it)
 * - MuiPickersCalendarHeader
 * - MuiPickersDay
 * - MuiPickersFadeTransitionGroup
 * - MuiPickersSlideTransition
 * - MuiYearCalendar
 */
export const DateCalendar2 = React.forwardRef(function DateCalendar2(
  props: DateCalendar2Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const id = useId();
  const theme = useTheme();
  const { ownerState } = usePickerPrivateContext();

  const themeProps = useThemeProps({
    props,
    name: 'MuiDateCalendar2',
  });

  const {
    // Customization props
    classes: classesProp,
    className,
    slots,
    slotProps,
    loading = false,
    reduceAnimations: reduceAnimationsProp,

    // View lifecycle props
    views = DEFAULT_VIEWS,
    defaultView = getDefaultView(views),
    view: viewProp,
    onViewChange,
    onValueChange,

    // View-specific customization props
    displayWeekNumber = false,
    fixedWeekNumber,
    monthsPerRow = 3,
    yearsPerRow = 3,
    yearsOrder = 'asc',

    // Forwarded props
    ...other
  } = themeProps;

  const reduceAnimations = useReduceAnimations(reduceAnimationsProp);
  const classes = useUtilityClasses(classesProp);

  const [view, setControlledView] = useControlled({
    name: 'DateCalendar2',
    state: 'view',
    default: defaultView,
    controlled: viewProp,
  });

  const labelId = `${id}-grid-label`;

  const setView = useEventCallback((newView: DateView) => {
    setControlledView(newView);
    onViewChange?.(newView);
  });

  const handleValueChange = useEventCallback(
    (value: PickerValue, ctx: Calendar.Root.ValueChangeHandlerContext) => {
      onValueChange?.(value, ctx);
      if (ctx.section === 'year' && views.month) {
        setView('month');
      } else if (ctx.section !== 'day' && views.day) {
        setView('day');
      }
    },
  );

  const privateContextValue = React.useMemo<DateCalendar2PrivateContextValue>(
    () => ({
      classes,
      slots,
      slotProps,
      labelId,
      loading,
      displayWeekNumber,
      fixedWeekNumber,
      yearsPerRow,
      monthsPerRow,
    }),
    [
      classes,
      slots,
      slotProps,
      labelId,
      loading,
      displayWeekNumber,
      fixedWeekNumber,
      yearsPerRow,
      monthsPerRow,
    ],
  );

  const contextValue = React.useMemo<DateCalendar2ContextValue>(
    () => ({ view, views, setView, reduceAnimations }),
    [view, views, setView, reduceAnimations],
  );

  const CalendarHeader = slots?.calendarHeader ?? DateCalendar2Header;
  const calendarHeaderProps: DateCalendar2HeaderProps = useSlotProps({
    elementType: CalendarHeader,
    externalSlotProps: slotProps?.calendarHeader,
    ownerState,
  });

  const renderViewContent = () => {
    if (view === 'year') {
      return <DateCalendar2YearGrid yearsOrder={yearsOrder} />;
    }

    if (view === 'month') {
      return <DateCalendar2MonthGrid />;
    }
    return <DateCalendar2DayGrid />;
  };

  return (
    <DateCalendar2Context.Provider value={contextValue}>
      <DateCalendar2PrivateContext.Provider value={privateContextValue}>
        <DateCalendar2Root
          onValueChange={handleValueChange}
          {...other}
          className={clsx(className, classes.root)}
          ref={ref}
        >
          <CalendarHeader {...calendarHeaderProps} />
          {reduceAnimations ? (
            renderViewContent()
          ) : (
            <DateCalendar2TransitionGroup className={classes.transitionGroup}>
              <Fade
                appear={false}
                mountOnEnter
                unmountOnExit
                key={view}
                timeout={{
                  appear: theme.transitions.duration.enteringScreen,
                  enter: theme.transitions.duration.enteringScreen,
                  exit: 0,
                }}
              >
                {renderViewContent()}
              </Fade>
            </DateCalendar2TransitionGroup>
          )}
        </DateCalendar2Root>
      </DateCalendar2PrivateContext.Provider>
    </DateCalendar2Context.Provider>
  );
});

function getDefaultView(views: { [key in DateView]?: boolean }) {
  if (views.day) {
    return 'day';
  }
  if (views.month) {
    return 'month';
  }
  return 'year';
}

function useUtilityClasses(classes: Partial<DateCalendar2Classes> | undefined) {
  return React.useMemo<DateCalendar2Classes>(() => {
    const slots = {
      root: ['root'],
      transitionGroup: ['transitionGroup'],
      headerRoot: ['headerRoot'],
      headerLabelContainer: ['headerLabelContainer'],
      headerLabelTransitionGroup: ['headerLabelTransitionGroup'],
      headerLabelContent: ['headerLabelContent'],
      headerSwitchViewButton: ['headerSwitchViewButton'],
      headerSwitchViewIcon: ['headerSwitchViewIcon'],
      headerNavigation: ['headerNavigation'],
      headerNavigationButton: ['headerNavigationButton'],
      headerNavigationSpacer: ['headerNavigationSpacer'],
      dayGridRoot: ['daysGridRoot'],
      dayGridHeader: ['daysGridHeader'],
      dayGridWeekNumberHeaderCell: ['daysGridWeekNumberHeaderCell'],
      dayGridHeaderCell: ['daysGridHeaderCell'],
      dayGridBodyTransitionGroup: ['daysGridBodyTransitionGroup'],
      dayGridBody: ['daysGridBody'],
      dayGridRow: ['daysGridRow'],
      dayGridWeekNumberCell: ['daysGridWeekNumberCell'],
      dayCell: ['daysCell'],
      dayCellSkeleton: ['daysCellSkeleton'],
      monthGridRoot: ['monthsGridRoot'],
      monthCell: ['monthsCell'],
      monthCellSkeleton: ['monthsCellSkeleton'],
      yearGridRoot: ['yearsGridRoot'],
      yearCell: ['yearsCell'],
      yearCellSkeleton: ['yearsCellSkeleton'],
      loadingPanel: ['loadingPanel'],
    };

    return composeClasses(slots, getDateCalendar2UtilityClass, classes);
  }, [classes]);
}
