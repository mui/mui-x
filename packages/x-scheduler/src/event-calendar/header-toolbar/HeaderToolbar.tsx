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
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { PreferencesMenu } from './preferences-menu';
import { useEventCalendarClasses } from '../EventCalendarClassesContext';

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

const DateNavigatorButtonsContainer = styled(ButtonGroup, {
  name: 'MuiEventCalendar',
  slot: 'DateNavigatorButtonsContainer',
})({});

const HeaderToolbarLeft = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarLeft',
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
  const translations = useTranslations();
  const adapter = useAdapter();
  const classes = useEventCalendarClasses();

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
      <HeaderToolbarLeft
        ref={forwardedRef}
        role="navigation"
        {...props}
        className={classes.headerToolbarLeft}
      >
        <IconButton
          aria-label={isSidePanelOpen ? translations.closeSidePanel : translations.openSidePanel}
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
      </HeaderToolbarLeft>
      <HeaderToolbarActions className={classes.headerToolbarActions}>
        <PreferencesMenu />

        <DateNavigatorButtonsContainer className={classes.dateNavigatorButtonsContainer}>
          <Button
            onClick={store.goToPreviousVisibleDate}
            aria-label={translations.previousTimeSpan(view)}
          >
            <ChevronLeft />
          </Button>
          <Button onClick={store.goToToday}>{translations.today}</Button>
          <Button onClick={store.goToNextVisibleDate} aria-label={translations.nextTimeSpan(view)}>
            <ChevronRight />
          </Button>
        </DateNavigatorButtonsContainer>
        {showViewSwitcher && (
          <ViewSwitcher views={views} view={view} onViewChange={store.setView} />
        )}
      </HeaderToolbarActions>
    </HeaderToolbarRoot>
  );
});
