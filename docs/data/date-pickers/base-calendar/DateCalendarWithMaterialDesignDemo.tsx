import * as React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { useRtl } from '@mui/system/RtlProvider';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
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

export const DIALOG_WIDTH = 320;
export const MAX_CALENDAR_HEIGHT = 280;

const CalendarHeaderRoot = styled('div')({
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

const CalendarHeaderLabelContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto',
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
}));

const CalendarHeaderLabelContent = styled(TransitionGroup)({
  display: 'block',
  position: 'relative',
});

const CalendarHeaderLabel = styled('div')({
  marginRight: 6,
});

const CalendarHeaderSwitchViewButton = styled(IconButton)({
  marginRight: 'auto',
});

const CalendarHeaderSwitchViewIcon = styled(ArrowDropDownIcon)(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
  '&[data-view="year"]': {
    transform: 'rotate(180deg)',
  },
}));

const CalendarHeaderNavigation = styled('div')({
  display: 'flex',
});

const CalendarHeaderNavigationButton = styled(IconButton)({
  '&[data-hidden]': {
    visibility: 'hidden',
  },
});

const CalendarHeaderNavigationSpacier = styled('div')(({ theme }) => ({
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

const CalendarDaysGridHeader = styled(Calendar.DaysGridHeader)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const CalendarDaysGridWeekNumberHeaderCell = styled(Typography)(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.disabled,
}));

const CalendarDaysGridHeaderCell = styled(Typography)(({ theme }) => ({
  width: 36,
  height: 40,
  margin: '0 2px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
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
    }
  };

  const viewCount = Object.values(views).filter(Boolean).length;

  if (!views.day && !views.month && views.year) {
    return null;
  }

  const label = visibleDate.format('MMMM YYYY');

  return (
    <CalendarHeaderRoot>
      <CalendarHeaderLabelContainer
        role="presentation"
        onClick={handleToggleView}
        // putting this on the label item element below breaks when using transition
        aria-live="polite"
      >
        <CalendarHeaderLabelContent>
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
            <CalendarHeaderLabel
              id={labelId}
              data-testid="calendar-month-and-year-text"
            >
              {label}
            </CalendarHeaderLabel>
          </Fade>
        </CalendarHeaderLabelContent>
        {viewCount > 1 && !disabled && (
          <CalendarHeaderSwitchViewButton
            size="small"
            aria-label={translations.calendarViewSwitchingButtonAriaLabel(view)}
          >
            <CalendarHeaderSwitchViewIcon data-view={view} />
          </CalendarHeaderSwitchViewButton>
        )}
      </CalendarHeaderLabelContainer>
      <Fade in={view === 'day'}>
        <CalendarHeaderNavigation>
          <Calendar.SetVisibleMonth
            target="previous"
            render={
              <CalendarHeaderNavigationButton
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
          <CalendarHeaderNavigationSpacier />
          <Calendar.SetVisibleMonth
            target="next"
            render={
              <CalendarHeaderNavigationButton
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
        </CalendarHeaderNavigation>
      </Fade>
    </CalendarHeaderRoot>
  );
}

const DEFAULT_VIEWS = { year: true, month: false, day: true };

function DateCalendar(props: DateCalendarProps) {
  const { views = DEFAULT_VIEWS, openTo, displayWeekNumber } = props;
  const [view, setView] = React.useState<DateCalendarView>(() =>
    openTo != null && views[openTo] ? openTo! : 'day',
  );
  const translations = usePickerTranslations();
  const id = useId();
  const gridLabelId = `${id}-grid-label`;

  return (
    <Calendar.Root>
      <CalendarHeader
        view={view}
        views={views}
        onViewChange={setView}
        labelId={gridLabelId}
      />
      <div className="transition">
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
          {view === 'day' && (
            <Calendar.DaysGrid>
              <CalendarDaysGridHeader>
                {({ days }) => (
                  <React.Fragment>
                    {displayWeekNumber && (
                      <CalendarDaysGridWeekNumberHeaderCell
                        variant="caption"
                        role="columnheader"
                        aria-label={translations.calendarWeekNumberHeaderLabel}
                      >
                        {translations.calendarWeekNumberHeaderText}
                      </CalendarDaysGridWeekNumberHeaderCell>
                    )}
                    {days.map((day) => (
                      <Calendar.DaysGridHeaderCell
                        value={day}
                        key={day.toString()}
                        render={<CalendarDaysGridHeaderCell variant="caption" />}
                      />
                    ))}
                  </React.Fragment>
                )}
              </CalendarDaysGridHeader>
            </Calendar.DaysGrid>
          )}
        </div>
      </div>
    </Calendar.Root>
  );
}

type DateCalendarView = 'day' | 'month' | 'year';

interface DateCalendarProps {
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
