'use client';
import type * as React from 'react';
import type { CSSObject, Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EVENT_CALENDAR_CONTAINER_NAME } from '../../../constants';
import type { PaletteName } from '../../../utils/tokens';
import { getPaletteVariants } from '../../../utils/tokens';

export const linesClampStyles = (maximumLines: number = 1): React.CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: maximumLines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

export const getTimeGridEventRootStyles = (theme: Theme): CSSObject => ({
  '--time-grid-event-column-gap': '12px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle)',
  position: 'absolute',
  left: 'calc( ((100% - var(--time-grid-event-column-gap)) / var(--columns-count)) * (var(--first-index) - 1))',
  right:
    'calc(((100% - var(--time-grid-event-column-gap)) * (var(--columns-count) - var(--last-index))) / var(--columns-count) + var(--time-grid-event-column-gap))',
  top: 'calc(var(--y-position) + 1px)',
  bottom: 'calc(100% - var(--y-position) - var(--height))',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  minHeight: 11.5,
  containerType: 'size',
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
  },
  '&[data-under-hour="true"]': {
    flexDirection: 'row',
  },

  '&:focus-visible': {
    outline: '2px solid var(--event-surface-accent)',
    outlineOffset: 2,
  },
  variants: getPaletteVariants(theme),
  [`@container ${EVENT_CALENDAR_CONTAINER_NAME} (width < 550px)`]: {
    '--time-grid-event-column-gap': '0px',
  },
});

export const TimeGridEventPlaceholder = styled(CalendarGrid.TimeEventPlaceholder, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventPlaceholder',
})<{ palette?: PaletteName }>(({ theme }) => ({
  '--time-grid-event-column-gap': '12px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle-hover)',
  border: `1px dashed var(--event-on-surface-subtle-secondary)`,
  color: 'var(--event-on-surface-subtle-primary)',
  position: 'absolute',
  left: 'calc(((100% - var(--time-grid-event-column-gap)) / var(--columns-count)) * (var(--first-index) - 1))',
  right:
    'calc(((100% - var(--time-grid-event-column-gap)) * (var(--columns-count) - var(--last-index))) / var(--columns-count) + var(--time-grid-event-column-gap))',
  top: 'var(--y-position)',
  bottom: 'calc(100% - var(--y-position) - var(--height))',
  zIndex: 2,
  padding: theme.spacing(0.5, 2, 0.5, 1.5),
  containerType: 'size',
  minHeight: 11.5,
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0, 1),
  },
  variants: getPaletteVariants(theme),
  '&::before': {
    content: '""',
    position: 'absolute',
  },
  [`@container ${EVENT_CALENDAR_CONTAINER_NAME} (width < 550px)`]: {
    '--time-grid-event-column-gap': '0px',
  },
}));
