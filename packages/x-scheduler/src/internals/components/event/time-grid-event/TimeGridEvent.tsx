'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import { useStore } from '@base-ui/utils/store';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import {
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { EventDragPreview } from '../../../components/event-drag-preview';
import { useFormatTime } from '../../../hooks/useFormatTime';
import { getPaletteVariants, PaletteName } from '../../../utils/tokens';
import { useEventCalendarStyledContext } from '../../../../event-calendar/EventCalendarStyledContext';
import { useTimeGridEvent } from './useTimeGridEvent';
import {
  EVENT_CALENDAR_CONTAINER_NAME,
  RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM,
} from '../../../constants';

// The single event component follows the real device: visuals split via these media queries, while
// the resize behavior follows the actual pointer (handled inside the resize primitive).
const HOVER_MEDIA = '@media (hover: hover)';
const TOUCH_MEDIA = '@media (pointer: coarse)';

const linesClampStyles = (maximumLines: number = 1): React.CSSProperties => ({
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
 * Styles for a circular touch resize handle.
 *
 * The visible dot stays {@link TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX}px, while a transparent `::before`
 * expands the hit area to {@link TOUCH_RESIZE_HANDLE_HIT_SIZE_PX}px. The hit area is biased outward
 * (start grows up, end grows down) so the two handles never overlap until the event is shorter than
 * the dot, keeping the wrong edge from grabbing on short events.
 */
const getTouchResizeHandleStyles = (): CSSObject => ({
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

const STACKED_TITLE_LINE_HEIGHT_PX = 12;
const STACKED_EVENT_VERTICAL_PADDING_PX = 4;
const STACKED_TITLE_MAX_LINES = 24;

// Container-query steps that grow the (stacked) title's line clamp with the available height.
const stackedTitleLineClampSteps: CSSObject = {};
for (let lines = 2; lines <= STACKED_TITLE_MAX_LINES; lines += 1) {
  const minHeight = STACKED_EVENT_VERTICAL_PADDING_PX + lines * STACKED_TITLE_LINE_HEIGHT_PX;
  stackedTitleLineClampSteps[`@container (min-height: ${minHeight}px)`] = {
    WebkitLineClamp: lines,
    maxHeight: `${lines * STACKED_TITLE_LINE_HEIGHT_PX}px`,
  };
}

// Applied to every title rendered above the time (tall events, and all touch events), so the title
// wraps to multiple lines scaled to the event height.
const stackedTitleStyles: CSSObject = {
  lineHeight: `${STACKED_TITLE_LINE_HEIGHT_PX}px`,
  maxHeight: `${STACKED_TITLE_LINE_HEIGHT_PX}px`,
  ...stackedTitleLineClampSteps,
};

const getTimeGridEventRootStyles = (theme: Theme): CSSObject => ({
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

const TimeGridEventRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventRoot',
})<{ palette?: PaletteName }>(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 1, 0.5, 1),
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0, 1),
  },
  '&[role="button"]': {
    cursor: 'pointer',
  },
  // Accent bar on the leading edge.
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    borderRadius: '4px 0 0 4px',
    background: 'var(--event-surface-accent)',
    pointerEvents: 'none',
  },
  // Mouse / hover-capable devices: hover affordance and the filled "selected" look while editing.
  [HOVER_MEDIA]: {
    '&:hover': {
      backgroundColor: 'var(--event-surface-subtle-hover)',
    },
    '&[data-editing]': {
      backgroundColor: 'var(--event-surface-selected)',
      color: 'var(--event-on-surface-selected)',
      '&:hover': {
        backgroundColor: 'var(--event-surface-selected-hover)',
      },
    },
    '&[data-editing]::before': {
      background: 'var(--event-surface-selected)',
    },
  },
  // Touch devices: tighter padding, an armed selection outline, and no accent bar.
  [TOUCH_MEDIA]: {
    padding: theme.spacing(0.5, 0.7, 0.5, 0.7),
    '&[data-under-fifteen-minutes="true"]': {
      padding: theme.spacing(0, 0.5),
    },
    '&[data-armed]': {
      outline: '2px solid var(--event-main)',
      outlineOffset: '-2px',
    },
    '&::before': {
      display: 'none',
    },
  },
}));

const TimeGridEventTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-on-surface-subtle-primary)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 'var(--EventCalendar-fontSize-eventTitle, 0.75rem)',
  lineHeight: 1.43,
  paddingRight: theme.spacing(1.5),
  height: 'fit-content',
  ...linesClampStyles(1),
  '@container (max-height: 20px)': {
    fontSize: '11px',
    lineHeight: '11px',
  },
  // When the title is stacked above the time (tall events), let it wrap to multiple lines.
  '&[data-stacked]': stackedTitleStyles,
  // On touch every event shows the title only (the time is hidden), so the title always wraps.
  [TOUCH_MEDIA]: stackedTitleStyles,
  [HOVER_MEDIA]: {
    '[data-editing] &': {
      color: 'var(--event-on-surface-selected)',
    },
  },
}));

const TimeGridEventTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventTime',
})(({ theme }) => ({
  color: 'var(--event-on-surface-subtle-secondary)',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: 'var(--EventCalendar-fontSize-timeText, 0.75rem)',
  lineHeight: 1.43,
  '&[data-lines-clamp]': {
    ...linesClampStyles(1),
    paddingInlineEnd: theme.spacing(1.5),
  },
  '@container (max-width: 50px & max-height: 50px)': {
    display: 'none',
  },
  '@container (max-height: 20px)': {
    fontSize: '11px',
    lineHeight: '11px',
  },
  // Touch shows the title only.
  [TOUCH_MEDIA]: {
    display: 'none',
  },
  [HOVER_MEDIA]: {
    '[data-editing] &': {
      color: 'var(--event-on-surface-selected)',
    },
  },
}));

const TimeGridEventRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventRecurringIcon',
})(({ theme }) => ({
  position: 'absolute',
  right: 3,
  bottom: 3,
  padding: theme.spacing(0.25),
  fontSize: 'var(--EventCalendar-fontSize-recurringIcon, 1.25rem)',
  color: 'var(--event-on-surface-subtle-secondary)',
  '@container (max-width: 50px)': {
    display: 'none',
  },
  '@container (max-height: 12px)': {
    fontSize: 14,
    lineHeight: 14,
    padding: 0,
    bottom: 0,
  },
  // Touch shows the title only.
  [TOUCH_MEDIA]: {
    display: 'none',
  },
  [HOVER_MEDIA]: {
    '[data-editing] &': {
      color: 'var(--event-on-surface-selected)',
    },
  },
}));

const TimeGridEventResizeHandler = styled(CalendarGrid.TimeEventResizeHandler, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventResizeHandler',
})({
  position: 'absolute',
  zIndex: 3,
  cursor: 'ns-resize',
  // Mouse: a thin, full-width bar revealed when the event is hovered.
  [HOVER_MEDIA]: {
    height: 4,
    left: 0,
    right: 0,
    opacity: 0,
    '*:hover > &': {
      opacity: 1,
    },
    '&[data-start]': {
      top: 0,
    },
    '&[data-end]': {
      bottom: 0,
    },
  },
  // Touch: a circular dot with a large hit area, shown only once the event is armed.
  [TOUCH_MEDIA]: {
    ...getTouchResizeHandleStyles(),
    display: 'none',
    '[data-armed] > &': {
      display: 'block',
    },
  },
});

