'use client';
import * as React from 'react';
import { getAdapter } from './adapter/getAdapter';
import { useOnEveryMinuteStart } from './useOnEveryMinuteStart';
import { TemporalValidDate } from '../models';

const adapter = getAdapter();

export function useEvent(parameters: useEvent.Parameters): useEvent.ReturnValue {
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

  const props = React.useMemo(() => ({}), []);

  return { state, props };
}

export namespace useEvent {
  export interface Parameters {
    /**
     * The time at which the event starts.
     */
    start: TemporalValidDate;
    /**
     * The time at which the event ends.
     */
    end: TemporalValidDate;
  }

  export interface ReturnValue {
    state: State;
    props: React.HTMLAttributes<HTMLDivElement>;
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
