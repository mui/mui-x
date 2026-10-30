import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { useStore } from '@base-ui/utils/store';
import { useId } from '@base-ui/utils/useId';
import { isReactVersionAtLeast } from '@base-ui/utils/reactVersion';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import {
  schedulerEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { getOccurrenceDataTimezone } from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import {
  EventDragPreview,
  getArrowEdgeStyles,
  getPaletteVariants,
  useEventAccessibleName,
  useSchedulerSlots,
} from '@mui/x-scheduler/internals';
import type {
  EventTimelinePremiumSlots,
  EventTimelinePremiumSlotProps,
} from '../../../models/slots';
import type { EventTimelinePremiumEventProps } from './EventTimelinePremiumEvent.types';
import { useEventTimelinePremiumStyledContext } from '../../EventTimelinePremiumStyledContext';
import { useEventTimelinePremiumFeatures } from '../../features/EventTimelinePremiumFeaturesContext';
import { eventTimelinePremiumClasses } from '../../eventTimelinePremiumClasses';

// React 18 drops `inert={true}` as an unknown boolean attribute and React 19 drops `inert=""`.
const INERT_PROPS = (isReactVersionAtLeast(19) ? { inert: true } : { inert: '' }) as {
  inert?: boolean;
};

const EventTimelinePremiumEventRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'Event',
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-surface-subtle)',
  color: 'var(--event-on-surface-subtle-primary)',
  padding: theme.spacing(0.5, 1),
  position: 'relative',
  // Keeps the resize handlers' z-index inside the event.
  isolation: 'isolate',
  width: 'var(--width)',
  height: `calc(${theme.typography.body2.lineHeight}em + ${theme.spacing(1)})`,
  marginInlineStart: 'var(--x-position)',
  gridRow: 'var(--row-index, 1)',
  gridColumn: 1,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  cursor: 'pointer',
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
  },
  '&:hover': {
    backgroundColor: 'var(--event-surface-subtle-hover)',
  },
  '&[data-editing]': {
    backgroundColor: 'var(--event-surface-selected)',
    color: 'var(--event-on-surface-selected)',
    '&:hover': {
      backgroundColor: 'var(--event-surface-selected-hover)',
    },
    '&::before': {
      background: 'var(--event-surface-selected)',
    },
  },
  [`&:hover .${eventTimelinePremiumClasses.eventResizeHandler}`]: {
    opacity: 1,
  },
  // The event being dragged or resized paints above the dependency arrows.
  [`&.${eventTimelinePremiumClasses.eventPlaceholder}`]: {
    zIndex: 2,
  },
  '&[data-dependency-drop-target]': {
    outline: '2px solid var(--event-surface-accent)',
    outlineOffset: 1,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    insetInlineStart: 0,
    width: 3,
    borderStartStartRadius: 4,
    borderEndStartRadius: 4,
    background: 'var(--event-surface-accent)',
    pointerEvents: 'none',
  },
  ...getArrowEdgeStyles(theme, 8),
  '&[data-starting-before-edge]::before': {
    display: 'none',
  },
  variants: getPaletteVariants(theme),
}));

const EventTimelinePremiumEventLinesClamp = styled('span', {
  name: 'MuiEventTimeline',
  slot: 'EventLinesClamp',
})({
  display: '-webkit-box',
  WebkitLineClamp: 'var(--number-of-lines)',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

const EventTimelinePremiumEventRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventTimeline',
  slot: 'EventRecurringIcon',
})({
  flexShrink: 0,
  fontSize: '1rem',
});

const EventTimelinePremiumEventResizeHandler = styled(TimelineGrid.EventResizeHandler, {
  name: 'MuiEventTimeline',
  slot: 'EventResizeHandler',
})({
  position: 'absolute',
  width: 4,
  top: 0,
  bottom: 0,
  zIndex: 3,
  cursor: 'ew-resize',
  opacity: 0,
  '&[data-start]': {
    insetInlineStart: 0,
  },
  '&[data-end]': {
    insetInlineEnd: 0,
  },
});

const useNoDependencyDescription = (_occurrenceId: SchedulerEventId): string | null => null;

