'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerDropTargetKind } from './schedulerDrag';
import type { SchedulerEventDragPayload, SchedulerEventDragData } from './schedulerDrag';
import { withDragPreview } from './withDragPreview';

/**
 * Captures the occurrence and grab position once for an event move or resize,
 * and clears the placeholder when the drag does not land on a Scheduler target.
 */
export function SchedulerDraggable<TData extends SchedulerEventDragData>(
  props: SchedulerDraggable.Props<TData>,
) {
  const {
    getDragData,
    render,
    // Resize handles draw their own feedback, so they suppress Base UI's default clone of the source.
    preview = <Draggable.Preview disabled />,
    onBeforeMoveStart,
    onMoveEnd,
    ...other
  } = props;

  const store = useSchedulerStoreContext();

  return (
    <Draggable.Root
      {...other}
      render={withDragPreview(render, preview)}
      onBeforeMoveStart={(value, eventDetails) => {
        onBeforeMoveStart?.(value, eventDetails);
        if (!eventDetails.isCanceled) {
          value.source.updateDragData(getDragData(eventDetails.input));
        }
      }}
      onMoveEnd={(value, eventDetails) => {
        // The target's `onDraggableDrop` runs after this handler and may still commit the last placeholder.
        if (!value.target || !schedulerDropTargetKind.matches(value.target)) {
          store.setOccurrencePlaceholder(null);
        }
        onMoveEnd?.(value, eventDetails);
      }}
    />
  );
}

export namespace SchedulerDraggable {
  export interface Props<TData extends SchedulerEventDragData> extends Omit<
    Draggable.Root.Props<SchedulerEventDragPayload, TData>,
    'render' | 'children'
  > {
    getDragData: (input: { clientX: number; clientY: number }) => TData;
    render: React.ReactElement;
    preview?: React.ReactNode;
  }
}
