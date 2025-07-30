import * as React from 'react';
import clsx from 'clsx';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { boundaries, resources, Resource } from './timeline-events';
import classes from './TimelinePrimitive.module.css';

export default function TimelinePrimitive() {
  const dayCount = React.useMemo(
    () => boundaries.end.diff(boundaries.start, 'days').days + 1,
    [],
  );

  return (
    <div className={classes.Container}>
      <Timeline.Root
        items={resources}
        className={classes.Root}
        style={{ '--day-count': dayCount } as React.CSSProperties}
      >
        <Timeline.SubGrid className={classes.SubGrid}>
          {(item: Resource) => (
            <Timeline.Row key={item.title} className={classes.Row}>
              <Timeline.Cell className={clsx(classes.Cell, classes.TitleCell)}>
                {item.title}
              </Timeline.Cell>
            </Timeline.Row>
          )}
        </Timeline.SubGrid>
        <div className={classes.EventSubGridContainer}>
          <Timeline.SubGrid className={clsx(classes.SubGrid, classes.EventSubGrid)}>
            {(item: Resource) => (
              <Timeline.EventRow
                key={item.title}
                className={classes.Row}
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
              </Timeline.EventRow>
            )}
          </Timeline.SubGrid>
        </div>
      </Timeline.Root>
    </div>
  );
}
