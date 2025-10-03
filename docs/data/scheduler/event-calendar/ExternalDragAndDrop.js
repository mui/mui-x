import * as React from 'react';
import clsx from 'clsx';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { StandaloneEvent } from '@mui/x-scheduler/primitives/standalone-event';

import { buildIsValidDropTarget } from '@mui/x-scheduler/primitives/build-is-valid-drop-target';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';
import classes from './ExternalDrag.module.css';

const isValidDropTarget = buildIsValidDropTarget([
  'CalendarGridTimeEvent',
  'CalendarGridDayEvent',
]);

const initialExternalEvents = Array.from({ length: 9 }, (_, index) => ({
  id: `external-event-${index + 1}`,
  title: `External Event ${index + 1}`,
}));

export default function ExternalDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);
  const [placeholder, setPlaceholder] = React.useState(null);
  const [externalEvents, setExternalEvents] = React.useState(initialExternalEvents);

  const handleEventDropInsideEventCalendar = (removedEvent) => {
    setExternalEvents((prev) =>
      prev.filter((event) => event.id !== removedEvent.id),
    );
  };

  const externalEventsContainerRef = React.useRef(null);
  React.useEffect(() => {
    if (!externalEventsContainerRef.current) {
      return undefined;
    }

    return dropTargetForElements({
      element: externalEventsContainerRef.current,
      canDrop: (arg) => isValidDropTarget(arg.source.data),
      onDragEnter: ({ source: { data } }) => {
        if (!isValidDropTarget(data)) {
          return;
        }

        setPlaceholder({ id: data.event.id, title: data.event.title });
      },
      onDrop: () => {
        if (placeholder == null) {
          return;
        }

        setExternalEvents((prev) => [...prev, placeholder]);
        setEvents((prev) => prev.filter((event) => event.id !== placeholder.id));
        setPlaceholder(null);
      },
    });
  });

  return (
    <div className={clsx(classes.Container, 'mui-x-scheduler')}>
      <div
        className={classes.ExternalEventsContainer}
        ref={externalEventsContainerRef}
      >
        {externalEvents.map((event) => (
          <StandaloneEvent
            key={event.id}
            isDraggable
            data={event}
            onEventDrop={() => handleEventDropInsideEventCalendar(event)}
            className={clsx(classes.ExternalEvent)}
          >
            {event.title}
          </StandaloneEvent>
        ))}
        {placeholder != null && (
          <div className={clsx(classes.ExternalEvent)} data-placeholder>
            {placeholder.title}
          </div>
        )}
      </div>
      <div style={{ flexGrow: 1 }}>
        <EventCalendar
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          areEventsDraggable
          canDragEventsFromTheOutside
          canDropEventsToTheOutside
          preferences={{ isSidePanelOpen: false }}
          className={classes.EventCalendar}
        />
      </div>
    </div>
  );
}