export const EventTimelinePremiumEvent = React.forwardRef(function EventTimelinePremiumEvent(
  props: EventTimelinePremiumEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    className,
    variant,
    id: idProp,
    style,
    resourceId,
    elementPosition,
    ...other
  } = props;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const { classes, localeText, getEventAriaLabel } = useEventTimelinePremiumStyledContext();
  const { dependencies } = useEventTimelinePremiumFeatures();
  // The features are frozen on mount, so the hook is the same on every render.
  // eslint-disable-next-line react-compiler/react-compiler
  const useDescription = dependencies?.useDescription ?? useNoDependencyDescription;
  const { slots, slotProps } = useSchedulerSlots<
    EventTimelinePremiumSlots,
    EventTimelinePremiumSlotProps
  >();
  // Selector hooks
  const isDraggable = useStore(store, schedulerEventSelectors.isDraggable, occurrence.id);
  const isStartResizable = useStore(
    store,
    schedulerEventSelectors.isResizable,
    occurrence.id,
    'start',
  );
  const isEndResizable = useStore(store, schedulerEventSelectors.isResizable, occurrence.id, 'end');
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id, resourceId);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);
  const rowResource = useStore(store, schedulerResourceSelectors.processedResource, resourceId);

  // Feature hooks
  const id = useId(idProp);
  // eslint-disable-next-line react-compiler/react-compiler
  const dependencyDescription = useDescription(occurrence.id);
  const defaultAccessibleName = useEventAccessibleName({
    occurrence,
    isRecurring,
    resourceName: rowResource?.title ?? null,
    localeText,
  });
  const accessibleName = getEventAriaLabel
    ? getEventAriaLabel({
        occurrence,
        resource: rowResource!,
        defaultAriaLabel: defaultAccessibleName,
      })
    : defaultAccessibleName;

  const EventContent = slots.timelineEventContent;
  const content = EventContent ? (
    <EventContent
      occurrence={occurrence}
      resource={rowResource!}
      variant={variant}
      {...slotProps.timelineEventContent}
    />
  ) : (
    occurrence.title
  );

  const sharedProps = {
    id,
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    className: clsx(className, occurrence.className),
    style: {
      '--number-of-lines': 1,
      '--row-index': occurrence.position.firstIndex,
    } as React.CSSProperties,
    'data-palette': color,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <TimelineGrid.EventPlaceholder
        render={<EventTimelinePremiumEventRoot />}
        aria-hidden={true}
        // The slot content is a preview here, so it must not take the focus.
        {...INERT_PROPS}
        {...sharedProps}
        className={clsx(sharedProps.className, classes.eventPlaceholder)}
      >
        <EventTimelinePremiumEventLinesClamp className={classes.eventLinesClamp}>
          {content}
        </EventTimelinePremiumEventLinesClamp>
        {isRecurring && (
          <EventTimelinePremiumEventRecurringIcon
            className={classes.eventRecurringIcon}
            aria-hidden="true"
          />
        )}
      </TimelineGrid.EventPlaceholder>
    );
  }

  return (
    <TimelineGrid.Event
      render={<EventTimelinePremiumEventRoot />}
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      dataTimezone={getOccurrenceDataTimezone(occurrence)}
      elementPosition={elementPosition}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      aria-label={accessibleName}
      {...sharedProps}
      aria-describedby={dependencyDescription !== null ? `${id}-dependencies` : undefined}
      className={clsx(sharedProps.className, classes.event)}
    >
      {isStartResizable && (
        <EventTimelinePremiumEventResizeHandler
          side="start"
          className={classes.eventResizeHandler}
        />
      )}
      <EventTimelinePremiumEventLinesClamp className={classes.eventLinesClamp}>
        {content}
      </EventTimelinePremiumEventLinesClamp>
      {dependencyDescription !== null && (
        // Visually hidden, and `aria-hidden` so it is announced through the `aria-describedby`
        // reference above rather than as a child of the event.
        <span id={`${id}-dependencies`} style={visuallyHidden} aria-hidden>
          {dependencyDescription}
        </span>
      )}
      {isRecurring && (
        <EventTimelinePremiumEventRecurringIcon
          className={classes.eventRecurringIcon}
          aria-hidden="true"
        />
      )}
      {isEndResizable && (
        <EventTimelinePremiumEventResizeHandler side="end" className={classes.eventResizeHandler} />
      )}
    </TimelineGrid.Event>
  );
});
