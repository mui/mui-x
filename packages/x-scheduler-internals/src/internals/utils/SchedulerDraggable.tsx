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
 * It forwards its ref because the `Draggable.Target` of the timeline event wraps it in its `render`
 * prop and clones it with a ref. React 17 and 18 only hand a ref to a `forwardRef` component.
 */
export const SchedulerDraggable = React.forwardRef(function SchedulerDraggable<
  TData extends SchedulerEventDragData,
>(props: SchedulerDraggable.Props<TData>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const {
    getDragData,
    render,
    // Resize handles draw their own feedback, so they suppress Base UI's default clone of the source.
    preview = <Draggable.Preview disabled />,
    ...other
  } = props;

  const store = useSchedulerStoreContext();
  const payload = React.useMemo<SchedulerEventDragPayload>(
    () => ({ scope: store.dragScope }),
    [store],
  );

  return (
    <Draggable.Root
      {...other}
      ref={forwardedRef}
      payload={payload}
      render={withDragPreview(render, preview)}
      onBeforeMoveStart={(eventDetails) => {
        eventDetails.source.updateDragData(getDragData(eventDetails.input));
      }}
      onMoveEnd={(eventDetails) => {
        // The target's `onDraggableDrop` runs after this handler and may still commit the last placeholder.
        if (!eventDetails.target || !schedulerDropTargetKind.matches(eventDetails.target)) {
          store.setOccurrencePlaceholder(null);
        }
      }}
    />
  );
}) as <TData extends SchedulerEventDragData>(
  props: SchedulerDraggable.Props<TData> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element;

export namespace SchedulerDraggable {
  export interface Props<TData extends SchedulerEventDragData> extends Omit<
    Draggable.Root.Props<SchedulerEventDragPayload, TData>,
    'render' | 'children' | 'payload' | 'onBeforeMoveStart' | 'onMoveEnd'
  > {
    /**
     * Gets the drag data when the drag is about to start.
     * @param {{ clientX: number, clientY: number }} input The pointer position that starts the drag.
     * @returns {TData} The drag data.
     */
    getDragData: (input: { clientX: number; clientY: number }) => TData;
    /**
     * The element to drag, already rendered with its own props. The root's props merge into it.
     */
    render: React.ReactElement;
    /**
     * The `Draggable.Preview` of the drag.
     * @default <Draggable.Preview disabled />
     */
    preview?: React.ReactNode;
  }
}
