import * as React from 'react';
import clsx from 'clsx';
import { StandaloneEvent as HeadlessStandaloneEvent } from '@mui/x-scheduler-headless/standalone-event';
import { StandaloneEventProps } from './StandaloneEvent.types';
import { EventDragPreview } from '../internals/components/event-drag-preview';

export const StandaloneEvent = React.forwardRef<HTMLDivElement, StandaloneEventProps>(
  function StandaloneEvent(props, forwardedRef) {
    return (
      <HeadlessStandaloneEvent
        ref={forwardedRef}
        nativeButton={false}
        {...props}
        className={clsx('StandaloneEvent', props.className)}
        renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      />
    );
  },
);
