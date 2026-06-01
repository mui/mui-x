'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CSSObject, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { schedulerOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { EventDragPreview } from '../../../components/event-drag-preview';
import { useEventCalendarStyledContext } from '../../../../event-calendar/EventCalendarStyledContext';
import { useCompactEventDrawerContext } from '../../compact-event-drawer';
import { PaletteName } from '../../../utils/tokens';
import { TimeGridEventProps } from './TimeGridEvent.types';
import { useTimeGridEvent } from './useTimeGridEvent';
import {
  getTimeGridEventRootStyles,
  linesClampStyles,
  TimeGridEventPlaceholder,
} from './TimeGridEventShared';

const TimeGridEventMobileRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventMobileRoot',
})<{ palette?: PaletteName }>(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 0.7, 0.5, 0.7),
  '&[data-under-fifteen-minutes="true"]': {
    padding: theme.spacing(0, 0.5),
  },
  '&[data-armed]': {
    outline: '2px solid var(--event-main)',
    outlineOffset: '-2px',
  },
}));

const MOBILE_TITLE_LINE_HEIGHT_PX = 12;
const MOBILE_EVENT_VERTICAL_PADDING_PX = 4;
const MOBILE_TITLE_MAX_LINES = 24;

const mobileTitleLineClampSteps: CSSObject = {};
for (let lines = 2; lines <= MOBILE_TITLE_MAX_LINES; lines += 1) {
  const minHeight = MOBILE_EVENT_VERTICAL_PADDING_PX + lines * MOBILE_TITLE_LINE_HEIGHT_PX;
  mobileTitleLineClampSteps[`@container (min-height: ${minHeight}px)`] = {
    WebkitLineClamp: lines,
    maxHeight: `${lines * MOBILE_TITLE_LINE_HEIGHT_PX}px`,
  };
}

const TimeGridEventMobileTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventMobileTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-on-surface-subtle-primary)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 'var(--EventCalendar-fontSize-eventTitle)',
  lineHeight: `${MOBILE_TITLE_LINE_HEIGHT_PX}px`,
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
  ...linesClampStyles(1),
  maxHeight: `${MOBILE_TITLE_LINE_HEIGHT_PX}px`,
  ...mobileTitleLineClampSteps,
}));

// A creation placeholder rendered as a real `CalendarGrid.TimeEvent` (rather than the inert
// `TimeEventPlaceholder`) so it can host pointer resize handles — letting the user size the
// new event before it is saved.
const TimeGridEventMobilePlaceholderRoot = styled(CalendarGrid.TimeEvent, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventMobilePlaceholderRoot',
})(({ theme }) => ({
  ...getTimeGridEventRootStyles(theme),
  padding: theme.spacing(0.5, 0.7),
  backgroundColor: 'var(--event-surface-subtle-hover)',
  border: '1px dashed var(--event-on-surface-subtle-secondary)',
  color: 'var(--event-on-surface-subtle-primary)',
}));

const TimeGridEventMobileResizeHandler = styled(CalendarGrid.TimeEventResizeHandler, {
  name: 'MuiEventCalendar',
  slot: 'TimeGridEventMobileResizeHandler',
})({
  position: 'absolute',
  width: 14,
  height: 14,
  borderRadius: '50%',
  backgroundColor: 'var(--event-main)',
  border: '2px solid var(--event-on-surface-subtle-primary)',
  zIndex: 3,
  cursor: 'ns-resize',
  // Prevent the browser from scrolling/zooming while the resize gesture is in progress.
  touchAction: 'none',
  '&[data-start]': {
    top: -7,
    left: 6,
  },
  '&[data-end]': {
    bottom: -7,
    right: 6,
  },
});

export const TimeGridEventMobile = React.forwardRef(function TimeGridEventMobile(
  props: TimeGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, variant, className, ...other } = props;

  const { classes } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const { isDraggable, isStartResizable, isEndResizable, rootDataAttributes, rootPositionProps } =
    useTimeGridEvent(occurrence);

  // A creation placeholder has no underlying event but should still be resizable, so it is
  // rendered as a real event with forced handles (see below). Selecting the boolean (rather
  // than the placeholder object) keeps every event from re-rendering on each resize move.
  const isCreationPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.isCreating);

  // A single tap on the event opens the compact drawer for it (via the EventDialogTrigger ->
  // drawer bridge). We reuse that drawer selection to "arm" the event — revealing its resize
  // handles and selection outline — without any custom long-press.
  const { isOpen, data } = useCompactEventDrawerContext();
  const isArmed = isOpen && data?.key === occurrence.key;

  const content = (
    <TimeGridEventMobileTitle className={classes.timeGridEventTitle}>
      {occurrence.title}
    </TimeGridEventMobileTitle>
  );

  const sharedProps = {
    ...rootPositionProps,
    ref: forwardedRef,
    ...other,
    className: clsx(className, occurrence.className),
  };

  if (variant === 'placeholder') {
    // A creation placeholder is resizable: render it as a real event with forced pointer
    // handles so the user can size the new event before saving it. Other placeholders (the
    // transient drag/resize previews) stay inert.
    if (isCreationPlaceholder) {
      return (
        <TimeGridEventMobilePlaceholderRoot
          isDraggable={false}
          eventId={occurrence.id}
          occurrenceKey={occurrence.key}
          renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
          {...rootDataAttributes}
          {...sharedProps}
          className={clsx(classes.timeGridEventPlaceholder, sharedProps.className)}
        >
          <TimeGridEventMobileResizeHandler
            className={classes.timeGridEventResizeHandler}
            side="start"
            interaction="pointer"
          />
          {content}
          <TimeGridEventMobileResizeHandler
            className={classes.timeGridEventResizeHandler}
            side="end"
            interaction="pointer"
          />
        </TimeGridEventMobilePlaceholderRoot>
      );
    }

    return (
      <TimeGridEventPlaceholder
        aria-hidden={true}
        {...rootDataAttributes}
        {...sharedProps}
        className={clsx(classes.timeGridEventPlaceholder, sharedProps.className)}
      >
        {content}
      </TimeGridEventPlaceholder>
    );
  }

  return (
    <TimeGridEventMobileRoot
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...rootDataAttributes}
      {...sharedProps}
      data-armed={isArmed || undefined}
      className={clsx(classes.timeGridEvent, sharedProps.className)}
    >
      {isArmed && isStartResizable && (
        <TimeGridEventMobileResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="start"
          interaction="pointer"
        />
      )}
      {content}
      {isArmed && isEndResizable && (
        <TimeGridEventMobileResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="end"
          interaction="pointer"
        />
      )}
    </TimeGridEventMobileRoot>
  );
});
