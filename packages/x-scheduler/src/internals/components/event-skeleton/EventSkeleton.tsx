'use client';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useEventCalendarStyledContext } from '../../../event-calendar/EventCalendarStyledContext';

export interface EventSkeletonProps {
  'data-variant': 'time-column' | 'day-grid' | 'agenda';
  className?: string;
}

const EventSkeletonRoot = styled(Skeleton, {
  name: 'MuiEventCalendar',
  slot: 'EventSkeleton',
})({
  opacity: 0.5,
  '&[data-variant="time-column"]': {
    position: 'absolute',
    left: 0,
    right: 12,
    top: 0,
    height: '100%',
    borderRadius: 0,
  },
  '&[data-variant="day-grid"]': {
    height: 18,
  },
  '&[data-variant="agenda"]': {
    height: 28,
  },
});

export function EventSkeleton(props: EventSkeletonProps) {
  const { classes } = useEventCalendarStyledContext();

  return (
    <EventSkeletonRoot
      variant="rounded"
      animation="wave"
      aria-hidden
      {...props}
      className={clsx(classes.eventSkeleton, props.className)}
    />
  );
}
