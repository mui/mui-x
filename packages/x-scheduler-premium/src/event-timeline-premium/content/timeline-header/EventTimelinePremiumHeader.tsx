'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { eventTimelinePremiumClasses as classes } from '../../eventTimelinePremiumClasses';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';

const StyledTimelineGridHeader = styled(TimelineGrid.Header, {
  name: 'MuiEventTimeline',
  slot: 'Header',
})(({ theme }) => ({
  [`& .${classes.headerLevelRow}`]: {
    display: 'flex',
    minWidth: 'calc(var(--unit-count) * var(--unit-width))',
    '&:not(:last-child)': {
      borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
  },
  [`& .${classes.headerCell}`]: {
    width: 'calc(var(--unit-width) * var(--span))',
    flexShrink: 0,
    padding: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    whiteSpace: 'nowrap',
    '&:not(:last-child)': {
      borderRight: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
    '&[data-level]:not([data-level="0"])': {
      color: (theme.vars || theme).palette.text.secondary,
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&[data-unit="hour"]': {
      padding: theme.spacing(1, 0),
      borderRight: 'none',
    },
    '&[data-unit="day"][data-unit-leaf]': {
      padding: theme.spacing(0.5),
    },
    '&[data-unit-leaf][data-weekend]': {
      color: (theme.vars || theme).palette.error.main,
    },
    // Conventions used by the default `dayAndMonth` preset's renderCell: the weekday letter
    // sits above the day number and only the letter turns red on weekends.
    '& [data-slot="dayCell"]': {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing(0.5),
    },
    '& [data-slot="weekday"]': {
      color: (theme.vars || theme).palette.text.secondary,
      fontWeight: theme.typography.fontWeightRegular,
    },
    '& [data-slot="dayOfMonth"]': {
      color: (theme.vars || theme).palette.text.primary,
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&[data-unit-leaf][data-weekend] [data-slot="weekday"]': {
      color: (theme.vars || theme).palette.error.main,
    },
  },
  [`& .${classes.headerCellLabel}`]: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25em',
  },
}));

export const EventTimelinePremiumHeader = React.forwardRef(function EventTimelinePremiumHeader(
  props: EventTimelinePremiumHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { classes: ctxClasses } = useEventTimelinePremiumStyledContext();
  return (
    <StyledTimelineGridHeader
      ref={forwardedRef}
      {...props}
      className={ctxClasses.header}
      classNames={{
        row: ctxClasses.headerLevelRow,
        cell: ctxClasses.headerCell,
        label: ctxClasses.headerCellLabel,
      }}
    />
  );
});

export namespace EventTimelinePremiumHeader {
  export interface Props extends TimelineGrid.Header.Props {}
}
