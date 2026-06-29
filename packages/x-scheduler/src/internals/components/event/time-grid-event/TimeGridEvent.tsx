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

// Visuals split via these media queries; resize follows the actual pointer (in the resize primitive).
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

// Visible dot diameter of the touch resize handle.
const TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX = 14;
// Hit-area size per WCAG 2.5.8 (24px min) and Apple HIG (44px).
const TOUCH_RESIZE_HANDLE_HIT_SIZE_PX = 44;
// How far the transparent hit area extends past the dot on each expanded side.
const TOUCH_RESIZE_HANDLE_HIT_INSET_PX = -(
  (TOUCH_RESIZE_HANDLE_HIT_SIZE_PX - TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX) /
  2
);

/**
 * Circular touch resize handle. A transparent `::before` expands the dot's hit area, biased outward
 * (start up, end down) so the two handles don't overlap until the event is shorter than the dot.
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
  // Block scroll/zoom during the resize gesture.
  touchAction: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    insetInline: TOUCH_RESIZE_HANDLE_HIT_INSET_PX,
  },
  '&[data-start]': {
    top: -TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX / 2,
    left: 6,
    // Grow the hit area up, away from the end handle.
    '&::before': { top: TOUCH_RESIZE_HANDLE_HIT_INSET_PX, bottom: 0 },
  },
  '&[data-end]': {
    bottom: -TOUCH_RESIZE_HANDLE_VISUAL_SIZE_PX / 2,
    right: 6,
    // Grow the hit area down, away from the start handle.
    '&::before': { bottom: TOUCH_RESIZE_HANDLE_HIT_INSET_PX, top: 0 },
  },
});

// The root is a `container-type: size` container; size queries use the content box, so the
// thresholds below already exclude the root padding.

// Fixed line box (px), driving both `line-height` and the clamp thresholds.
const LINE_BOX_PX = 14;

// Below this content width there's no room for the time, so only the title shows (wrapped).
const NARROW_MAX_WIDTH_PX = 50;

// Below this content height a single line barely fits, so the font is capped to avoid clipping.
const SHORT_MAX_HEIGHT_PX = LINE_BOX_PX;

const TITLE_MAX_LINES = 12;

const titleFontSize = 'var(--EventCalendar-fontSize-eventTitle, 0.75rem)';
const timeFontSize = 'var(--EventCalendar-fontSize-timeText, 0.75rem)';

/**
 * Container-query steps growing the title's line clamp with the available height. `reserveTimeLine`
 * keeps one line free for the time row; otherwise the title uses the full height. `extraConditions`
 * scopes the steps further (e.g. a max-width).
 */
function titleLineClampSteps(reserveTimeLine: boolean, extraConditions: string = ''): CSSObject {
  const steps: CSSObject = {};
  for (let lines = 2; lines <= TITLE_MAX_LINES; lines += 1) {
    const linesNeeded = reserveTimeLine ? lines + 1 : lines;
    steps[`@container (min-height: ${linesNeeded * LINE_BOX_PX}px)${extraConditions}`] = {
      WebkitLineClamp: lines,
    };
  }
  return steps;
}

