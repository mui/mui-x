import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useId } from '@base-ui-components/utils/useId';
import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { timelineEventSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { getColorClassName } from '../../../../internals/utils/color-utils';
import { EventDragPreview } from '../../../../internals/components/event-drag-preview';
import { TimelineEventProps } from './TimelineEvent.types';
import './TimelineEvent.css';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  props: TimelineEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, ariaLabelledBy, className, variant, id: idProp, style, ...other } = props;

  // Context hooks
  const store = useTimelineStoreContext();

  // Selector hooks
  const isDraggable = useStore(store, timelineEventSelectors.isDraggable);
  const isResizable = useStore(
    store,
    timelineEventSelectors.isResizable,
    occurrence.id,
    'timeline',
  );
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);

  // Feature hooks
  const id = useId(idProp);

  const sharedProps = {
    id,
    start: occurrence.start,
    end: occurrence.end,
    ref: forwardedRef,
    'aria-labelledby': `${ariaLabelledBy} ${id}`,
    className: clsx(className, 'TimelineEvent', 'LinesClamp', getColorClassName(color)),
    style: {
      '--number-of-lines': 1,
      '--row-index': occurrence.position.firstIndex,
    } as React.CSSProperties,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <Timeline.EventPlaceholder aria-hidden={true} {...sharedProps}>
        {occurrence.title}
      </Timeline.EventPlaceholder>
    );
  }

  return (
    <Timeline.Event
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...sharedProps}
    >
      {isResizable && (
        <Timeline.EventResizeHandler side="start" className="TimelineEventResizeHandler" />
      )}
      {occurrence.title}
      {isResizable && (
        <Timeline.EventResizeHandler side="end" className="TimelineEventResizeHandler" />
      )}
    </Timeline.Event>
  );
});
