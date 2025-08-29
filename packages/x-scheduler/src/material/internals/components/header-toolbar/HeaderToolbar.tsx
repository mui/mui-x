'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { TimelineToggle } from './timeline-toggle';
import { PreferencesMenu } from './preferences-menu';
import './HeaderToolbar.css';
import { CalendarViewSwitcher } from './calendar-view-switcher';

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const view = useStore(store, selectors.view);
  const views = useStore(store, selectors.views);
  const isTimelineViewEnabled = views.includes('timeline');
  const layoutMode = view === 'timeline' ? 'timeline' : 'calendar';

  return (
    <header ref={forwardedRef} className={clsx('HeaderToolbarContainer', className)} {...other}>
      <div className="PrimaryActionWrapper">
        {layoutMode === 'calendar' && <CalendarViewSwitcher />}
      </div>
      <div className="SecondaryActionWrapper">
        <button className="Button OutlinedNeutralButton" onClick={instance.goToToday} type="button">
          {translations.today}
        </button>

        {isTimelineViewEnabled && <TimelineToggle />}
        <PreferencesMenu />
      </div>
    </header>
  );
});
