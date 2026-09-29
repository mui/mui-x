'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDropTargetKind } from './schedulerDrag';

const previewStyle: React.CSSProperties = { pointerEvents: 'none' };

function isOutsideScheduler(location: Draggable.LocationHistory) {
  return !location.current.targets.some((target) => schedulerDropTargetKind.matches(target));
}

/** Visibility changes only when the target changes; Base UI positions the floating preview. */
function SchedulerFloatingPreview(props: {
  location: Draggable.LocationHistory;
  children: React.ReactNode;
}) {
  const { location, children } = props;
  const [visible, setVisible] = React.useState(() => isOutsideScheduler(location));
  // The preview only exists during its own drag, so the monitor needs no `accept`.
  Draggable.useMonitor({
    onMoveStart: (_, { location: nextLocation }) => setVisible(isOutsideScheduler(nextLocation)),
    onTargetChange: (_, { location: nextLocation }) => setVisible(isOutsideScheduler(nextLocation)),
  });
  return <div style={{ visibility: visible ? undefined : 'hidden' }}>{children}</div>;
}

/**
 * The preview that follows the pointer outside Scheduler targets. Over a target it hides, because
 * the target draws its own placeholder. Render it inside the `Draggable.Root` of the dragged item.
 */
export function SchedulerDragPreview(props: SchedulerDragPreview.Props) {
  const { disabled, children } = props;

  return (
    <Draggable.Preview offset="pointer" style={previewStyle} disabled={disabled}>
      {({ location }) => (
        <SchedulerFloatingPreview location={location}>{children()}</SchedulerFloatingPreview>
      )}
    </Draggable.Preview>
  );
}

export namespace SchedulerDragPreview {
  export interface Props {
    /**
     * Whether to show no preview. The drag still runs.
     */
    disabled?: boolean;
    /**
     * Renders the content of the preview. Called once when the drag starts.
     */
    children: () => React.ReactNode;
  }
}
