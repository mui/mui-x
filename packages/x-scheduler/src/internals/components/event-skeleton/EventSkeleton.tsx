'use client';
import clsx from 'clsx';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { useSharedComponentsStyledContext } from '../SharedComponentsStyledContext';

export interface EventSkeletonProps {
  'data-variant': 'time-column' | 'day-grid' | 'agenda' | 'timeline-row';
  className?: string;
}

const EventSkeletonRoot = styled(Skeleton, {
  name: 'MuiEventSkeleton',
  slot: 'Root',
})(({ theme }) => ({
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
  '&[data-variant="timeline-row"]': {
    height: `calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1.125)})`,
    width: '100%',
  },
}));

export function EventSkeleton(props: EventSkeletonProps) {
  const { classes } = useSharedComponentsStyledContext();

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
