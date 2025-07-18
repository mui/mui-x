'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridColumnContext } from './TimeGridColumnContext';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { TemporalValidDate } from '../../models';
import { mergeDateAndTime } from '../../utils/date-utils';

const adapter = getAdapter();

export const TimeGridColumn = React.forwardRef(function TimeGridColumn(
  componentProps: TimeGridColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    value,
    startTime,
    endTime,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const contextValue: TimeGridColumnContext = React.useMemo(
    () => ({
      start:
        startTime == null ? adapter.startOfDay(value) : mergeDateAndTime(adapter, value, startTime),
      end: endTime == null ? adapter.endOfDay(value) : mergeDateAndTime(adapter, value, endTime),
    }),
    [value, startTime, endTime],
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
    value: TemporalValidDate;
    /**
     * The start time of the column.
     * The date part is ignored, only the time part is used.
     * @defaultValue 00:00:00
     */
    startTime?: TemporalValidDate;
    /**
     * The end time of the column.
     * The date part is ignored, only the time part is used.
     * @defaultValue 23:59:59
     */
    endTime?: TemporalValidDate;
  }
}
