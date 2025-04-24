import * as React from 'react';
import { DateTime } from 'luxon';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import classes from './TimeGridPrimitives.module.css';

const startOfWeek = DateTime.now().startOf('week');
const createDate = (weekday, hour, minute) => {
  return startOfWeek.set({ weekday, hour, minute });
};

const days = [
  {
    date: createDate(1, 0, 0),
    events: [
      {
        id: '1',
        start: createDate(1, 7, 30),
        end: createDate(1, 8, 15),
        title: 'Footing',
        agenda: 'personal',
      },
      {
        id: '2',
        start: createDate(1, 16, 0),
        end: createDate(1, 17, 0),
        title: 'Weekly',
        agenda: 'work',
      },
    ],
  },
  {
    date: createDate(2, 0, 0),
    events: [
      {
        id: '3',
        start: createDate(2, 10, 0),
        end: createDate(2, 11, 0),
        title: 'Backlog grooming',
        agenda: 'work',
      },
      {
        id: '4',
        start: createDate(2, 19, 0),
        end: createDate(2, 22, 0),
        title: 'Pizza party',
        agenda: 'personal',
      },
    ],
  },
  {
    date: createDate(3, 0, 0),
    events: [
      {
        id: '5',
        start: createDate(3, 8, 0),
        end: createDate(3, 17, 0),
        title: 'Scheduler deep dive',
        agenda: 'work',
      },
    ],
  },
  {
    date: createDate(4, 0, 0),
    events: [
      {
        id: '1',
        start: createDate(4, 7, 30),
        end: createDate(4, 8, 15),
        title: 'Footing',
        agenda: 'personal',
      },
    ],
  },
  {
    date: createDate(5, 0, 0),
    events: [
      {
        id: '1',
        start: createDate(5, 15, 0),
        end: createDate(5, 15, 45),
        title: 'Retrospective',
        agenda: 'work',
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
                    data-agenda={event.agenda}
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

  useEnhancedEffect(() => {
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
