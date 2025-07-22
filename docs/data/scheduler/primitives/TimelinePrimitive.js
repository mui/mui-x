import * as React from 'react';
import clsx from 'clsx';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import { boundaries, resources } from './timeline-events';
import classes from './TimelinePrimitive.module.css';

export default function TimelinePrimitive() {
  const getDayList = useDayList();

  const timeColumns = React.useMemo(() => {
    return getDayList({
      date: boundaries.start,
      amount: boundaries.end.diff(boundaries.start, 'days').days + 1,
    });
  }, [getDayList]);

  return (
    <div className={classes.Container}>
      <Timeline.Root items={resources} className={classes.Root}>
        <Timeline.SubGrid className={classes.SubGrid}>
          {(item) => (
            <Timeline.Row key={item.title} className={classes.Row}>
              <Timeline.Cell className={clsx(classes.Cell, classes.TitleCell)}>
                {item.title}
              </Timeline.Cell>
            </Timeline.Row>
          )}
        </Timeline.SubGrid>
        <div className={classes.ScrollableSubGridContainer}>
          <Timeline.SubGrid className={clsx(classes.SubGrid)}>
            {(item) => (
              <Timeline.Row className={classes.Row}>
                {timeColumns.map((date) => (
                  <Timeline.Cell
                    key={date.toString()}
                    className={clsx(classes.Cell, classes.TimeCell)}
                  />
                ))}
                <Timeline.RowEvents
                  className={classes.RowEvents}
                  start={boundaries.start}
                  end={boundaries.end}
                >
                  {item.events.map((event) => (
                    <Timeline.Event
                      key={event.id}
                      className={classes.Event}
                      start={event.start}
                      end={event.end}
                    >
                      {event.title}
                    </Timeline.Event>
                  ))}
                </Timeline.RowEvents>
              </Timeline.Row>
            )}
          </Timeline.SubGrid>
        </div>
      </Timeline.Root>
    </div>
  );
}
