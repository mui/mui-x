import * as React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import { useRtl } from '@mui/system/RtlProvider';
import { Calendar, useCalendarContext } from '../internals/base/Calendar';
import { usePickerTranslations } from '../hooks';
import { DateView } from '../models/views';
import { ArrowDropDownIcon, ArrowLeftIcon, ArrowRightIcon } from '../icons';
import { useUtils } from '../internals/hooks/useUtils';
import { useDateCalendar2Context } from './DateCalendar2Context';

const DateCalendar2HeaderRoot = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderRoot',
  overridesResolver: (props, styles) => styles.headerRoot,
})({
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

const DateCalendar2HeaderLabelContainer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelContainer',
  overridesResolver: (props, styles) => styles.headerLabelContainer,
})(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto',
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
}));

const DateCalendar2HeaderLabelTransitionGroup = styled(TransitionGroup, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelTransitionGroup',
  overridesResolver: (props, styles) => styles.headerLabelTransitionGroup,
})({
  display: 'block',
  position: 'relative',
});

const DateCalendar2HeaderLabelContent = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderLabelContent',
  overridesResolver: (props, styles) => styles.headerLabelContent,
})({
  marginRight: 6,
});

const DateCalendar2HeaderSwitchViewButton = styled(IconButton, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderSwitchViewButton',
  overridesResolver: (props, styles) => styles.headerSwitchViewButton,
})({
  marginRight: 'auto',
});

const DateCalendar2HeaderSwitchViewIcon = styled(ArrowDropDownIcon, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderSwitchViewIcon',
  overridesResolver: (props, styles) => styles.headerSwitchViewIcon,
})(({ theme }) => ({
  willChange: 'transform',
  transition: theme.transitions.create('transform'),
  transform: 'rotate(0deg)',
  '&[data-view="year"]': {
    transform: 'rotate(180deg)',
  },
}));

const DateCalendar2HeaderNavigation = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigation',
  overridesResolver: (props, styles) => styles.headerNavigation,
})({
  display: 'flex',
});

const DateCalendar2HeaderNavigationButton = styled(IconButton, {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigationButton',
  overridesResolver: (props, styles) => styles.headerNavigationButton,
})({
  '&:disabled': {
    visibility: 'hidden',
  },
});

const DateCalendar2HeaderNavigationSpacer = styled('div', {
  name: 'MuiDateCalendar2',
  slot: 'HeaderNavigationSpacer',
  overridesResolver: (props, styles) => styles.headerNavigationSpacer,
})(({ theme }) => ({
  width: theme.spacing(3),
}));

export function DateCalendar2Header(props: DateCalendar2HeaderProps) {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const theme = useTheme();
  const isRtl = useRtl();
  const { visibleDate, disabled } = useCalendarContext();
  const { classes } = useDateCalendar2Context();

  const {
    // Props from DateCalendar2
    view,
    onViewChange,
    views,
    labelId,

    // Props from the calendarHeader slotProps
    format = `${utils.formats.month} ${utils.formats.year}`,
  } = props;

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

  const label = React.useMemo(
    () => utils.formatByString(visibleDate, format),
    [visibleDate, format, utils],
  );

  if (!views.day && !views.month && views.year) {
    return null;
  }

  const viewCount = Object.values(views).filter(Boolean).length;

  return (
    <DateCalendar2HeaderRoot className={classes.headerRoot}>
      <DateCalendar2HeaderLabelContainer
        role="presentation"
        onClick={handleToggleView}
        // putting this on the label item element below breaks when using transition
        aria-live="polite"
        className={classes.headerLabelContainer}
      >
        <DateCalendar2HeaderLabelTransitionGroup className={classes.headerLabelTransitionGroup}>
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
            <DateCalendar2HeaderLabelContent id={labelId} className={classes.headerLabelContent}>
              {label}
            </DateCalendar2HeaderLabelContent>
          </Fade>
        </DateCalendar2HeaderLabelTransitionGroup>
        {viewCount > 1 && !disabled && (
          <DateCalendar2HeaderSwitchViewButton
            size="small"
            aria-label={translations.calendarViewSwitchingButtonAriaLabel(view)}
            className={classes.headerSwitchViewButton}
          >
            <DateCalendar2HeaderSwitchViewIcon
              data-view={view}
              className={classes.headerSwitchViewButton}
            />
          </DateCalendar2HeaderSwitchViewButton>
        )}
      </DateCalendar2HeaderLabelContainer>
      <Fade in={view === 'day'}>
        <DateCalendar2HeaderNavigation className={classes.headerNavigation}>
          <Calendar.SetVisibleMonth
            target="previous"
            render={
              <DateCalendar2HeaderNavigationButton
                size="medium"
                title={translations.previousMonth}
                aria-label={translations.previousMonth}
                edge="end"
                className={classes.headerNavigationButton}
              />
            }
          >
            {isRtl ? <ArrowRightIcon fontSize="inherit" /> : <ArrowLeftIcon fontSize="inherit" />}
          </Calendar.SetVisibleMonth>
          <DateCalendar2HeaderNavigationSpacer className={classes.headerNavigationSpacer} />
          <Calendar.SetVisibleMonth
            target="next"
            render={
              <DateCalendar2HeaderNavigationButton
                size="medium"
                title={translations.nextMonth}
                aria-label={translations.nextMonth}
                edge="start"
                className={classes.headerNavigationButton}
              />
            }
          >
            {isRtl ? <ArrowLeftIcon fontSize="inherit" /> : <ArrowRightIcon fontSize="inherit" />}
          </Calendar.SetVisibleMonth>
        </DateCalendar2HeaderNavigation>
      </Fade>
    </DateCalendar2HeaderRoot>
  );
}

interface DateCalendar2HeaderSlotProps {
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format?: string;
}

export interface DateCalendar2HeaderProps extends DateCalendar2HeaderSlotProps {
  view: DateView;
  onViewChange: (view: DateView) => void;
  views: { [key in DateView]?: boolean };
  labelId: string;
}
