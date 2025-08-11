'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { SchedulerValidDate } from '../../models';
import { TimelineEventRowContext } from './TimelineEventRowContext';

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
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Add aria-rowindex using Composite.
  const props = React.useMemo(() => ({ role: 'row' }), []);

  const state: TimelineEventRow.State = React.useMemo(() => ({}), []);

  const contextValue: TimelineEventRowContext = React.useMemo(() => ({ start, end }), [start, end]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
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

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The start date and time of the row.
     */
    start: SchedulerValidDate;
    /**
     * The end date and time of the row.
     */
    end: SchedulerValidDate;
  }
}
