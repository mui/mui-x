'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CSSObject, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventDragPreview } from '../../../components/event-drag-preview';
import { useEventCalendarStyledContext } from '../../../../event-calendar/EventCalendarStyledContext';
import { useMobileEventLift } from '../../../hooks/useMobileEventLift';
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
  '&[data-lifted]': {
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
  const { isDraggable, isStartResizable, isEndResizable, rootDataAttributes, rootPositionProps } =
    useTimeGridEvent(occurrence);

  const {
    isLifted,
    canDrag,
    ref: liftRef,
  } = useMobileEventLift({
    enabled: !!isDraggable && variant !== 'placeholder',
    occurrenceKey: occurrence.key,
  });
  const mergedRef = useMergedRefs(forwardedRef, liftRef);

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
      canDrag={canDrag}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...rootDataAttributes}
      {...sharedProps}
      ref={mergedRef}
      data-lifted={isLifted || undefined}
      className={clsx(classes.timeGridEvent, sharedProps.className)}
    >
      {isLifted && isStartResizable && (
        <TimeGridEventMobileResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="start"
          interaction="pointer"
        />
      )}
      {content}
      {isLifted && isEndResizable && (
        <TimeGridEventMobileResizeHandler
          className={classes.timeGridEventResizeHandler}
          side="end"
          interaction="pointer"
        />
      )}
    </TimeGridEventMobileRoot>
  );
});
