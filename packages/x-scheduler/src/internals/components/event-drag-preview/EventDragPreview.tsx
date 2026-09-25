'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import type { RenderDragPreviewParameters } from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { PaletteName } from '../../utils/tokens';
import { getPaletteVariants } from '../../utils/tokens';
import { EventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';

const EventDragPreviewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'EventDragPreview',
})<{ palette?: PaletteName }>(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
  fontSize: theme.typography.body2.fontSize,
  backgroundColor: 'var(--event-surface-bold)',
  color: 'var(--event-on-surface-bold)',
  variants: getPaletteVariants(theme),
}));

function InternalEventDragPreview(
  props: Extract<RenderDragPreviewParameters, { type: 'internal-event' }>,
) {
  const store = useSchedulerStoreContext();
  const color = useStore(store, schedulerEventSelectors.color, props.data.id, undefined);
  return <EventDragPreviewContent title={props.data.title} color={color} />;
}

function EventDragPreviewContent({ title, color }: { title: string; color: PaletteName }) {
  const styledContext = React.useContext(EventCalendarStyledContext);
  return (
    <EventDragPreviewRoot className={styledContext?.classes.eventDragPreview} data-palette={color}>
      {title}
    </EventDragPreviewRoot>
  );
}

export function EventDragPreview(props: RenderDragPreviewParameters) {
  if (props.type === 'standalone-event') {
    return <EventDragPreviewContent title={props.data.title} color={props.data.color ?? 'teal'} />;
  }
  return <InternalEventDragPreview {...props} />;
}
