'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { CalendarView } from '@mui/x-scheduler-headless/models';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { ViewSwitcher } from './view-switcher';
import { useTranslations } from '../../utils/TranslationsContext';
import { PreferencesMenu } from './preferences-menu';
import './HeaderToolbar.css';

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const store = useEventCalendarStoreContext();
  const translations = useTranslations();
  const views = useStore(store, selectors.views);
  const view = useStore(store, selectors.view);
  const showViewSwitcher = views.length > 1;

  return (
    <header
      ref={forwardedRef}
      className={clsx(
        'HeaderToolbarContainer',
        !showViewSwitcher && 'SinglePrimaryAction',
        className,
      )}
      {...other}
    >
      <div className="PrimaryActionWrapper">
        {showViewSwitcher && (
          <ViewSwitcher<CalendarView> views={views} view={view} onViewChange={store.setView} />
        )}
        <button className="Button OutlinedNeutralButton" onClick={store.goToToday} type="button">
          {translations.today}
        </button>
      </div>
      <PreferencesMenu />
    </header>
  );
});
