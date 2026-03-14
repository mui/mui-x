'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MenuOpen from '@mui/icons-material/MenuOpen';
import Menu from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { PreferencesMenu } from './preferences-menu';
import { useEventCalendarStyledContext } from '../EventCalendarStyledContext';

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

const HeaderToolbarLeftElement = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarLeftElement',
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
}));

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useEventCalendarStoreContext();
  const { classes, localeText } = useEventCalendarStyledContext();
  const adapter = useAdapterContext();

  // Selector hooks
  const views = useStore(store, eventCalendarViewSelectors.views);
  const view = useStore(store, eventCalendarViewSelectors.view);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);

  const showViewSwitcher = views.length > 1;

  return (
    <HeaderToolbarRoot
      ref={forwardedRef}
      data-single-primary-action={!showViewSwitcher}
      {...props}
      className={clsx(props.className, classes.headerToolbar)}
    >
      <HeaderToolbarLeftElement
        ref={forwardedRef}
        role="navigation"
        {...props}
        className={classes.headerToolbarLeftElement}
      >
        <IconButton
          className={classes.headerToolbarSidePanelToggle}
          aria-label={isSidePanelOpen ? localeText.closeSidePanel : localeText.openSidePanel}
          onClick={(event) =>
            store.setPreferences({ isSidePanelOpen: !isSidePanelOpen }, event.nativeEvent)
          }
        >
          {isSidePanelOpen ? <MenuOpen /> : <Menu />}
        </IconButton>
        <HeaderToolbarLabel aria-live="polite">
          {adapter.format(visibleDate, 'monthFullLetter')}{' '}
          {adapter.format(visibleDate, 'yearPadded')}
        </HeaderToolbarLabel>
        <HeaderToolbarDateNavigator className={classes.headerToolbarDateNavigator}>
          <IconButton
            className={classes.headerToolbarPreviousButton}
            onClick={store.goToPreviousVisibleDate}
            aria-label={localeText.previousTimeSpan(view)}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            className={classes.headerToolbarNextButton}
            onClick={store.goToNextVisibleDate}
            aria-label={localeText.nextTimeSpan(view)}
          >
            <ChevronRight />
          </IconButton>
        </HeaderToolbarDateNavigator>
      </HeaderToolbarLeftElement>
      <HeaderToolbarActions className={classes.headerToolbarActions}>
        <PreferencesMenu />

        <Button onClick={store.goToToday}>{localeText.today}</Button>
        {showViewSwitcher && (
          <ViewSwitcher views={views} view={view} onViewChange={store.setView} />
        )}
      </HeaderToolbarActions>
    </HeaderToolbarRoot>
  );
});
