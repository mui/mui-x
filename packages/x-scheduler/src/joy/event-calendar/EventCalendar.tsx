'use client';
import * as React from 'react';
import clsx from 'clsx';
import { SchedulerValidDate } from '../../primitives/models';
import { EventCalendarProps } from './EventCalendar.types';
import { ViewType } from '../models/views';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { HeaderToolbar } from '../header-toolbar';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import '../index.css';
import './EventCalendar.css';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { getColorClassName } from '../internals/utils/color-utils';

const adapter = getAdapter();

export const EventCalendar = React.forwardRef(function EventCalendar(
  props: EventCalendarProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { events, onEventsChange, resources, translations, className, ...other } = props;

  const [view, setView] = React.useState<ViewType>('week');
  const [visibleDate, setVisibleDate] = React.useState<SchedulerValidDate>(() => adapter.date());

  const handleDayHeaderClick = React.useCallback(
    (day: SchedulerValidDate) => {
      setVisibleDate(day);
      setView('day');
    },
    [setVisibleDate, setView],
  );

  let content: React.ReactNode;
  switch (view) {
    case 'week':
      content = (
        <WeekView events={events} onDayHeaderClick={handleDayHeaderClick} resources={resources} />
      );
      break;
    case 'day':
      content = <DayView events={events} day={visibleDate} resources={resources} />;
      break;
    case 'month':
      content = <div>TODO: Month view</div>;
      break;
    case 'agenda':
      content = <AgendaView events={events} />;
      break;
    default:
      content = null;
  }

  return (
    <TranslationsProvider translations={translations}>
      <div
        className={clsx(className, 'EventCalendarRoot', 'joy', 'light')}
        ref={forwardedRef}
        {...other}
      >
        <aside className="EventCalendarSidePanel">
          <span style={{ display: 'flex', alignItems: 'center', height: 42 }}>TODO: Time nav</span>
          <section
            className="EventCalendarMonthCalendarPlaceholder"
            // TODO: Add localization
            aria-label="Month calendar"
          >
            Month Calendar
          </section>
          {resources && resources.length > 0 && (
            <section
              // TODO: Add localization
              aria-label="Resource legend"
              className="EventCalendarResourceLegend"
            >
              {resources.map((resource) => (
                <div key={resource.id} className="EventCalendarResourceLegendItem">
                  <span
                    className={clsx(
                      'EventCalendarResourceLegendColor',
                      getColorClassName({ resource }),
                    )}
                  />
                  <span className="EventCalendarResourceLegendName">{resource.name}</span>
                </div>
              ))}
            </section>
          )}
        </aside>
        <div className="EventCalendarMainPanel">
          <HeaderToolbar onTodayClick={() => {}} selectedView={view} setSelectedView={setView} />
          <section
            // TODO: Add localization
            className="EventCalendarContent"
            aria-label="Calendar content"
          >
            {content}
          </section>
        </div>
      </div>
    </TranslationsProvider>
  );
});
