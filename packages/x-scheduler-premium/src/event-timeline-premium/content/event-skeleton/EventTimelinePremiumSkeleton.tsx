'use client';
// TODO #22309: unify with EventSkeleton from `@mui/x-scheduler/internals` — diverges in props (no `data-variant`), sizing (theme-derived height vs variant-based absolute positioning), and styled context. On unification, prefer the timeline's theme-derived sizing.
import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

export interface EventTimelinePremiumSkeletonProps {
  className?: string;
}

const EventTimelinePremiumSkeletonRoot = styled(Skeleton, {
  name: 'MuiEventTimeline',
  slot: 'EventSkeleton',
})(({ theme }) => ({
  opacity: 0.5,
  height: `calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1.125)})`,
  width: '100%',
}));

export function EventTimelinePremiumSkeleton(props: EventTimelinePremiumSkeletonProps) {
  const { className } = props;
  const { classes } = useEventTimelinePremiumStyledContext();

  return (
    <EventTimelinePremiumSkeletonRoot
      variant="rounded"
      animation="wave"
      aria-hidden
      className={clsx(classes.eventSkeleton, className)}
    />
  );
}
