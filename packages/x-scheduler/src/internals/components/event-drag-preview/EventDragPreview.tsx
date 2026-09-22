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

export function EventDragPreview(props: RenderDragPreviewParameters) {
  const store = useSchedulerStoreContext();
  const styledContext = React.useContext(EventCalendarStyledContext);
  const color = useStore(store, schedulerEventSelectors.color, props.data.id, undefined);

  return (
    <EventDragPreviewRoot className={styledContext?.classes.eventDragPreview} data-palette={color}>
      {props.data.title}
    </EventDragPreviewRoot>
  );
}
