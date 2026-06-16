'use client';
import * as React from 'react';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import {
  EVENT_CALENDAR_CONTAINER_NAME,
  RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM,
} from '../../../constants';
import { getPaletteVariants, PaletteName } from '../../../utils/tokens';

export const linesClampStyles = (maximumLines: number = 1): React.CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: maximumLines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

// Visible diameter of the circular touch resize handle.
const TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX = 14;
// Target hit-area size, following WCAG 2.5.8 (24px min) and Apple HIG (44px) touch guidance.
const TOUCH_RESIZE_HANDLE_HIT_SIZE_PX = 44;
// How far the (transparent) hit area extends past the visible dot on each expanded side.
const TOUCH_RESIZE_HANDLE_HIT_INSET_PX = -(
  (TOUCH_RESIZE_HANDLE_HIT_SIZE_PX - TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX) /
  2
);

/**
 * Styles for a circular touch resize handle, centralized so every touch surface (time grid now,
 * day grid later) renders the same accessible target.
 *
 * The visible dot stays {@link TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX}px, but a transparent `::before`
 * expands the *hit area* to ~{@link TOUCH_RESIZE_HANDLE_HIT_SIZE_PX}px. The pseudo-element is part
 * of this element for hit-testing, so pointer events on it dispatch here — where the resize
 * listeners and pointer capture live.
 *
 * The hit area is biased *outward* (the start handle only grows upward, the end handle only
 * downward), so the two handles' hit areas never overlap until the event is shorter than the dot
 * itself — a min-height guard that keeps the wrong edge from grabbing on short events.
 */
export const getTouchResizeHandleStyles = (): CSSObject => ({
  position: 'absolute',
  width: TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX,
  height: TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX,
  borderRadius: '50%',
  backgroundColor: 'var(--event-main)',
  border: '2px solid var(--event-on-surface-subtle-primary)',
  zIndex: 3,
  cursor: 'ns-resize',
  // Prevent the browser from scrolling/zooming while the resize gesture is in progress.
  touchAction: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    insetInline: TOUCH_RESIZE_HANDLE_HIT_INSET_PX,
  },
  '&[data-start]': {
    top: -TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX / 2,
    left: 6,
    // Grow the hit area upward (away from the event), not down toward the end handle.
    '&::before': { top: TOUCH_RESIZE_HANDLE_HIT_INSET_PX, bottom: 0 },
  },
  '&[data-end]': {
    bottom: -TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX / 2,
    right: 6,
    // Grow the hit area downward (away from the event), not up toward the start handle.
    '&::before': { bottom: TOUCH_RESIZE_HANDLE_HIT_INSET_PX, top: 0 },
  },
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
  [`@container ${EVENT_CALENDAR_CONTAINER_NAME} (width < ${RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM}px)`]:
    {
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
  [`@container ${EVENT_CALENDAR_CONTAINER_NAME} (width < ${RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM}px)`]:
    {
      '--time-grid-event-column-gap': '0px',
    },
}));
