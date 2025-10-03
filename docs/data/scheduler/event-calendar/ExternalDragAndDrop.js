import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { StandaloneEvent } from '@mui/x-scheduler/primitives/standalone-event';

import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './ExternalDrag.module.css';

const initialExternalEvents = [
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

  const handleEventDrop = (event) => {
    setExternalEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
      }}
    >
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
      <div
        style={{
          flexGrow: 0,
          width: 400,
          paddingInline: 48,
          paddingBlock: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {externalEvents.map((event) => (
          <StandaloneEvent
            key={event.id}
            isDraggable
            data={event}
            onEventDrop={() => handleEventDrop(event)}
            className={classes.ExternalEvent}
            style={{
              border: '1px solid red',
              padding: '4px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <h4 style={{ margin: 0 }}>{event.title}</h4>
            <p style={{ margin: 0 }}>TODO</p>
          </StandaloneEvent>
        ))}
      </div>
    </div>
  );
}
