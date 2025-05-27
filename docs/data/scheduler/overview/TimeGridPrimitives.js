import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import classes from './TimeGridPrimitives.module.css';

const days = [
  {
    date: DateTime.fromISO('2025-05-26'),
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2025-05-26T07:30:00'),
        end: DateTime.fromISO('2025-05-26T08:15:00'),
        title: 'Footing',
        resource: 'personal',
      },
      {
        id: '2',
        start: DateTime.fromISO('2025-05-26T16:00:00'),
        end: DateTime.fromISO('2025-05-26T17:00:00'),
        title: 'Weekly',
        resource: 'work',
      },
    ],
  },
  {
    date: DateTime.fromISO('2025-05-27'),
    events: [
      {
        id: '3',
        start: DateTime.fromISO('2025-05-27T10:00:00'),
        end: DateTime.fromISO('2025-05-27T11:00:00'),
        title: 'Backlog grooming',
        resource: 'work',
      },
      {
        id: '4',
        start: DateTime.fromISO('2025-05-27T19:00:00'),
        end: DateTime.fromISO('2025-05-27T22:00:00'),
        title: 'Pizza party',
        resource: 'personal',
      },
    ],
  },
  {
    date: DateTime.fromISO('2025-05-28'),
    events: [
      {
        id: '5',
        start: DateTime.fromISO('2025-05-28T08:00:00'),
        end: DateTime.fromISO('2025-05-28T17:00:00'),
        title: 'Scheduler deep dive',
        resource: 'work',
      },
    ],
  },
  {
    date: DateTime.fromISO('2025-05-29'),
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2025-05-29T07:30:00'),
        end: DateTime.fromISO('2025-05-29T08:15:00'),
        title: 'Footing',
        resource: 'personal',
      },
    ],
  },
  {
    date: DateTime.fromISO('2025-05-30'),
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2025-05-30T15:00:00'),
        end: DateTime.fromISO('2025-05-30T15:45:00'),
        title: 'Retrospective',
        resource: 'work',
      },
    ],
  },
];

export default function TimeGridPrimitives() {
  const { scrollableRef, scrollerRef } = useInitialScrollPosition();

  return (
    <div className={classes.Container}>
      <TimeGrid.Root className={classes.Root}>
        <div className={classes.Header}>
          <div className={classes.TimeAxisHeaderCell} aria-hidden="true" />
          {days.map((day) => (
            <div key={day.date.toString()} className={classes.HeaderCell}>
              {day.date.toFormat('EEE, dd')}
            </div>
          ))}
        </div>
        <div className={classes.Body} ref={scrollerRef}>
          <div className={classes.ScrollableContent} ref={scrollableRef} role="row">
            <div className={classes.TimeAxis} aria-hidden="true">
              {Array.from({ length: 24 }, (_, hour) => (
                <div
                  key={hour}
                  className={classes.TimeAxisCell}
                  style={{ '--hour': hour }}
                >
                  {hour === 0
                    ? null
                    : `${DateTime.now().set({ hour }).toFormat('hh a')}`}
                </div>
              ))}
            </div>
            {days.map((day) => (
              <TimeGrid.Column
                key={day.date.toString()}
                value={day.date}
                className={classes.Column}
              >
                {day.events.map((event) => (
                  <TimeGrid.Event
                    key={event.id}
                    start={event.start}
                    end={event.end}
                    data-resource={event.resource}
                    className={classes.Event}
                  >
                    <div className={classes.EventInformation}>
                      <div className={classes.EventStartTime}>
                        {event.start.toFormat('hh a')}
                      </div>
                      <div className={classes.EventTitle}>{event.title}</div>
                    </div>
                  </TimeGrid.Event>
                ))}
              </TimeGrid.Column>
            ))}
          </div>
        </div>
      </TimeGrid.Root>
    </div>
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
    for (const day of days) {
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
