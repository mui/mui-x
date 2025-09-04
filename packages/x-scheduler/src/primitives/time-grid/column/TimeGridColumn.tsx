'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { useTimeGridColumnDropTarget } from './useTimeGridColumnDropTarget';

export const TimeGridColumn = React.forwardRef(function TimeGridColumn(
  componentProps: TimeGridColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    columnId,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const contextRef = React.useRef<HTMLDivElement>(null);
  const { getCursorPositionInElementMs, ref: dropTargetRef } = useTimeGridColumnDropTarget({
    start,
    end,
    columnId,
  });
  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({
      start,
      end,
      ref: contextRef,
      getCursorPositionInElementMs,
    }),
    [start, end, contextRef, getCursorPositionInElementMs],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, contextRef, dropTargetRef],
    props: [props, elementProps],
  });

  return (
    <TimeGridColumnContext.Provider value={contextValue}>{element}</TimeGridColumnContext.Provider>
  );
});

export namespace TimeGridColumn {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useTimeGridColumnDropTarget.Parameters {}
}
