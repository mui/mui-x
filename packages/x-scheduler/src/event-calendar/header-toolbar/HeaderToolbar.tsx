'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MenuOpen from '@mui/icons-material/MenuOpen';
import Menu from '@mui/icons-material/Menu';
import Today from '@mui/icons-material/Today';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-internals/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { formatMonthAndYear, getWeekNumber } from '@mui/x-scheduler-internals/internals';
import type { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { PreferencesMenu } from './preferences-menu';
import { useEventCalendarStyledContext } from '../EventCalendarStyledContext';

// Both toolbar layouts render for SSR safety; the root container query toggles them
// via `data-expanded-only` / `data-compact-only` (see `EventCalendarRootStyled`).
const HeaderToolbarRoot = styled('header', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbar',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  flexWrap: 'wrap',
}));

const HeaderToolbarActions = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarActions',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const HeaderToolbarDateNavigator = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarDateNavigator',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const HeaderToolbarStart = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarStart',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
}));

const HeaderToolbarLabel = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarLabel',
})(({ theme }) => ({
  margin: 0,
  ...theme.typography.h6,
  fontWeight: theme.typography.fontWeightBold,
  lineHeight: 1.4,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const HeaderToolbarWeekNumber = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarWeekNumber',
})(({ theme }) => ({
  padding: theme.spacing(0.1, 0.7),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: theme.typography.fontWeightRegular,
  color: (theme.vars || theme).palette.text.primary,
  textAlign: 'center',
  backgroundColor: (theme.vars || theme).palette.grey[200],
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.grey[900],
  }),
}));

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useEventCalendarStoreContext();
  const { schedulerId, classes, localeText } = useEventCalendarStyledContext();
  const isRtl = useRtl();
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  // Selector hooks
  const views = useStore(store, eventCalendarViewSelectors.views);
  const view = useStore(store, eventCalendarViewSelectors.view);
  const visiblePlainDate = useStore(store, schedulerOtherSelectors.visiblePlainDate);
  const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);
  const showWeekNumber = useStore(store, eventCalendarPreferenceSelectors.showWeekNumber);
  const weekInfo = useStore(store, eventCalendarPreferenceSelectors.weekInfo);
  const locale = useStore(store, schedulerOtherSelectors.dateLocale);

  const { onCompactMenuClick, className, ...other } = props;

  const weekNumber = getWeekNumber(visiblePlainDate, weekInfo);
  const showViewSwitcher = views.length > 1;
  const showWeekLabel = showWeekNumber && (view === 'week' || view === 'day');

  return (
    <HeaderToolbarRoot
      ref={forwardedRef}
      data-single-primary-action={!showViewSwitcher}
      {...other}
      className={clsx(className, classes.headerToolbar)}
    >
      <HeaderToolbarStart className={classes.headerToolbarStart}>
        {/* Compact: opens the side panel drawer. */}
        <IconButton
          data-compact-only
          className={classes.headerToolbarCompactMenuButton}
          aria-label={localeText.openMenu}
          onClick={onCompactMenuClick}
        >
          <Menu />
        </IconButton>
        {/* Expanded: toggles the inline side panel. */}
        <IconButton
          data-expanded-only
          className={classes.headerToolbarSidePanelToggle}
          aria-label={isSidePanelOpen ? localeText.closeSidePanel : localeText.openSidePanel}
          aria-controls={`${schedulerId}-side-panel`}
          aria-expanded={isSidePanelOpen}
          onClick={(event) =>
            store.setPreferences({ isSidePanelOpen: !isSidePanelOpen }, event.nativeEvent)
          }
        >
          {isSidePanelOpen ? (
            // Mirrored in RTL so the arrow points toward the side panel, on the inline start.
            <MenuOpen sx={isRtl ? { transform: 'scaleX(-1)' } : undefined} />
          ) : (
            <Menu />
          )}
        </IconButton>
        <HeaderToolbarLabel
          data-expanded-only
          aria-live="polite"
          className={classes.headerToolbarLabel}
        >
          {formatMonthAndYear(locale, visiblePlainDate)}
          {showWeekLabel && (
            <HeaderToolbarWeekNumber className={classes.headerToolbarWeekNumber}>
              {`${localeText.week} ${weekNumber}`}
            </HeaderToolbarWeekNumber>
          )}
        </HeaderToolbarLabel>
      </HeaderToolbarStart>
      <HeaderToolbarActions className={classes.headerToolbarActions}>
        <HeaderToolbarDateNavigator
          role="navigation"
          className={classes.headerToolbarDateNavigator}
        >
          <IconButton
            className={classes.headerToolbarPreviousButton}
            onClick={store.goToPreviousVisibleDate}
            aria-label={localeText.previousTimeSpan(view)}
          >
            <PreviousIcon />
          </IconButton>
          <IconButton
            className={classes.headerToolbarNextButton}
            onClick={store.goToNextVisibleDate}
            aria-label={localeText.nextTimeSpan(view)}
          >
            <NextIcon />
          </IconButton>
        </HeaderToolbarDateNavigator>
        {/* Compact: today as an icon button replacing the expanded text button. */}
        <IconButton
          data-compact-only
          className={classes.headerToolbarCompactTodayButton}
          onClick={store.goToToday}
          aria-label={localeText.today}
        >
          <Today />
        </IconButton>
        <Button
          data-expanded-only
          className={classes.headerToolbarTodayButton}
          onClick={store.goToToday}
        >
          {localeText.today}
        </Button>
        {showViewSwitcher && (
          <ViewSwitcher data-expanded-only views={views} view={view} onViewChange={store.setView} />
        )}
        <PreferencesMenu data-expanded-only />
      </HeaderToolbarActions>
    </HeaderToolbarRoot>
  );
});
