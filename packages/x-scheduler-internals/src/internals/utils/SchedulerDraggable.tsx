'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import type { SchedulerEventDragPayload, SchedulerEventDragData } from './schedulerDrag';

/** Captures the occurrence and grab position once for an event move or resize. */
export const SchedulerDraggable = React.forwardRef(function SchedulerDraggable<
  TData extends SchedulerEventDragData,
>(props: SchedulerDraggable.Props<TData>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const {
    getDragData,
    render,
    preview = <Draggable.Preview disabled />,
    onBeforeMoveStart,
    ...other
  } = props;

  return (
    <Draggable.Root
      {...other}
      ref={forwardedRef}
      render={
        React.isValidElement<{ children?: React.ReactNode }>(render)
          ? React.cloneElement(render, {
              children: (
                <React.Fragment>
                  {render.props.children}
                  {preview}
                </React.Fragment>
              ),
            })
          : render
      }
      onBeforeMoveStart={(context, details) => {
        onBeforeMoveStart?.(context, details);
        if (!details.isCanceled) {
          context.source.updateDragData(getDragData(context.input));
        }
      }}
    />
  );
}) as <TData extends SchedulerEventDragData>(
  props: SchedulerDraggable.Props<TData> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element;

export namespace SchedulerDraggable {
  export interface Props<TData extends SchedulerEventDragData> extends Omit<
    Draggable.Root.Props<SchedulerEventDragPayload<TData>, TData>,
    'render' | 'children'
  > {
    getDragData: (input: { clientX: number; clientY: number }) => TData;
    render: React.ReactElement;
    preview?: React.ReactNode;
  }
}
