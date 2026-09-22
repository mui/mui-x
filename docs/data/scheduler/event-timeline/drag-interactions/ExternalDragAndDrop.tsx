import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { teal } from '@mui/material/colors';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { Draggable } from '@base-ui/react/draggable';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { StandaloneEvent } from '@mui/x-scheduler/standalone-event';
import { SchedulerOccurrencePlaceholderExternalDragData } from '@mui/x-scheduler/models';
// TODO: Estimate if we can avoid all imports from the internals package.
import { schedulerTimelineEventMoveKind } from '@mui/x-scheduler-internals/internals';
import {
  defaultVisibleDate,
  initialEvents,
  resources,
} from '../../datasets/company-roadmap';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
});

const ExternalEventsContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
  minHeight: 34,
});

const externalEventStyles = (theme: Theme) => ({
  padding: '4px 8px',
  borderRadius: 4,
  border: `1px solid ${teal[700]}`,
  backgroundColor: teal[100],
  ...theme.applyStyles('dark', {
    border: `1px solid ${teal[300]}`,
    backgroundColor: '#044036',
  }),
  '&[data-placeholder]': {
    opacity: 0.5,
  },
  '&[data-dragging]': {
    opacity: 0.5,
  },
});

const StyledStandaloneEvent = styled(StandaloneEvent)(({ theme }) =>
  externalEventStyles(theme),
);

const ExternalEventPlaceholder = styled('div')(({ theme }) =>
  externalEventStyles(theme),
);

const acceptedKinds = [schedulerTimelineEventMoveKind];

function getExternalEvent(
  data: Draggable.AcceptedDragData<typeof acceptedKinds> | undefined,
): SchedulerOccurrencePlaceholderExternalDragData | null {
  if (!data) {
    return null;
  }

  const {
    displayTimezone: { start, end },
    ...eventData
  } = data.originalOccurrence;

  return {
    ...eventData,
    duration: differenceInMinutes(end.value, start.value),
  };
}

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

  return (
    <Draggable.Provider>
      <Container className="mui-x-scheduler">
        <Draggable.Target
          accept={acceptedKinds}
          onDraggableEnter={({ source }) => {
            setPlaceholder(getExternalEvent(source.dragData));
          }}
          onDraggableLeave={() => setPlaceholder(null)}
          onDraggableDrop={({ source }) => {
            const event = getExternalEvent(source.dragData);
            if (event === null) {
              return;
            }
            setExternalEvents((prev) => [...prev, event]);
            setEvents((prev) => prev.filter((item) => item.id !== event.id));
            setPlaceholder(null);
          }}
          render={<ExternalEventsContainer />}
        >
          {externalEvents.map((event) => (
            <StyledStandaloneEvent
              key={event.id}
              data={event}
              onEventDrop={() => handleEventDropInsideEventCalendar(event)}
            >
              {event.title} ({event.duration} mins)
            </StyledStandaloneEvent>
          ))}
          {placeholder != null && (
            <ExternalEventPlaceholder data-placeholder>
              {placeholder.title} ({placeholder.duration} mins)
            </ExternalEventPlaceholder>
          )}
        </Draggable.Target>
        <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
          <EventTimelinePremium
            events={events}
            resources={resources}
            defaultVisibleDate={defaultVisibleDate}
            onEventsChange={setEvents}
            canDragEventsFromTheOutside
            canDropEventsToTheOutside
            defaultPreset="monthAndYear"
          />
        </div>
      </Container>
    </Draggable.Provider>
  );
}
