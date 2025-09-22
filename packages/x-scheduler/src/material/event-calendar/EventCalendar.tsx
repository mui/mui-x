'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { EventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { MonthView } from '../month-view';
import { HeaderToolbar } from '../internals/components/header-toolbar';
import { DateNavigator } from '../internals/components/date-navigator';
import { ResourceLegend } from '../internals/components/resource-legend';
import {
  useEventCalendar,
  selectors,
  useExtractEventCalendarParameters,
} from '../../primitives/use-event-calendar';
import '../index.css';
import './EventCalendar.css';

function ErrorCallout() {
  return (
    <div className="ErrorCallout">
      <p>
        <span>The Timeline view is currently only available on its own, rendered inside the </span>
        <span className="CodeSnippet">{'<StandaloneView/>'}</span> component.
      </p>
    </div>
  );
}

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters(props);
  const store = useEventCalendar(parameters);
  const view = useStore(store, selectors.view);
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
    case 'timeline':
      content = <ErrorCallout />;
      break;
    default:
      content = null;
  }

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <TranslationsProvider translations={translations}>
        <div
          {...other}
          className={clsx(forwardedProps.className, 'EventCalendarRoot', 'mui-x-scheduler')}
          ref={forwardedRef}
        >
          <aside className="EventCalendarSidePanel">
            <DateNavigator />
            <section
              className="EventCalendarMonthCalendarPlaceholder"
              // TODO: Add localization
              aria-label="Month calendar"
            >
              Month Calendar
            </section>
            <ResourceLegend />
          </aside>
          <div className={clsx('EventCalendarMainPanel', view === 'month' && 'StretchView')}>
            <HeaderToolbar />
            <section
              // TODO: Add localization
              className={clsx('EventCalendarContent', view === 'month' && 'StretchView')}
              aria-label="Calendar content"
            >
              {content}
            </section>
          </div>
        </div>
      </TranslationsProvider>
    </EventCalendarStoreContext.Provider>
  );
});
