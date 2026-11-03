'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { useId } from '@base-ui/utils/useId';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useValueAsRef } from '@base-ui/utils/useValueAsRef';
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
  const manager = Draggable.useManager();
  const id = useId();
  // On React 17 the id is only set after mount, so the monitor reads it through a ref.
  const idRef = useValueAsRef(id);
  const previewRef = React.useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    let element = previewRef.current;
    // The monitor registers once the drag has started, so the caller tells where it starts.
    let visible = !startsOverScheduler;
    let mounted = true;
    let ended = false;
    function update(location: Draggable.LocationHistory) {
      const nextVisible = isOutsideScheduler(location);
      if (nextVisible === visible) {
        return;
      }
      visible = nextVisible;
      // When virtualization unmounts the source, Base UI leaves a copy of the preview in place.
      if (element && !element.isConnected && idRef.current) {
        element = element.ownerDocument.querySelector<HTMLDivElement>(
          `[data-scheduler-drag-preview="${CSS.escape(idRef.current)}"]`,
        );
      }
      element?.style.setProperty('visibility', visible ? '' : 'hidden');
    }
    // The preview only exists during its own drag, so the monitor needs no `accept`.
    const unregister = manager.registerMonitor(() => ({
      onMove: (eventDetails) => update(eventDetails.location),
      onTargetChange: (eventDetails) => update(eventDetails.location),
      onMoveEnd: () => {
        ended = true;
        if (!mounted) {
          unregister();
        }
      },
    }));
    return () => {
      mounted = false;
      // The copy left in place still needs its visibility until the drag ends.
      if (ended) {
        unregister();
      }
    };
  }, [manager, idRef, startsOverScheduler]);

  // An empty preview would still follow the pointer.
  if (content == null || content === false) {
    return null;
  }
  return (
    <Draggable.Preview
      ref={previewRef}
      data-scheduler-drag-preview={id}
      // Written once: the monitor updates the element directly, as it outlives this component.
      style={startsOverScheduler ? { visibility: 'hidden' } : undefined}
    >
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
