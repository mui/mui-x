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
import { DateCalendar2YearsGrid } from './DateCalendar2YearsGrid';
import { DateCalendar2MonthsGrid } from './DateCalendar2MonthsGrid';
import { DateCalendar2DaysGrid } from './DateCalendar2DaysGrid';
import { DIALOG_WIDTH, VIEW_HEIGHT } from '../internals/constants/dimensions';
import { DateCalendar2ContextValue, DateCalendar2Props } from './DateCalendar2.types';
import { DateCalendar2Classes, getDateCalendar2UtilityClass } from './DateCalendar2.classes';
import { DateCalendar2Context } from './DateCalendar2Context';
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
 * - [ ] Implement props.slots and props.slotProps
 * - [ ] Implement all the missing props
 * - [ ] Add tests
 * - [ ] Add doc examples
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
    reduceAnimations: reduceAnimationsProp,

    // View props
    views = DEFAULT_VIEWS,
    defaultView = getDefaultView(views),
    view: viewProp,
    onViewChange,
    onValueChange,

    // View customization props
    displayWeekNumber = false,
    monthsPerRow = 3,
    yearsPerRow = 3,
    yearsOrder = 'asc',

    // Forwarded props
    ...other
  } = themeProps;

  const reduceAnimations = useReduceAnimations(reduceAnimationsProp);
  const classes = useUtilityClasses(classesProp);

  const [view, setControlledView] = useControlled({
    name: 'DateCalendar',
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

  const contextValue = React.useMemo<DateCalendar2ContextValue>(
    () => ({ classes, slots, slotProps, view, views, setView, labelId, reduceAnimations }),
    [classes, slots, slotProps, view, views, setView, labelId, reduceAnimations],
  );

  const CalendarHeader = slots?.calendarHeader ?? DateCalendar2Header;
  const calendarHeaderProps: DateCalendar2HeaderProps = useSlotProps({
    elementType: CalendarHeader,
    externalSlotProps: slotProps?.calendarHeader,
    ownerState,
  });

  const viewContent = (
    <div>
      {view === 'year' && (
        <DateCalendar2YearsGrid cellsPerRow={yearsPerRow} yearsOrder={yearsOrder} />
      )}
      {view === 'month' && <DateCalendar2MonthsGrid cellsPerRow={monthsPerRow} />}
      {view === 'day' && <DateCalendar2DaysGrid displayWeekNumber={displayWeekNumber} />}
    </div>
  );

  return (
    <DateCalendar2Context.Provider value={contextValue}>
      <DateCalendar2Root
        onValueChange={handleValueChange}
        {...other}
        className={clsx(className, classes.root)}
        ref={ref}
      >
        <CalendarHeader {...calendarHeaderProps} />
        {reduceAnimations ? (
          viewContent
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
              {viewContent}
            </Fade>
          </DateCalendar2TransitionGroup>
        )}
      </DateCalendar2Root>
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
    daysGridRoot: ['daysGridRoot'],
    daysGridHeader: ['daysGridHeader'],
    daysGridWeekNumberHeaderCell: ['daysGridWeekNumberHeaderCell'],
    daysGridHeaderCell: ['daysGridHeaderCell'],
    daysGridBodyTransitionGroup: ['daysGridBodyTransitionGroup'],
    daysGridBody: ['daysGridBody'],
    daysGridRow: ['daysGridRow'],
    daysGridWeekNumberCell: ['daysGridWeekNumberCell'],
    daysCell: ['daysCell'],
    monthsGridRoot: ['monthsGridRoot'],
    monthsCell: ['monthsCell'],
    yearsGridRoot: ['yearsGridRoot'],
    yearsCell: ['yearsCell'],
  };

  return composeClasses(slots, getDateCalendar2UtilityClass, classes);
}
