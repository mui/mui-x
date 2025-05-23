'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { SchedulerValidDate } from '../../utils/adapter/types';

const adapter = getAdapter();

const TimeGridColumn = React.forwardRef(function TimeGridColumn(
  componentProps: TimeGridColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    value,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({ start: adapter.startOfDay(value), end: adapter.endOfDay(value) }),
    [value],
  );

  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const state: TimeGridColumn.State = React.useMemo(() => ({}), []);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return (
    <TimeGridColumnContext.Provider value={contextValue}>{element}</TimeGridColumnContext.Provider>
  );
});

export namespace TimeGridColumn {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The value of the column.
     */
    value: SchedulerValidDate;
  }
}

export { TimeGridColumn };
