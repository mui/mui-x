import * as React from 'react';
import { PickerValidDate } from '../../utils/adapter/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { getAdapter } from '../../utils/adapter/getAdapter';
import { useTimeGridColumnContext } from '../column/TImeGridColumnContext';
import { useInterval } from '../../utils/useInterval';

const adapter = getAdapter();

const MINUTES_IN_DAY = 24 * 60;

export function useTimeGridEvent(parameters: useTimeGridEvent.Parameters) {
  const { start, end } = parameters;
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

  const props = React.useMemo(() => ({ style }), [style]);

  const [{ started, ended }, setStartedAndEnded] = React.useState(() => {
    const currentDate = adapter.date();
    return {
      started: adapter.isBefore(start, currentDate),
      ended: adapter.isBefore(end, currentDate),
    };
  });

  // TODO: Update at the beginning of each minute.
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

  const state = React.useMemo(() => ({ started, ended }), [started, ended]);

  return { props, state };
}

export namespace useTimeGridEvent {
  export interface Parameters {
    /**
     * The time at which the event starts.
     */
    start: PickerValidDate;
    /**
     * The time at which the event ends.
     */
    end: PickerValidDate;
  }

  export interface State {
    /**
     * Whether the event start date and time is in the past.
     */
    started: boolean;
    /**
     * Whether the event end date and time is in the past.
     */
    ended: boolean;
  }
}
