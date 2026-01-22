'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { StandaloneEvent as HeadlessStandaloneEvent } from '@mui/x-scheduler-headless/standalone-event';
import { StandaloneEventProps } from './StandaloneEvent.types';
import { EventDragPreview } from '../internals/components/event-drag-preview';

const StandaloneEventRoot = styled(HeadlessStandaloneEvent, {
  name: 'MuiEventCalendar',
  slot: 'StandaloneEvent',
})({});

export const StandaloneEvent = React.forwardRef<HTMLDivElement, StandaloneEventProps>(
  function StandaloneEvent(props, forwardedRef) {
    return (
      <StandaloneEventRoot
        ref={forwardedRef}
        {...props}
        renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      />
    );
  },
);
