'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { SchedulerValidDate } from '../../models';
import { TimelineRowEventsContext } from './TImelineRowEventsContext';

export const TimelineRowEvents = React.forwardRef(function TimelineRowEvents(
  componentProps: TimelineRowEvents.Props,
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

  const props = React.useMemo(() => ({}), []);

  const state: TimelineRowEvents.State = React.useMemo(() => ({}), []);

  const contextValue: TimelineRowEventsContext = React.useMemo(
    () => ({
      start,
      end,
    }),
    [start, end],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return (
    <TimelineRowEventsContext.Provider value={contextValue}>
      {element}
    </TimelineRowEventsContext.Provider>
  );
});

export namespace TimelineRowEvents {
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
