import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TransitionGroupProps } from 'react-transition-group/TransitionGroup';
import { useRtl } from '@mui/system/RtlProvider';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  ArrowDropDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@mui/x-date-pickers/icons';
// eslint-disable-next-line no-restricted-imports
import {
  Calendar,
  useCalendarContext,
} from '@mui/x-date-pickers/internals/base/Calendar';
import useId from '@mui/utils/useId';
import Typography from '@mui/material/Typography';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { boxSizing } from '@mui/system';
import { Dayjs } from 'dayjs';

const DIALOG_WIDTH = 320;
const MAX_CALENDAR_HEIGHT = 280;
const DAY_MARGIN = 2;
const DAY_SIZE = 36;
const VIEW_HEIGHT = 336;
const WEEKS_CONTAINER_HEIGHT = (DAY_SIZE + DAY_MARGIN * 2) * 6;
const DEFAULT_VIEWS = { year: true, month: false, day: true };

const Root = styled(Calendar.Root)({
  overflow: 'hidden',
  width: DIALOG_WIDTH,
  maxHeight: VIEW_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  height: VIEW_HEIGHT,
});

const Content = styled(TransitionGroup)({
  display: 'block',
  position: 'relative',
});

const HeaderRoot = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 4,
  paddingLeft: 24,
  paddingRight: 12,
  // prevent jumping in safari
  maxHeight: 40,
  minHeight: 40,
});

const HeaderLabelContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto',
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
}));

const HeaderLabelContent = styled(TransitionGroup)({
  display: 'block',
  position: 'relative',
});

const HeaderLabel = styled('div')({
  marginRight: 6,
});

const HeaderSwitchViewButton = styled(IconButton)({
  marginRight: 'auto',
});

const HeaderSwitchViewIcon = styled(ArrowDropDownIcon)(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
  '&[data-view="year"]': {
    transform: 'rotate(180deg)',
  },
}));

const HeaderNavigation = styled('div')({
  display: 'flex',
});

const NavigationSpacier = styled('div')(({ theme }) => ({
  width: theme.spacing(3),
}));

const YearsGrid = styled(Calendar.YearsGrid)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  rowGap: 12,
  columnGap: 24,
  padding: '6px 0',
  overflowY: 'auto',
  height: '100%',
  width: DIALOG_WIDTH,
  maxHeight: MAX_CALENDAR_HEIGHT,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
  position: 'relative',
});

const YearsCell = styled(Calendar.YearsCell)(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  height: 36,
  width: 72,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.focusOpacity),
  },
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:disabled': {
    cursor: 'auto',
    pointerEvents: 'none',
  },
  '&[data-disabled]': {
    color: (theme.vars || theme).palette.text.secondary,
  },
  '&[data-selected]': {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
}));

const MonthsGrid = styled(Calendar.MonthsGrid)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  rowGap: 16,
  columnGap: 24,
  padding: '8px 0',
  width: DIALOG_WIDTH,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
});

const MonthsCell = styled(Calendar.MonthsCell)(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  height: 36,
  width: 72,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:disabled': {
    cursor: 'auto',
    pointerEvents: 'none',
  },
  '&[data-disabled]': {
    color: (theme.vars || theme).palette.text.secondary,
  },
  '&[data-selected]': {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
}));

const DaysGridHeader = styled(Calendar.DaysGridHeader)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const DaysGridWeekNumberHeaderCell = styled(Typography)(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.disabled,
}));

const DaysGridHeaderCell = styled(Typography)(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
}));