// The placeholder is a real `CalendarGrid.TimeEvent` (not the inert `TimeEventPlaceholder`) so it
// can host pointer resize handles for sizing on touch. There is no JS device flag, so the
// desktop-vs-touch look is split with CSS.
const TimeGridEventPlaceholderRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventPlaceholder',
})<{ palette?: PaletteName }>(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 2, 0.5, 1.5),
  backgroundColor: 'var(--event-surface-subtle-hover)',
  color: 'var(--event-on-surface-subtle-primary)',
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0, 1),
  },
  // Mouse: a dashed outline.
  [HOVER_MEDIA]: {
    border: `1px dashed var(--event-on-surface-subtle-secondary)`,
  },
  // Touch: a solid accent outline + tighter padding, ready to host sizing handles.
  [TOUCH_MEDIA]: {
    padding: theme.spacing(0.5, 0.7),
    outline: '2px solid var(--event-main)',
    outlineOffset: '-2px',
  },
}));

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, variant, className, ...other } = props;

  const { classes } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const {
    isRecurring,
    isDraggable,
    isStartResizable,
    isEndResizable,
    isLessThan30Minutes,
    isBetween30and60Minutes,
    rootDataAttributes,
    rootPositionProps,
  } = useTimeGridEvent(occurrence);

  const formatTime = useFormatTime();

  // Armed = this occurrence is the one being edited. The touch-only resize dots + selection outline
  // are revealed by the coarse-pointer styles, so `data-armed` is inert on a mouse.
  const isArmed = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);

  // Creation / internal-resize placeholders host sizing handles; move placeholders don't.
  const placeholderType = useStore(store, schedulerOccurrencePlaceholderSelectors.type);
  const placeholderHasResizeHandles =
    placeholderType === 'creation' || placeholderType === 'internal-resize';

  // Events long enough to show the time on its own line stack the title above it; shorter events
  // show the title and start time inline.
  const isStacked = !isLessThan30Minutes && !isBetween30and60Minutes;

  const content = React.useMemo(() => {
    return (
      <React.Fragment>
        {isStacked ? (
          <React.Fragment>
            <TimeGridEventTitle className={classes.timeGridEventTitle} data-stacked>
              {occurrence.title}
            </TimeGridEventTitle>
            <TimeGridEventTime className={classes.timeGridEventTime} data-lines-clamp>
              {formatTime(occurrence.displayTimezone.start.value)} -{' '}
              {formatTime(occurrence.displayTimezone.end.value)}
            </TimeGridEventTime>
          </React.Fragment>
        ) : (
          <TimeGridEventTitle className={classes.timeGridEventTitle}>
            {occurrence.title}{' '}
            <TimeGridEventTime className={classes.timeGridEventTime}>
              {formatTime(occurrence.displayTimezone.start.value)}
            </TimeGridEventTime>
          </TimeGridEventTitle>
        )}

        {isRecurring && (
          <TimeGridEventRecurringIcon
            className={classes.timeGridEventRecurringIcon}
            aria-hidden="true"
          />
        )}
      </React.Fragment>
    );
  }, [
    isStacked,
    occurrence.title,
    occurrence.displayTimezone.start.value,
    occurrence.displayTimezone.end.value,
    formatTime,
    isRecurring,
    classes,
  ]);

  const sharedProps = {
    ...rootPositionProps,
    ref: forwardedRef,
    ...other,
    className: clsx(className, occurrence.className),
  };

  if (variant === 'placeholder') {
    return (
      <TimeGridEventPlaceholderRoot
        isDraggable={false}
        eventId={occurrence.id}
        occurrenceKey={occurrence.key}
        renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
        data-armed={placeholderHasResizeHandles || undefined}
        {...rootDataAttributes}
        {...sharedProps}
        className={clsx(classes.timeGridEventPlaceholder, sharedProps.className)}
      >
        {placeholderHasResizeHandles && (
          <TimeGridEventResizeHandler className={classes.timeGridEventResizeHandler} side="start" />
        )}
        {content}
        {placeholderHasResizeHandles && (
          <TimeGridEventResizeHandler className={classes.timeGridEventResizeHandler} side="end" />
        )}
      </TimeGridEventPlaceholderRoot>
    );
  }

  return (
    <TimeGridEventRoot
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      data-armed={isArmed || undefined}
      {...rootDataAttributes}
      {...sharedProps}
      className={clsx(classes.timeGridEvent, sharedProps.className)}
    >
      {isStartResizable && (
        <TimeGridEventResizeHandler className={classes.timeGridEventResizeHandler} side="start" />
      )}
      {content}
      {isEndResizable && (
        <TimeGridEventResizeHandler className={classes.timeGridEventResizeHandler} side="end" />
      )}
    </TimeGridEventRoot>
  );
});
