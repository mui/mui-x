'use client';
import * as React from 'react';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MenuOpen from '@mui/icons-material/MenuOpen';
import Menu from '@mui/icons-material/Menu';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { DateNavigatorProps } from './DateNavigator.types';
import { useTranslations } from '../../internals/utils/TranslationsContext';

const DateNavigatorRoot = styled('header', {
  name: 'MuiEventCalendar',
  slot: 'DateNavigator',
})(({ theme }) => ({
  gridColumn: '1 / 2',
  gridTemplateColumns: 'subgrid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: `${theme.spacing(1)} 0`,
}));

const DateNavigatorLabel = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'DateNavigatorLabel',
})(({ theme }) => ({
  margin: 0,
  ...theme.typography.h6,
  fontWeight: theme.typography.fontWeightBold,
  lineHeight: 1.4,
}));

const DateNavigatorButtonsContainer = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DateNavigatorButtonsContainer',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}));

export const DateNavigator = React.forwardRef(function DateNavigator(
  props: DateNavigatorProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const translations = useTranslations();

  // Selector hooks
  const view = useStore(store, eventCalendarViewSelectors.view);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);

  return (
    <DateNavigatorRoot ref={forwardedRef} role="navigation" {...props}>
      <IconButton
        aria-label={isSidePanelOpen ? translations.closeSidePanel : translations.openSidePanel}
        onClick={(event) =>
          store.setPreferences({ isSidePanelOpen: !isSidePanelOpen }, event.nativeEvent)
        }
      >
        {isSidePanelOpen ? <MenuOpen /> : <Menu />}
      </IconButton>
      <DateNavigatorLabel aria-live="polite">
        {adapter.format(visibleDate, 'monthFullLetter')} {adapter.format(visibleDate, 'yearPadded')}
      </DateNavigatorLabel>
      <DateNavigatorButtonsContainer>
        <IconButton
          onClick={store.goToPreviousVisibleDate}
          aria-label={translations.previousTimeSpan(view)}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={store.goToNextVisibleDate}
          aria-label={translations.nextTimeSpan(view)}
        >
          <ChevronRight />
        </IconButton>
      </DateNavigatorButtonsContainer>
    </DateNavigatorRoot>
  );
});
