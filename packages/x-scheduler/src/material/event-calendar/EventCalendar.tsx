'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { EventCalendarStoreContext } from '../../primitives/use-event-calendar-store-context';
import { MonthView } from '../month-view';
import { HeaderToolbar } from '../internals/components/header-toolbar';
import { ResourceLegend } from '../internals/components/resource-legend';
import {
  useEventCalendar,
  selectors,
  useExtractEventCalendarParameters,
} from '../../primitives/use-event-calendar';
import { SchedulerStoreContext } from '../../primitives/use-scheduler-store-context';
import '../index.css';
import './EventCalendar.css';
import { DateNavigator } from '../internals/components/date-navigator';

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters(props);
  const store = useEventCalendar(parameters);
  const view = useStore(store, selectors.view);
  const isSidePanelOpen = useStore(store, selectors.preferences).isSidePanelOpen;
  const {
    // TODO: Move inside useEventCalendar so that standalone view can benefit from it (#19293).
    translations,
    ...other
  } = forwardedProps;

  let content: React.ReactNode;
  switch (view) {
    case 'week':
      content = <WeekView />;
      break;
    case 'day':
      content = <DayView />;
      break;
    case 'month':
      content = <MonthView />;
      break;
    case 'agenda':
      content = <AgendaView />;
      break;
    default:
      content = null;
  }

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <TranslationsProvider translations={translations}>
          <div
            {...other}
            className={clsx(forwardedProps.className, 'EventCalendarRoot', 'mui-x-scheduler')}
            ref={forwardedRef}
          >
            <DateNavigator />

            <HeaderToolbar />

            <div className={clsx('EventCalendarMainPanel', view === 'month' && 'StretchView')}>
              {isSidePanelOpen && (
                <aside className="EventCalendarSidePanel">
                  <section
                    className="EventCalendarMonthCalendarPlaceholder"
                    // TODO: Add localization
                    aria-label="Month calendar"
                  >
                    Month Calendar
                  </section>
                  <ResourceLegend />
                </aside>
              )}

              <section
                // TODO: Add localization
                className={clsx(
                  'EventCalendarContent',
                  view === 'month' && 'StretchView',
                  !isSidePanelOpen && 'FullWidth',
                )}
                aria-label="Calendar content"
              >
                {content}
              </section>
            </div>
          </div>
        </TranslationsProvider>
      </SchedulerStoreContext.Provider>
    </EventCalendarStoreContext.Provider>
  );
});
