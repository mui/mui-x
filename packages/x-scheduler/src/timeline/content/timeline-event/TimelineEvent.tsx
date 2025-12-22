import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { useId } from '@base-ui/utils/useId';
import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { getColorClassName } from '../../../internals/utils/color-utils';
import { EventDragPreview } from '../../../internals/components/event-drag-preview';
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
  const isDraggable = useStore(store, schedulerEventSelectors.isDraggable, occurrence.id);
  const isStartResizable = useStore(
    store,
    schedulerEventSelectors.isResizable,
    occurrence.id,
    'start',
  );
  const isEndResizable = useStore(store, schedulerEventSelectors.isResizable, occurrence.id, 'end');
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);

  // Feature hooks
  const id = useId(idProp);

  const sharedProps = {
    id,
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    'aria-labelledby': `${ariaLabelledBy} ${id}`,
    className: clsx(className, 'TimelineEvent', getColorClassName(color)),
    style: {
      '--number-of-lines': 1,
      '--row-index': occurrence.position.firstIndex,
    } as React.CSSProperties,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <Timeline.EventPlaceholder aria-hidden={true} {...sharedProps}>
        <span className="LinesClamp">{occurrence.title}</span>
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
      {isStartResizable && (
        <Timeline.EventResizeHandler side="start" className="TimelineEventResizeHandler" />
      )}
      <span className="LinesClamp">{occurrence.title}</span>
      {isEndResizable && (
        <Timeline.EventResizeHandler side="end" className="TimelineEventResizeHandler" />
      )}
    </Timeline.Event>
  );
});
