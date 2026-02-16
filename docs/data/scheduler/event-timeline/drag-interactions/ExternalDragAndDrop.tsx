import * as React from 'react';
import clsx from 'clsx';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { StandaloneEvent } from '@mui/x-scheduler/standalone-event';
import { SchedulerOccurrencePlaceholderExternalDragData } from '@mui/x-scheduler/models';
// TODO: Estimate if we can avoid all imports from the headless package.
import { buildIsValidDropTarget } from '@mui/x-scheduler-headless/build-is-valid-drop-target';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../../datasets/company-roadmap';
import classes from './ExternalDragAndDrop.module.css';

const isValidDropTarget = buildIsValidDropTarget(['EventTimelinePremiumEvent']);

const initialExternalEvents: SchedulerOccurrencePlaceholderExternalDragData[] = [
  {
    id: 'external-1',
    title: 'External Event 1',
    duration: 30,
  },
  {
    id: 'external-2',
    title: 'External Event 2',
    duration: 60,
  },
  {
    id: 'external-3',
    title: 'External Event 3',
    duration: 90,
  },
  {
    id: 'external-4',
    title: 'External Event 4',
    duration: 60,
  },
  {
    id: 'external-5',
    title: 'External Event 5',
    duration: 45,
  },
];

export default function ExternalDragAndDrop() {
  const [events, setEvents] = React.useState(initialEvents);
  const [placeholder, setPlaceholder] =
    React.useState<SchedulerOccurrencePlaceholderExternalDragData | null>(null);
  const [externalEvents, setExternalEvents] = React.useState(initialExternalEvents);

  const handleEventDropInsideEventCalendar = (
    removedEvent: SchedulerOccurrencePlaceholderExternalDragData,
  ) => {
    setExternalEvents((prev) =>
      prev.filter((event) => event.id !== removedEvent.id),
    );
  };

  const externalEventsContainerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!externalEventsContainerRef.current) {
      return undefined;
    }

    return dropTargetForElements({
      element: externalEventsContainerRef.current,
      canDrop: (arg) => isValidDropTarget(arg.source.data),
      onDragEnter: (args) => {
        const data = args.source.data as any;
        if (!isValidDropTarget(data)) {
          return;
        }

        const {
          displayTimezone: { start, end },
          ...eventData
        } = data.originalOccurrence;

        setPlaceholder({
          ...eventData,
          duration: differenceInMinutes(end.value, start.value),
        });
      },
      onDragLeave: () => {
        setPlaceholder(null);
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
            data={event}
            onEventDrop={() => handleEventDropInsideEventCalendar(event)}
            className={classes.ExternalEvent}
          >
            {event.title} ({event.duration} mins)
          </StandaloneEvent>
        ))}
        {placeholder != null && (
          <div className={classes.ExternalEvent} data-placeholder>
            {placeholder.title} ({placeholder.duration} mins)
          </div>
        )}
      </div>
      <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
        <EventTimelinePremium
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          areEventsDraggable
          canDragEventsFromTheOutside
          canDropEventsToTheOutside
        />
      </div>
    </div>
  );
}
