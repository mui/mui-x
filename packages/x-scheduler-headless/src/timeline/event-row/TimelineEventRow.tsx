'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { TimelineEventRowContext } from './TimelineEventRowContext';
import { useEventRowDropTarget } from './useEventRowDropTarget';

export const TimelineEventRow = React.forwardRef(function TimelineEventRow(
  componentProps: TimelineEventRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    resourceId,
    addPropertiesToDroppedEvent,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { getCursorPositionInElementMs, ref: dropTargetRef } = useEventRowDropTarget({
    start,
    end,
    resourceId,
    addPropertiesToDroppedEvent,
  });

  // TODO: Add aria-rowindex using Composite.
  const props = React.useMemo(() => ({ role: 'row' }), []);

  const contextValue: TimelineEventRowContext = React.useMemo(
    () => ({ start, end, getCursorPositionInElementMs }),
    [start, end, getCursorPositionInElementMs],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef],
    props: [props, elementProps],
  });

  return (
    <TimelineEventRowContext.Provider value={contextValue}>
      {element}
    </TimelineEventRowContext.Provider>
  );
});

export namespace TimelineEventRow {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useEventRowDropTarget.Parameters {}
}
