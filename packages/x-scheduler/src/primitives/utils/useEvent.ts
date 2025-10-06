'use client';
import { useStore } from '@base-ui-components/utils/store';
import { SchedulerValidDate } from '../models';
import { useSchedulerStoreContext } from '../use-scheduler-store-context/useSchedulerStoreContext';
import { selectors } from './SchedulerStore';

export function useEvent(parameters: useEvent.Parameters): useEvent.ReturnValue {
  const { start, end } = parameters;

  const store = useSchedulerStoreContext();
  const state = useStore(store, selectors.isOccurrenceStartedOrEnded, start, end);

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
