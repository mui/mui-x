'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDropTargetKind } from './schedulerDrag';

function isOutsideScheduler(location: Draggable.LocationHistory) {
  return !location.current.targets.some((target) => schedulerDropTargetKind.matches(target));
}

/**
 * Mounts with the drag, so the content is built once per drag. Visibility changes only when the
 * pointer enters or leaves Scheduler targets; Base UI positions the floating preview.
 */
function SchedulerFloatingPreview(props: SchedulerDragPreview.Props) {
  const { children, startsOverScheduler = false } = props;
  const [content] = React.useState(children);
  // The monitor registers once the drag has started, so the caller tells where it starts.
  const [visible, setVisible] = React.useState(!startsOverScheduler);
  // The preview only exists during its own drag, so the monitor needs no `accept`.
  Draggable.useMonitor({
    onMove: (eventDetails) => setVisible(isOutsideScheduler(eventDetails.location)),
    onTargetChange: (eventDetails) => setVisible(isOutsideScheduler(eventDetails.location)),
  });
  // An empty preview would still follow the pointer.
  if (content == null || content === false) {
    return null;
  }
  return (
    <Draggable.Preview style={{ visibility: visible ? undefined : 'hidden' }}>
      {content}
    </Draggable.Preview>
  );
}

/**
 * The preview that follows the pointer outside Scheduler targets. Over a target it hides, because
 * the target draws its own placeholder. Render it inside the `Draggable.Root` of the dragged item.
 */
export function SchedulerDragPreview(props: SchedulerDragPreview.Props) {
  if (props.disabled) {
    return null;
  }
  return (
    <Draggable.Portal>
      <Draggable.Positioner offset="pointer">
        <SchedulerFloatingPreview {...props} />
      </Draggable.Positioner>
    </Draggable.Portal>
  );
}

export namespace SchedulerDragPreview {
  export interface Props {
    /**
     * Whether to show no preview. The drag still runs.
     */
    disabled?: boolean;
    /**
     * Whether the drag starts over a Scheduler target, where the preview starts hidden.
     * @default false
     */
    startsOverScheduler?: boolean;
    /**
     * Renders the content of the preview. Called once when the drag starts.
     * Return `null` to show no preview.
     */
    children: () => React.ReactNode;
  }
}
