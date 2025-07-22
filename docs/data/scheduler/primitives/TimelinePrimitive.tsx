import * as React from 'react';
import clsx from 'clsx';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import classes from './TimelinePrimitive.module.css';
import { resources, Resource } from './timeline-events';

export default function TimelinePrimitive() {
  const getDayList = useDayList();

  const timeColumns = React.useMemo(() => {
    return getDayList({
      date: resources[0].events[0].start.startOf('day'),
      amount: 3,
    }).flatMap((date) =>
      Array.from({ length: 24 }, (_, hour) => date.set({ hour })),
    );
  }, [getDayList]);

  return (
    <div className={classes.Container}>
      <Timeline.Root items={resources} className={classes.Root}>
        <Timeline.SubGrid className={classes.SubGrid}>
          {(item: Resource) => (
            <Timeline.Row key={item.title} className={classes.Row}>
              <Timeline.Cell className={clsx(classes.Cell, classes.TitleCell)}>
                {item.title}
              </Timeline.Cell>
            </Timeline.Row>
          )}
        </Timeline.SubGrid>
        <Timeline.SubGrid
          className={clsx(classes.SubGrid, classes.ScrollableSubGrid)}
        >
          {(item: Resource, index: number, items: Resource[]) => (
            <Timeline.Row className={classes.Row}>
              {timeColumns.map((date) => (
                <Timeline.Cell
                  key={date.toString()}
                  className={clsx(classes.Cell, classes.TimeCell)}
                />
              ))}
            </Timeline.Row>
          )}
        </Timeline.SubGrid>
      </Timeline.Root>
    </div>
  );
}
