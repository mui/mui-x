'use client';
// TODO: unify with EventSkeleton from `@mui/x-scheduler/internals` — the two only diverge by which styled context they read.
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
  height: `calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1)})`,
  width: '100%',
}));

export function EventTimelinePremiumSkeleton(props: EventTimelinePremiumSkeletonProps) {
  const { classes } = useEventTimelinePremiumStyledContext();

  return (
    <EventTimelinePremiumSkeletonRoot
      variant="rounded"
      animation="wave"
      aria-hidden
      {...props}
      className={clsx(classes.eventSkeleton, props.className)}
    />
  );
}
