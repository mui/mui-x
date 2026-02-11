'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { SchedulerProcessedDate } from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context/useSchedulerStoreContext';
import { schedulerOccurrenceSelectors } from '../../scheduler-selectors';

export function useEvent(parameters: useEvent.Parameters): useEvent.ReturnValue {
  const { start, end } = parameters;

  const store = useSchedulerStoreContext();

  const started = useStore(store, schedulerOccurrenceSelectors.isStarted, start);
  const ended = useStore(store, schedulerOccurrenceSelectors.isEnded, end);

  const state = React.useMemo(() => ({ started, ended }), [started, ended]);

  return { state };
}

export namespace useEvent {
  export interface Parameters {
    /**
     * The time at which the event starts.
     */
    start: SchedulerProcessedDate;
    /**
     * The time at which the event ends.
     */
    end: SchedulerProcessedDate;
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