const DaysGridBodyContainer = styled(TransitionGroup)<TransitionGroupProps>(({
  theme,
}) => {
  const slideTransition = theme.transitions.create('transform', {
    duration: theme.transitions.duration.complex,
    easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)',
  });
  return {
    minHeight: WEEKS_CONTAINER_HEIGHT,
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

const DaysGridBody = styled(Calendar.DaysGridBody)({ overflow: 'hidden' });

const DaysWeekRow = styled(Calendar.DaysWeekRow)({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

const DaysGridWeekNumberCell = styled(Typography)(({ theme }) => ({
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

const DaysCell = styled(ButtonBase)(({ theme }) => ({
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

function CalendarHeader(props: {
  view: DateCalendarView;
  onViewChange: (view: DateCalendarView) => void;
  views: Record<DateCalendarView, boolean>;
  labelId: string;
}) {
  const { view, onViewChange, views, labelId } = props;
  const translations = usePickerTranslations();
  const theme = useTheme();
  const isRtl = useRtl();
  const { visibleDate, disabled } = useCalendarContext();

  const handleToggleView = () => {
    if (view === 'year' && views.month) {
      onViewChange('month');
    } else if (view === 'year' && views.day) {
      onViewChange('day');
    } else if (view === 'month' && views.day) {
      onViewChange('day');
    } else if (view === 'month' && views.year) {
      onViewChange('year');
    } else if (view === 'day' && views.month) {
      onViewChange('month');
    } else if (view === 'day' && views.year) {
      onViewChange('year');
    }
  };

  const viewCount = Object.values(views).filter(Boolean).length;

  if (!views.day && !views.month && views.year) {
    return null;
  }

  const label = visibleDate.format('MMMM YYYY');

  return (
    <HeaderRoot>
      <HeaderLabelContainer
        role="presentation"
        onClick={handleToggleView}
        // putting this on the label item element below breaks when using transition
        aria-live="polite"
      >
        <HeaderLabelContent>
          <Fade
            appear={false}
            mountOnEnter
            unmountOnExit
            key={label}
            timeout={{
              appear: theme.transitions.duration.enteringScreen,
              enter: theme.transitions.duration.enteringScreen,
              exit: 0,
            }}
          >
            <HeaderLabel id={labelId} data-testid="calendar-month-and-year-text">
              {label}
            </HeaderLabel>
          </Fade>
        </HeaderLabelContent>
        {viewCount > 1 && !disabled && (
          <HeaderSwitchViewButton
            size="small"
            aria-label={translations.calendarViewSwitchingButtonAriaLabel(view)}
          >
            <HeaderSwitchViewIcon data-view={view} />
          </HeaderSwitchViewButton>
        )}
      </HeaderLabelContainer>
      <Fade in={view === 'day'}>
        <HeaderNavigation>
          <Calendar.SetVisibleMonth
            target="previous"
            render={
              <IconButton
                size="medium"
                title={translations.previousMonth}
                aria-label={translations.previousMonth}
                edge="end"
              />
            }
          >
            {isRtl ? (
              <ArrowRightIcon fontSize="inherit" />
            ) : (
              <ArrowLeftIcon fontSize="inherit" />
            )}
          </Calendar.SetVisibleMonth>
          <NavigationSpacier />
          <Calendar.SetVisibleMonth
            target="next"
            render={
              <IconButton
                size="medium"
                title={translations.nextMonth}
                aria-label={translations.nextMonth}
                edge="end"
              />
            }
          >
            {isRtl ? (
              <ArrowLeftIcon fontSize="inherit" />
            ) : (
              <ArrowRightIcon fontSize="inherit" />
            )}
          </Calendar.SetVisibleMonth>
        </HeaderNavigation>
      </Fade>
    </HeaderRoot>
  );
}

function DayCalendar(props: { displayWeekNumber: boolean }) {
  const { displayWeekNumber } = props;
  const translations = usePickerTranslations();
  const theme = useTheme();
  const { visibleDate } = useCalendarContext();

  // We need a new ref whenever the `key` of the transition changes: https://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = visibleDate.format('MMMM YYYY');
  const daysGridBodyNodeRef = React.useMemo(
    () => React.createRef<HTMLDivElement>(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transitionKey],
  );

  const prevVisibleDate = React.useRef(visibleDate);
  const slideDirection = prevVisibleDate.current.isBefore(visibleDate)
    ? 'left'
    : 'right';

  useEnhancedEffect(() => {
    prevVisibleDate.current = visibleDate;
  }, [visibleDate]);

  const dayGridTransitionClasses = {
    exit: 'day-grid-exit',
    enterActive: 'day-grid-enter-active',
    enter: `day-grid-enter-${slideDirection}`,
    exitActive: `day-grid-exit-active-${slideDirection}`,
  };

  return (
    <Calendar.DaysGrid>
      <DaysGridHeader>
        {({ days }) => (
          <React.Fragment>
            {displayWeekNumber && (
              <DaysGridWeekNumberHeaderCell
                variant="caption"
                role="columnheader"
                aria-label={translations.calendarWeekNumberHeaderLabel}
              >
                {translations.calendarWeekNumberHeaderText}
              </DaysGridWeekNumberHeaderCell>
            )}
            {days.map((day) => (
              <Calendar.DaysGridHeaderCell
                value={day}
                key={day.toString()}
                render={<DaysGridHeaderCell variant="caption" />}
              />
            ))}
          </React.Fragment>
        )}
      </DaysGridHeader>
      <DaysGridBodyContainer
        childFactory={(element: React.ReactElement<any>) =>
          React.cloneElement(element, {
            classNames: dayGridTransitionClasses,
          })
        }
        role="presentation"
      >
        <CSSTransition
          mountOnEnter
          unmountOnExit
          key={transitionKey}
          timeout={theme.transitions.duration.complex}
          nodeRef={daysGridBodyNodeRef}
        >
          <DaysGridBody ref={daysGridBodyNodeRef}>
            {({ weeks }) =>
              weeks.map((week) => (
                <DaysWeekRow value={week} key={weeks.toString()}>
                  {({ days }) => (
                    <React.Fragment>
                      {displayWeekNumber && (
                        <DaysGridWeekNumberCell
                          role="rowheader"
                          aria-label={translations.calendarWeekNumberAriaLabelText(
                            days[0].week(),
                          )}
                        >
                          {translations.calendarWeekNumberText(days[0].week())}
                        </DaysGridWeekNumberCell>
                      )}
                      {days.map((day) => (
                        <Calendar.DaysCell value={day} render={<DaysCell />} />
                      ))}
                    </React.Fragment>
                  )}
                </DaysWeekRow>
              ))
            }
          </DaysGridBody>
        </CSSTransition>
      </DaysGridBodyContainer>
    </Calendar.DaysGrid>
  );
}

function CalendarContent(props: {
  view: DateCalendarView;
  displayWeekNumber: boolean;
}) {
  const { view, displayWeekNumber } = props;
  const theme = useTheme();

  return (
    <Content>
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
        <div>
          {view === 'year' && (
            <YearsGrid cellsPerRow={3}>
              {({ years }) =>
                years.map((year) => <YearsCell value={year} key={year.toString()} />)
              }
            </YearsGrid>
          )}
          {view === 'month' && (
            <MonthsGrid cellsPerRow={3}>
              {({ months }) =>
                months.map((month) => (
                  <MonthsCell value={month} key={month.toString()} />
                ))
              }
            </MonthsGrid>
          )}
          {view === 'day' && <DayCalendar displayWeekNumber={displayWeekNumber} />}
        </div>
      </Fade>
    </Content>
  );
}

function DateCalendar(props: DateCalendarProps) {
  const {
    views = DEFAULT_VIEWS,
    openTo,
    displayWeekNumber = false,
    onValueChange,
    ...other
  } = props;
  const [view, setView] = React.useState<DateCalendarView>(() =>
    openTo != null && views[openTo] ? openTo! : 'day',
  );
  const id = useId();
  const gridLabelId = `${id}-grid-label`;

  const handleValueChange = React.useCallback(
    (value: Dayjs, ctx: Calendar.Root.ValueChangeHandlerContext) => {
      onValueChange?.(value, ctx);
      if (ctx.section === 'year' && views.month) {
        setView('month');
      } else if (ctx.section !== 'day' && views.day) {
        setView('day');
      }
    },
    [onValueChange],
  );

  return (
    <Root onValueChange={handleValueChange} {...other}>
      <CalendarHeader
        view={view}
        views={views}
        onViewChange={setView}
        labelId={gridLabelId}
      />
      <CalendarContent view={view} displayWeekNumber={displayWeekNumber} />
    </Root>
  );
}

type DateCalendarView = 'day' | 'month' | 'year';

interface DateCalendarProps extends Omit<Calendar.Root.Props, 'children'> {
  views?: Record<DateCalendarView, boolean>;
  openTo?: DateCalendarView;
  displayWeekNumber?: boolean;
}

export default function DateCalendarWithMaterialDesignDemo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar />
    </LocalizationProvider>
  );
}
