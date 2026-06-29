'use client';
import clsx from 'clsx';
import Skeleton from '@mui/material/Skeleton';
import { styled, CSSObject } from '@mui/material/styles';
import { useSharedComponentsStyledContext } from '../SharedComponentsStyledContext';

export type EventSkeletonVariant = 'time-column' | 'day-grid' | 'agenda' | 'timeline-row';

export interface EventSkeletonProps {
  'data-variant': EventSkeletonVariant;
  className?: string;
}

const EventSkeletonRoot = styled(Skeleton, {
  name: 'MuiEventSkeleton',
  slot: 'Root',
})(({ theme }) => {
  // Typing the styles per variant makes adding a new `EventSkeletonVariant`
  // without a matching style block a compile error.
  const variantStyles: Record<EventSkeletonVariant, CSSObject> = {
    'time-column': {
      position: 'absolute',
      left: 0,
      right: 12,
      top: 0,
      height: '100%',
      borderRadius: 0,
    },
    'day-grid': {
      height: 18,
    },
    agenda: {
      height: 28,
    },
    'timeline-row': {
      height: `calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1.125)})`,
      width: '100%',
    },
  };

  return {
    opacity: 0.5,
    ...Object.fromEntries(
      Object.entries(variantStyles).map(([variant, style]) => [
        `&[data-variant="${variant}"]`,
        style,
      ]),
    ),
  };
});

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
