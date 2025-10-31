'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { EventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  useEventCalendar,
  selectors,
  useExtractEventCalendarParameters,
} from '@mui/x-scheduler-headless/use-event-calendar';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { MonthView } from '../month-view';
import { HeaderToolbar } from '../internals/components/header-toolbar';
import { ResourceLegend } from '../internals/components/resource-legend';
import { DateNavigator } from '../internals/components/date-navigator';
import '../index.css';
import './EventCalendar.css';
import { RecurringScopeDialog } from '../internals/components/scope-dialog/ScopeDialog';

export const EventCalendar = React.forwardRef(function EventCalendar<
  TEvent extends object,
  TResource extends object,
>(props: EventCalendarProps<TEvent, TResource>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);
  const store = useEventCalendar(parameters);
  const view = useStore(store, eventCalendarViewSelectors.view);
  const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);
  const isScopeDialogOpen = useStore(store, selectors.isScopeDialogOpen);
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

  const rootRef = React.useRef<HTMLElement | null>(null);
  const handleRootRef = useMergedRefs(forwardedRef, rootRef);

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <TranslationsProvider translations={translations}>
          <div
            {...other}
            className={clsx(forwardedProps.className, 'EventCalendarRoot', 'mui-x-scheduler')}
            ref={handleRootRef}
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

              {isScopeDialogOpen && <RecurringScopeDialog containerRef={rootRef} />}
            </div>
          </div>
        </TranslationsProvider>
      </SchedulerStoreContext.Provider>
    </EventCalendarStoreContext.Provider>
  );
}) as EventCalendarComponent;

type EventCalendarComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
