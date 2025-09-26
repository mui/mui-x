'use client';
import * as React from 'react';
import { useAdapter } from './adapter/useAdapter';
import { useOnEveryMinuteStart } from './useOnEveryMinuteStart';
import { SchedulerValidDate } from '../models';

export function useEvent(parameters: useEvent.Parameters): useEvent.ReturnValue {
  const adapter = useAdapter();

  const { start, end } = parameters;

  const [state, setState] = React.useState<useEvent.State>(() => {
    const currentDate = adapter.date();
    return {
      started: adapter.isBefore(start, currentDate),
      ended: adapter.isBefore(end, currentDate),
    };
  });

  useOnEveryMinuteStart(() => {
    setState((prevState) => {
      const currentDate = adapter.date();
      const newState = {
        started: adapter.isBefore(start, currentDate),
        ended: adapter.isBefore(end, currentDate),
      };

      if (newState.started === state.started && newState.ended === state.ended) {
        return prevState;
      }

      return newState;
    });
  });

  return { state };
}

export namespace useEvent {
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
    state: State;
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
