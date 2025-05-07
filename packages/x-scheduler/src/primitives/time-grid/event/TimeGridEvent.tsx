'use client';
import * as React from 'react';
import { useTimeGridEvent } from './useTimeGridEvent';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { SchedulerValidDate } from '../../utils/adapter/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { useTimeGridColumnContext } from '../column/TImeGridColumnContext';
import { useInterval } from '../../utils/useInterval';

const adapter = getAdapter();

const MINUTES_IN_DAY = 24 * 60;

const TimeGridEvent = React.forwardRef(function CalendarCell(
  componentProps: TimeGridEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Hook props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const style = React.useMemo(() => {
    const isStartingBeforeColumnStart = adapter.isBefore(start, columnStart);
    const isEndingAfterColumnEnd = adapter.isAfter(end, columnEnd);
    const startTime = isStartingBeforeColumnStart
      ? 0
      : adapter.getHours(start) * 60 + adapter.getMinutes(start);
    const endTime = isEndingAfterColumnEnd
      ? MINUTES_IN_DAY
      : adapter.getHours(end) * 60 + adapter.getMinutes(end);

    const yPositionInt = isStartingBeforeColumnStart ? 0 : (startTime / MINUTES_IN_DAY) * 100;

    const heightInt = isEndingAfterColumnEnd
      ? 100 - yPositionInt
      : ((endTime - startTime) / MINUTES_IN_DAY) * 100;

    return {
      [TimeGridEventCssVars.yPosition]: `${yPositionInt}%`,
      [TimeGridEventCssVars.height]: `${heightInt}%`,
    } as React.CSSProperties;
  }, [columnStart, columnEnd, start, end]);

  const [{ started, ended }, setStartedAndEnded] = React.useState(() => {
    const currentDate = adapter.date();
    return {
      started: adapter.isBefore(start, currentDate),
      ended: adapter.isBefore(end, currentDate),
    };
  });

  // TODO: Update at the beginning of each minute instead of every minute after the first render.
  useInterval(() => {
    setStartedAndEnded((prevState) => {
      const currentDate = adapter.date();
      const newState = {
        started: adapter.isBefore(start, currentDate),
        ended: adapter.isBefore(end, currentDate),
      };

      if (newState.started === started && newState.ended === ended) {
        return prevState;
      }

      return newState;
    });
  }, 60 * 1000);

  const props = React.useMemo(() => ({ style }), [style]);

  const state = React.useMemo(() => ({ started, ended }), [started, ended]);
  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return renderElement();
});

export namespace TimeGridEvent {
  export interface State extends useTimeGridEvent.State {
    /**
     * Whether the event start date and time is in the past.
     */
    started: boolean;
    /**
     * Whether the event end date and time is in the past.
     */
    ended: boolean;
  }

  export interface Props extends useTimeGridEvent.Parameters, BaseUIComponentProps<'div', State> {
    /**
     * The time at which the event starts.
     */
    start: SchedulerValidDate;
    /**
     * The time at which the event ends.
     */
    end: SchedulerValidDate;
  }
}

export { TimeGridEvent };
