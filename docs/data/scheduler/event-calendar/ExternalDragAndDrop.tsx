import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { StandaloneEvent } from '@mui/x-scheduler/primitives/standalone-event';
import { CalendarOccurrencePlaceholderExternalDragData } from '@mui/x-scheduler/primitives/models';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './ExternalDrag.module.css';

const initialExternalEvents: CalendarOccurrencePlaceholderExternalDragData[] = [
  {
    id: 'external-1',
    title: 'External Event 1',
  },
  {
    id: 'external-2',
    title: 'External Event 2',
  },
  {
    id: 'external-3',
    title: 'External Event 3',
  },
];

export default function ExternalDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);
  const [externalEvents, setExternalEvents] = React.useState(initialExternalEvents);

  const handleEventDrop = (event: CalendarOccurrencePlaceholderExternalDragData) => {
    setExternalEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  return (
    <div className={classes.Container}>
      <div className={classes.ExternalEventsContainer}>
        {externalEvents.map((event) => (
          <StandaloneEvent
            key={event.id}
            isDraggable
            data={event}
            onEventDrop={() => handleEventDrop(event)}
            className={classes.ExternalEvent}
          >
            {event.title}
          </StandaloneEvent>
        ))}
      </div>
      <div style={{ flexGrow: 1 }}>
        <EventCalendar
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          areEventsDraggable
          areEventsResizable
          canDropEventsToTheOutside
        />
      </div>
    </div>
  );
}