// Caps the font on very short events so a single line fits; `min()` keeps the smaller responsive tier.
function shortEventFontStyles(fontSize: string): CSSObject {
  return {
    [`@container (max-height: ${SHORT_MAX_HEIGHT_PX}px)`]: {
      fontSize: `min(${fontSize}, 11px)`,
      lineHeight: 1,
    },
  };
}

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
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  minHeight: 11.5,
  containerType: 'size',
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
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
  // Shrink vertical padding on shorter events so the text isn't squeezed out.
  '&[data-under-hour="true"]': {
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
  },
  '&[data-under-fifteen-minutes="true"]': {
    paddingTop: 0,
    paddingBottom: 0,
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
  // Hover-capable devices: hover affordance and the filled "selected" look while editing.
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
    '&[data-under-hour="true"]': {
      paddingTop: theme.spacing(0.25),
      paddingBottom: theme.spacing(0.25),
    },
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
  fontSize: titleFontSize,
  // Fixed line box keeps the line count (and clamp thresholds) exact at every font tier.
  lineHeight: `${LINE_BOX_PX}px`,
  ...linesClampStyles(1),
  ...shortEventFontStyles(titleFontSize),
  // Single-line titles share the line with the recurring icon, so reserve room while it's shown.
  '[data-recurrent] &:not([data-stacked])': {
    paddingRight: theme.spacing(1.5),
    [`@container (max-width: ${NARROW_MAX_WIDTH_PX}px)`]: { paddingRight: 0 },
    [TOUCH_MEDIA]: { paddingRight: 0 },
  },
  // Inline (short events): wrap the title into the available height; the start time rides at the end.
  '&:not([data-stacked])': titleLineClampSteps(false),
  // Stacked (tall events): wrap the title, reserving one line for the time — unless too narrow to
  // show it, where the title uses the full height (narrow steps win, declared last).
  '&[data-stacked]': {
    ...titleLineClampSteps(true),
    ...titleLineClampSteps(false, ` and (max-width: ${NARROW_MAX_WIDTH_PX}px)`),
  },
  // Touch shows the title only, so it always wraps into the full height (overriding the steps above).
  [TOUCH_MEDIA]: {
    ...titleLineClampSteps(false),
    '&[data-stacked]': titleLineClampSteps(false),
  },
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
  fontSize: timeFontSize,
  lineHeight: `${LINE_BOX_PX}px`,
  // Inline variant rides at the end of the title line; block variant gets its own clamped line,
  // hidden when too narrow.
  '&[data-variant="block"]': {
    ...linesClampStyles(1),
    [`@container (max-width: ${NARROW_MAX_WIDTH_PX}px)`]: {
      display: 'none',
    },
  },
  // Reserve room for the recurring icon on the time line only while the icon is shown.
  '[data-recurrent] &[data-variant="block"]': {
    paddingInlineEnd: theme.spacing(1.5),
  },
  ...shortEventFontStyles(timeFontSize),
  // Touch shows the title only.
  [TOUCH_MEDIA]: {
    '&[data-variant="inline"]': { display: 'none' },
    '&[data-variant="block"]': { display: 'none' },
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
  [`@container (max-width: ${NARROW_MAX_WIDTH_PX}px)`]: {
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

// A real `CalendarGrid.TimeEvent` (not the inert `TimeEventPlaceholder`) so it can host pointer
// resize handles for sizing on touch. No JS device flag, so the desktop-vs-touch look is split in CSS.
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

  // Armed = this occurrence is being edited. Touch styles reveal the resize dots + outline; inert on a mouse.
  const isArmed = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);
  const editingMode = useStore(store, schedulerOtherSelectors.editingMode);

  // Creation / internal-resize placeholders host sizing handles; move placeholders don't. Suppressed
  // in `edit` mode where the form owns the times — matching the regular event (see `useTimeGridEvent`).
  const placeholderType = useStore(store, schedulerOccurrencePlaceholderSelectors.type);
  const placeholderHasResizeHandles =
    (placeholderType === 'creation' || placeholderType === 'internal-resize') &&
    editingMode !== 'edit';

  // Tall events stack the title over the full time range; shorter ones show the start time inline.
  // Width-driven degradation (dropping the time, wrapping the title) is handled in CSS.
  const isStacked = !isLessThan30Minutes && !isBetween30and60Minutes;

  const content = React.useMemo(() => {
    return (
      <React.Fragment>
        {isStacked ? (
          <React.Fragment>
            <TimeGridEventTitle className={classes.timeGridEventTitle} data-stacked>
              {occurrence.title}
            </TimeGridEventTitle>
            <TimeGridEventTime className={classes.timeGridEventTime} data-variant="block">
              {formatTime(occurrence.displayTimezone.start.value)} -{' '}
              {formatTime(occurrence.displayTimezone.end.value)}
            </TimeGridEventTime>
          </React.Fragment>
        ) : (
          <TimeGridEventTitle className={classes.timeGridEventTitle}>
            {occurrence.title}{' '}
            <TimeGridEventTime className={classes.timeGridEventTime} data-variant="inline">
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
      data-editing={isArmed || undefined}
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
