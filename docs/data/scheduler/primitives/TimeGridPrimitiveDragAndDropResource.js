import * as React from 'react';

import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';

import classes from './TimeGridPrimitive.module.css';
import {
  initialEvents,
  groupEventsByResource,
  getEventsDateRange,
} from './time-grid-events';

export default function TimeGridPrimitiveDragAndDropResource() {
  const [events, setEvents] = React.useState(initialEvents);

  const dateRange = React.useMemo(() => getEventsDateRange(events), [events]);
  const duration = Math.round(dateRange.end.diff(dateRange.start, 'hours').hours);

  const resources = React.useMemo(() => {
    return groupEventsByResource(events);
  }, [events]);

  const handleEventChange = React.useCallback((eventData) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventData.eventId
          ? {
              ...event,
              start: eventData.start,
              end: eventData.end,
              resource: eventData.columnId,
            }
          : event,
      ),
    );
  }, []);

  return (
    <div className={classes.Container}>
      <TimeGrid.Root className={classes.Root} onEventChange={handleEventChange}>
        <div className={classes.Header}>
          <div className={classes.TimeAxisHeaderCell} aria-hidden="true" />
          {resources.map((resource) => (
            <div key={resource.resource} className={classes.HeaderCell}>
              {resource.resource}
            </div>
          ))}
        </div>
        <div className={classes.Body}>
          <TimeGrid.ScrollableContent
            className={classes.ScrollableContent}
            role="row"
            style={{ '--duration': duration }}
          >
            <div className={classes.TimeAxis} aria-hidden="true">
              {Array.from({ length: duration }, (_, hour) => (
                <div
                  key={hour}
                  className={classes.TimeAxisCell}
                  style={{ '--hour-index': hour }}
                >
                  {hour === 0
                    ? null
                    : `${dateRange.start.plus({ hour }).toFormat('ccc hh a')}`}
                </div>
              ))}
            </div>
            {resources.map((resource) => (
              <TimeGridColumn
                key={resource.resource}
                resource={resource.resource}
                events={resource.events}
                allEvents={events}
                start={dateRange.start}
                end={dateRange.end}
              />
            ))}
          </TimeGrid.ScrollableContent>
        </div>
      </TimeGrid.Root>
    </div>
  );
}

function TimeGridColumn({ events, allEvents, resource, start, end }) {
  const placeholder = TimeGrid.usePlaceholderInRange(start, end);

  const placeholderEvent =
    placeholder == null || placeholder.columnId !== resource
      ? undefined
      : allEvents.find((calendarEvent) => calendarEvent.id === placeholder.eventId);

  return (
    <TimeGrid.Column
      start={start}
      end={end}
      columnId={resource}
      className={classes.Column}
    >
      {events.map((event) => (
        <TimeGrid.Event
          key={event.id}
          start={event.start}
          end={event.end}
          eventId={event.id}
          data-resource={event.resource}
          className={classes.Event}
          isDraggable
        >
          <TimeGrid.EventResizeHandler
            side="start"
            className={classes.EventResizeHandler}
          />
          <div className={classes.EventInformation}>
            <div className={classes.EventStartTime}>
              {event.start.toFormat('hh a')}
            </div>
            <div className={classes.EventTitle}>{event.title}</div>
          </div>
          <TimeGrid.EventResizeHandler
            side="end"
            className={classes.EventResizeHandler}
          />
        </TimeGrid.Event>
      ))}
      {placeholderEvent != null && placeholder != null && (
        <TimeGrid.Event
          start={placeholder.start}
          end={placeholder.end}
          eventId={placeholderEvent.id}
          data-resource={placeholderEvent.resource}
          className={classes.Event}
        >
          <div className={classes.EventInformation}>
            <div className={classes.EventStartTime}>
              {placeholder.start.toFormat('hh a')}
            </div>
            <div className={classes.EventTitle}>{placeholderEvent.title}</div>
          </div>
        </TimeGrid.Event>
      )}
    </TimeGrid.Column>
  );
}
