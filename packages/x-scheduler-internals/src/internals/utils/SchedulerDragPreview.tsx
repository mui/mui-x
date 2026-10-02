'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDropTargetKind } from './schedulerDrag';

// The content each drag's preview was built with. `Draggable.updatePreview()` runs the preview
// function again, and the content must not be rendered again with it.
const contentBySource = new WeakMap<Draggable.Root.Record, React.ReactNode>();

function isOutsideScheduler(location: Draggable.LocationHistory) {
  return !location.current.targets.some((target) => schedulerDropTargetKind.matches(target));
}

/**
 * Visibility changes only when the target changes; Base UI positions the floating preview.
 * This renders off-document. Base UI copies it into the element that follows the pointer when the
 * drag starts, and again on `Draggable.updatePreview()`.
 */
function SchedulerFloatingPreview(props: {
  location: Draggable.LocationHistory;
  children: React.ReactNode;
}) {
  const { location, children } = props;
  const [visible, setVisible] = React.useState(() => isOutsideScheduler(location));
  // The preview only exists during its own drag, so the monitor needs no `accept`. The drag has
  // started by the time it mounts, and the initial state reads where it started.
  Draggable.useMonitor({
    onTargetChange: (eventDetails) => setVisible(isOutsideScheduler(eventDetails.location)),
  });
  // The copy on screen shows a new visibility only once asked to.
  const shownVisible = React.useRef(visible);
  React.useEffect(() => {
    if (shownVisible.current !== visible) {
      shownVisible.current = visible;
      Draggable.updatePreview();
    }
  }, [visible]);
  return <div style={{ visibility: visible ? undefined : 'hidden' }}>{children}</div>;
}

/**
 * The preview that follows the pointer outside Scheduler targets. Over a target it hides, because
 * the target draws its own placeholder. Render it inside the `Draggable.Root` of the dragged item.
 */
export function SchedulerDragPreview(props: SchedulerDragPreview.Props) {
  const { disabled, children } = props;

  return (
    <Draggable.Preview offset="pointer" disabled={disabled}>
      {({ source, location }) => {
        if (!contentBySource.has(source)) {
          contentBySource.set(source, children());
        }
        const content = contentBySource.get(source);
        // An empty preview would still be inserted and follow the pointer.
        if (content == null || content === false) {
          return null;
        }
        return <SchedulerFloatingPreview location={location}>{content}</SchedulerFloatingPreview>;
      }}
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
     * Return `null` to show no preview.
     */
    children: () => React.ReactNode;
  }
}
