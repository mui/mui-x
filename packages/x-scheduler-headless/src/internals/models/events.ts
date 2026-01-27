import { MuiEvent } from '@mui/x-internals/types';
import {
  SchedulerEventId,
  SchedulerEventUpdatedProperties,
  TemporalSupportedObject,
} from '../../models';

interface SchedulerEventLookup {
  /**
   * Fired after events are updated (for cache sync in premium).
   */
  eventsUpdated: {
    parameters: {
      deleted: SchedulerEventId[];
      updated: Map<SchedulerEventId, SchedulerEventUpdatedProperties>;
      created: SchedulerEventId[];
      newEvents: any[];
    };
    event: null;
  };
  /**
   * Fired after the view config changes (triggers data fetch in premium).
   * Used by EventCalendar.
   */
  viewConfigChanged: {
    parameters: {
      visibleDays: Array<{ key: string; value: TemporalSupportedObject }>;
      isInitialLoad: boolean;
    };
    event: null;
  };
}

export type SchedulerEvents = keyof SchedulerEventLookup;

export type SchedulerEventListener<E extends SchedulerEvents> = (
  params: SchedulerEventParameters<E>,
  event: SchedulerEventLookup[E] extends { event: any }
    ? MuiEvent<SchedulerEventLookup[E]['event']>
    : MuiEvent<{}>,
) => void;

export type SchedulerEventParameters<E extends SchedulerEvents> = SchedulerEventLookup[E] extends {
  parameters: infer P;
}
  ? P
  : undefined;

export type SchedulerEventEvent<E extends SchedulerEvents> = SchedulerEventLookup[E] extends {
  event: infer EV;
}
  ? EV
  : undefined;
