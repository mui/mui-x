'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { schedulerDragKind } from './schedulerDrag';

/** Shares the Scheduler payload and preview conventions across drag sources. */
export const SchedulerDraggable = React.forwardRef(function SchedulerDraggable(
  props: SchedulerDraggable.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { getDragData, render, onBeforeMoveStart, ...other } = props;
  const payload = React.useRef<Record<string, unknown>>({});

  return (
    <Draggable.Root
      {...other}
      kind={schedulerDragKind}
      payload={payload.current}
      ref={forwardedRef}
      render={
        React.isValidElement<{ children?: React.ReactNode }>(render)
          ? React.cloneElement(render, {
              children: (
                <React.Fragment>
                  {render.props.children}
                  <Draggable.Preview disabled />
                </React.Fragment>
              ),
            })
          : render
      }
      onBeforeMoveStart={(context, details) => {
        onBeforeMoveStart?.(context, details);
        if (!details.isCanceled) {
          Object.keys(payload.current).forEach((key) => delete payload.current[key]);
          Object.assign(payload.current, getDragData(context.input));
        }
      }}
    />
  );
});

export namespace SchedulerDraggable {
  export interface Props extends Omit<
    Draggable.Root.Props<Record<string, unknown>>,
    'kind' | 'payload' | 'render' | 'children'
  > {
    getDragData: (input: { clientX: number; clientY: number }) => Record<string, unknown>;
    render: React.ReactElement;
  }
}
