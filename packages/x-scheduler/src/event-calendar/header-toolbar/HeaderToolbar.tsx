'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { PreferencesMenu } from './preferences-menu';

const HeaderToolbarRoot = styled('header', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbar',
})(({ theme }) => ({
  gridColumn: '2 / -1',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  ...theme.typography.body2,
  '&[data-single-primary-action="true"]': {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const HeaderToolbarActions = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarActions',
})(() => ({
  display: 'flex',
}));

const HeaderToolbarPrimaryActionWrapper = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'HeaderToolbarPrimaryActionWrapper',
})(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  gridColumn: 2,
  justifySelf: 'end',
}));

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useEventCalendarStoreContext();
  const translations = useTranslations();

  // Selector hooks
  const views = useStore(store, eventCalendarViewSelectors.views);
  const view = useStore(store, eventCalendarViewSelectors.view);

  const showViewSwitcher = views.length > 1;

  return (
    <HeaderToolbarRoot ref={forwardedRef} data-single-primary-action={!showViewSwitcher} {...props}>
      <HeaderToolbarActions>
        <HeaderToolbarPrimaryActionWrapper>
          {showViewSwitcher && (
            <ViewSwitcher views={views} view={view} onViewChange={store.setView} />
          )}
          <Button variant="outlined" onClick={store.goToToday}>
            {translations.today}
          </Button>
        </HeaderToolbarPrimaryActionWrapper>
        <PreferencesMenu />
      </HeaderToolbarActions>
    </HeaderToolbarRoot>
  );
});
