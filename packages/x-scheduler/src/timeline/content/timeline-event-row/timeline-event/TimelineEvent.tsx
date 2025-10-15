import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useId } from '@base-ui-components/utils/useId';
import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { selectors } from '@mui/x-scheduler-headless/use-timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { getColorClassName } from '../../../../internals/utils/color-utils';
import { EventDragPreview } from '../../../../internals/components/event-drag-preview';
import { TimelineEventProps } from './TimelineEvent.types';
import './TimelineEvent.css';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  props: TimelineEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    ariaLabelledBy,
    className,
    onEventClick,
    id: idProp,
    style,
    ...other
  } = props;

  const store = useTimelineStoreContext();

  const id = useId(idProp);
  const isDraggable = useStore(store, selectors.isEventDraggable);
  // const isResizable = useStore(store, selectors.isEventResizable, occurrence.id, 'timeline');
  const color = useStore(store, selectors.eventColor, occurrence.id);

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

  return (
    <Timeline.Event
      isDraggable={isDraggable}
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      {...sharedProps}
    >
      {occurrence.title}
    </Timeline.Event>
  );
});
