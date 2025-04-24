import * as React from 'react';
import { DateTime } from 'luxon';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import classes from './TimeGridPrimitives.module.css';

const days = [
  {
    date: DateTime.fromISO('2025-10-06'),
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2025-10-06T16:00:00'),
        end: DateTime.fromISO('2025-10-06T17:00:00'),
        title: 'eXplore weekly',
      },
    ],
  },
  {
    date: DateTime.fromISO('2025-10-07'),
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2025-10-07T10:00:00'),
        end: DateTime.fromISO('2025-10-07T11:00:00'),
        title: 'Backlog grooming',
      },
      {
        id: '2',
        start: DateTime.fromISO('2025-10-07T14:00:00'),
        end: DateTime.fromISO('2025-10-07T18:00:00'),
        title: 'Out of office',
      },
    ],
  },
  {
    date: DateTime.fromISO('2025-10-08'),
    events: [],
  },
];

export default function TimeGridPrimitives() {
  // TODO: Should the automatic scrolling be built-in?
  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  useEnhancedEffect(() => {
    if (!scrollableRef.current || !scrollerRef.current) {
      return;
    }

    let earliestStart: number | null = null;
    for (const day of days) {
      for (const event of day.events) {
        const startMinute = event.start.hour * 60 + event.start.minute;

        if (earliestStart == null || startMinute < earliestStart) {
          earliestStart = startMinute;
        }
      }
    }

    if (earliestStart == null) {
      return;
    }

    const clientHeight = scrollableRef.current.clientHeight;

    console.log(clientHeight);

    const earliestStartPx = earliestStart * (clientHeight / (24 * 60)) - 24;
    scrollerRef.current.scrollTop = earliestStartPx;
  }, []);

  return (
    <div className={classes.Container}>
      <TimeGrid.Root className={classes.Root}>
        <div className={classes.Header}>
          {days.map((day) => (
            <div key={day.date.toString()} className={classes.HeaderCell}>
              {day.date.toFormat('EEE, dd')}
            </div>
          ))}
        </div>
        <div className={classes.Body} ref={scrollerRef}>
          <div className={classes.ScrollableContent} ref={scrollableRef}>
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
                    className={classes.Event}
                  >
                    {event.title}
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
