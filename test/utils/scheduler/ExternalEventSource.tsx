import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerExternalEventKind } from '@mui/x-scheduler/internals';
import type { SchedulerExternalEventDragPayload } from '@mui/x-scheduler-internals/internals';

/**
 * A consumer's own draggable that drops an external event in Scheduler, in its own provider like
 * an item of a list outside the Scheduler. Shows no preview unless it receives one.
 */
export function ExternalEventSource(props: {
  eventData: SchedulerExternalEventDragPayload['eventData'];
  onEventDrop?: () => void;
  preview?: React.ReactNode;
  'data-testid'?: string;
  children?: React.ReactNode;
}) {
  const {
    eventData,
    onEventDrop,
    preview = <Draggable.Preview disabled />,
    'data-testid': testId = 'external-source',
    children = eventData.title,
  } = props;
  const payload = React.useMemo(() => ({ eventData, onEventDrop }), [eventData, onEventDrop]);
  return (
    <Draggable.Provider>
      <Draggable.Root kind={schedulerExternalEventKind} payload={payload} data-testid={testId}>
        {children}
        {preview}
      </Draggable.Root>
    </Draggable.Provider>
  );
}
