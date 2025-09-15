import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';

import classes from './TimeGridPrimitive.module.css';
import { initialEvents, groupEventsByDay } from './time-grid-events';

export default function TimeGridPrimitiveDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);
  const { scrollableRef, scrollerRef } = useInitialScrollPosition();

  const days = React.useMemo(() => {
    return groupEventsByDay(events);
  }, [events]);

  const handleEventChange = React.useCallback((eventData) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventData.eventId
          ? { ...event, start: eventData.start, end: eventData.end }
          : event,
      ),
    );
  }, []);

  return (
    <div className={classes.Container}>
      <TimeGrid.Root className={classes.Root} onEventChange={handleEventChange}>
        <div className={classes.Header}>
          <div className={classes.TimeAxisHeaderCell} aria-hidden="true" />
          {days.map((day) => (
            <div key={day.date.toString()} className={classes.HeaderCell}>
              {day.date.toFormat('EEE, dd')}
            </div>
          ))}
        </div>
        <div className={classes.Body} ref={scrollerRef}>
          <TimeGrid.ScrollableContent
            className={classes.ScrollableContent}
            ref={scrollableRef}
            style={{ '--duration': 24 }}
            role="row"
          >
            <div className={classes.TimeAxis} aria-hidden="true">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className={classes.TimeAxisCell}
                  style={{ '--hour-index': hour }}
                >
                  {hour === 0
                    ? null
                    : `${DateTime.now().set({ hour }).toFormat('hh a')}`}
                </div>
              ))}
            </div>
            {days.map((day) => (
              <TimeGridColumn
                key={day.date.toString()}
                day={day.date}
                events={day.events}
                allEvents={events}
              />
            ))}
          </TimeGrid.ScrollableContent>
        </div>
      </TimeGrid.Root>
    </div>
  );
}

function TimeGridColumn({ events, allEvents, day }) {
  const placeholder = TimeGrid.usePlaceholderInRange(
    day.startOf('day'),
    day.endOf('day'),
  );

  const placeholderEvent =
    placeholder == null
      ? undefined
      : allEvents.find((calendarEvent) => calendarEvent.id === placeholder.eventId);

  return (
    <TimeGrid.Column
      key={day.toString()}
      start={day.startOf('day')}
      end={day.endOf('day')}
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
        <TimeGrid.EventPlaceholder
          start={placeholder.start}
          end={placeholder.end}
          data-resource={placeholderEvent.resource}
          className={classes.Event}
        >
          <div className={classes.EventInformation}>
            <div className={classes.EventStartTime}>
              {placeholder.start.toFormat('hh a')}
            </div>
            <div className={classes.EventTitle}>{placeholderEvent.title}</div>
          </div>
        </TimeGrid.EventPlaceholder>
      )}
    </TimeGrid.Column>
  );
}

function useInitialScrollPosition() {
  // TODO: Should the automatic scrolling be built-in?
  const scrollableRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (!scrollableRef.current || !scrollerRef.current) {
      return;
    }

    let earliestStart = null;
    for (const day of groupEventsByDay(initialEvents)) {
      for (const event of day.events) {
        const startMinute = event.start.hour * 60 + event.start.minute;

        if (event.start < day.date.startOf('day')) {
          earliestStart = 0;
        } else if (earliestStart == null || startMinute < earliestStart) {
          earliestStart = startMinute;
        }
      }
    }

    if (earliestStart == null) {
      return;
    }

    const clientHeight = scrollableRef.current.clientHeight;

    const earliestStartPx = earliestStart * (clientHeight / (24 * 60)) - 24;
    scrollerRef.current.scrollTop = earliestStartPx;
  }, []);

  return { scrollableRef, scrollerRef };
}
