import * as React from 'react';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { HeaderToolbar } from './header-toolbar';
import { TimelineViewProps } from './TimelineView.types';
import { Timeline } from '../../primitives/timeline';
import { selectors } from '../../primitives/use-event-calendar';
import './TimelineView.css';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { useStore } from '@base-ui-components/utils/store/useStore';

export function TimelineView(props: TimelineViewProps) {
  const { className, ...other } = props;
  const { store, instance } = useEventCalendarContext();
  const resources = useStore(store, selectors.resources);
  const eventsGroupedByResource = useStore(store, selectors.eventsToRenderGroupedByResource);

  const boundaries = {
    start: DateTime.fromISO('2027-01-31T00:00:00'),
    end: DateTime.fromISO('2027-02-20T00:00:00'),
  };

  console.log('resources', resources, 'events', eventsGroupedByResource);

  return (
    <div className={clsx('TimelineViewContainer', 'mui-x-scheduler', className)} {...other}>
      <HeaderToolbar />
      <div className="TimelineViewContent">
        <Timeline.Root
          items={resources}
          className="TimelineRoot"
          style={{ '--day-count': 4 } as React.CSSProperties}
        >
          <Timeline.SubGrid className="EventSubGrid">
            {(item) => (
              <React.Fragment key={item.name}>
                <Timeline.Row className="TimelineRow">
                  <Timeline.Cell className={clsx('TimelineCell', 'TimelineTitleCell')}>
                    {item.name}
                  </Timeline.Cell>
                </Timeline.Row>
                <Timeline.EventRow
                  className="TimelineEventRow"
                  start={boundaries.start}
                  end={boundaries.end}
                >
                  {eventsGroupedByResource[item.id]?.map((event) => (
                    <Timeline.Event
                      key={event.id}
                      className="Event"
                      start={event.start}
                      end={event.end}
                    >
                      {event.title}
                    </Timeline.Event>
                  ))}
                </Timeline.EventRow>
              </React.Fragment>
            )}
          </Timeline.SubGrid>
        </Timeline.Root>
      </div>
    </div>
  );
}
