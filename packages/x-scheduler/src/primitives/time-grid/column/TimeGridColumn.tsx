'use client';
import * as React from 'react';
import { useTimeGridColumn } from './useTimeGridColumn';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TImeGridColumnContext';

const TimeGridColumn = React.forwardRef(function CalendarCell(
  componentProps: TimeGridColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Hook props
    value,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { props, contextValue } = useTimeGridColumn({ value });

  const state: TimeGridColumn.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return (
    <TimeGridColumnContext.Provider value={contextValue}>
      {renderElement()}
    </TimeGridColumnContext.Provider>
  );
});

export namespace TimeGridColumn {
  export interface State {}

  export interface Props extends useTimeGridColumn.Parameters, BaseUIComponentProps<'div', State> {}
}

export { TimeGridColumn };
