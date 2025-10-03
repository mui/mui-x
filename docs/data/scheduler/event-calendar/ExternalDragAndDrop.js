import * as React from 'react';
import clsx from 'clsx';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { StandaloneEvent } from '@mui/x-scheduler/primitives/standalone-event';

import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './ExternalDrag.module.css';

const initialExternalEvents = Array.from({ length: 12 }, (_, index) => ({
  id: `external-event-${index + 1}`,
  title: `External Event ${index + 1}`,
}));

export default function ExternalDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);
  const [externalEvents, setExternalEvents] = React.useState(initialExternalEvents);

  const handleEventDrop = (removedEvent) => {
    setExternalEvents((prev) =>
      prev.filter((event) => event.id !== removedEvent.id),
    );
  };

  return (
    <div className={clsx(classes.Container, 'mui-x-scheduler')}>
      <div className={classes.ExternalEventsContainer}>
        {externalEvents.map((event) => (
          <StandaloneEvent
            key={event.id}
            isDraggable
            data={event}
            onEventDrop={() => handleEventDrop(event)}
            className={clsx(classes.ExternalEvent)}
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
          preferences={{ isSidePanelOpen: false }}
          className={classes.EventCalendar}
        />
      </div>
    </div>
  );
}
