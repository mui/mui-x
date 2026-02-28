import * as React from 'react';
import { styled } from '@mui/material/styles';
import { teal } from '@mui/material/colors';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { StandaloneEvent } from '@mui/x-scheduler/standalone-event';

// TODO: Estimate if we can avoid all imports from the headless package.
import { buildIsValidDropTarget } from '@mui/x-scheduler-headless/build-is-valid-drop-target';
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

const externalEventStyles = (theme) => ({
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

const isValidDropTarget = buildIsValidDropTarget(['TimelineGridEvent']);

const initialExternalEvents = [
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
  const [placeholder, setPlaceholder] = React.useState(null);
  const [externalEvents, setExternalEvents] = React.useState(initialExternalEvents);

  const handleEventDropInsideEventCalendar = (removedEvent) => {
    setExternalEvents((prev) =>
      prev.filter((event) => event.id !== removedEvent.id),
    );
  };

  const externalEventsContainerRef = React.useRef(null);
  React.useEffect(() => {
    if (!externalEventsContainerRef.current) {
      return undefined;
    }

    return dropTargetForElements({
      element: externalEventsContainerRef.current,
      canDrop: (arg) => isValidDropTarget(arg.source.data),
      onDragEnter: (args) => {
        const data = args.source.data;
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
    <Container className="mui-x-scheduler">
      <ExternalEventsContainer ref={externalEventsContainerRef}>
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
      </ExternalEventsContainer>
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
    </Container>
  );
}
