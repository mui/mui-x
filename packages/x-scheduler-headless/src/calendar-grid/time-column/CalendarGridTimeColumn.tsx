'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { useTimeDropTarget } from './useTimeDropTarget';

export const CalendarGridTimeColumn = React.forwardRef(function CalendarGridTimeColumn(
  componentProps: CalendarGridTimeColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { getCursorPositionInElementMs, ref: dropTargetRef } = useTimeDropTarget({ start, end });
  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const contextValue: CalendarGridTimeColumnContext = React.useMemo(
    () => ({
      start,
      end,
      getCursorPositionInElementMs,
    }),
    [start, end, getCursorPositionInElementMs],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef],
    props: [props, elementProps],
  });

  return (
    <CalendarGridTimeColumnContext.Provider value={contextValue}>
      {element}
    </CalendarGridTimeColumnContext.Provider>
  );
});

export namespace CalendarGridTimeColumn {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useTimeDropTarget.Parameters {}
}
