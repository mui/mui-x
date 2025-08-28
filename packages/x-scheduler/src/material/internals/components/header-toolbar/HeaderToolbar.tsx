'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { HeaderToolbarProps } from './HeaderToolbar.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { selectors } from '../../../../primitives/use-event-calendar';
import { SettingsMenu } from './settings-menu';
import { TimelineToggle } from './timeline-toggle';
import './HeaderToolbar.css';
import { CalendarViewSwitcher } from './calendar-view-switcher';
import { TimelineViewSwitcher } from './timeline-view-switcher';
import { ViewSwitcher } from './view-switcher';

export const HeaderToolbar = React.forwardRef(function HeaderToolbar(
  props: HeaderToolbarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const { store, instance } = useEventCalendarContext();
  const translations = useTranslations();
  const layoutMode = useStore(store, selectors.layoutMode);

  const isTimelineEnabled = useStore(store, selectors.isTimelineEnabled);

  return (
    <header ref={forwardedRef} className={clsx('HeaderToolbarContainer', className)} {...other}>
      <div className="PrimaryActionWrapper">
        {layoutMode === 'calendar' ? <CalendarViewSwitcher /> : <TimelineViewSwitcher />}
      </div>
      <div className="SecondaryActionWrapper">
        <button className="Button OutlinedNeutralButton" onClick={instance.goToToday} type="button">
          {translations.today}
        </button>
        {isTimelineEnabled && <TimelineToggle />}
        <SettingsMenu />
      </div>
    </header>
  );
});
