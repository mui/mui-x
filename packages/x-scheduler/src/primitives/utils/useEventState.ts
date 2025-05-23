import * as React from 'react';
import { getAdapter } from './adapter/getAdapter';
import { useOnEveryMinuteStart } from './useOnEveryMinuteStart';
import { SchedulerValidDate } from './adapter/types';

const adapter = getAdapter();

export function useEventState(parameters: useEventState.Parameters): useEventState.ReturnValue {
  const { start, end } = parameters;

  const [{ started, ended }, setStartedAndEnded] = React.useState(() => {
    const currentDate = adapter.date();
    return {
      started: adapter.isBefore(start, currentDate),
      ended: adapter.isBefore(end, currentDate),
    };
  });

  useOnEveryMinuteStart(() => {
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
  });

  return React.useMemo<useEventState.ReturnValue>(() => ({ started, ended }), [started, ended]);
}

export namespace useEventState {
  export interface Parameters {
    /**
     * The time at which the event starts.
     */
    start: SchedulerValidDate;
    /**
     * The time at which the event ends.
     */
    end: SchedulerValidDate;
  }

  export interface ReturnValue {
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
