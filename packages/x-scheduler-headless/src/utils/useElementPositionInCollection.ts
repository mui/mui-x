import * as React from 'react';
import { useAdapter } from '../use-adapter/useAdapter';
import { SchedulerProcessedDate, SchedulerValidDate } from '../models';

export function useElementPositionInCollection(
  parameters: useElementPositionInCollection.Parameters,
): useElementPositionInCollection.ReturnValue {
  const { start, end, collectionStart, collectionEnd } = parameters;

  const adapter = useAdapter();

  return React.useMemo(() => {
    const collectionStartTimestamp = adapter.getTime(collectionStart);
    const collectionEndTimestamp = adapter.getTime(collectionEnd);
    const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;
    const startTimestamp = Math.max(start.timestamp, collectionStartTimestamp);
    const endTimestamp = Math.min(end.timestamp, collectionEndTimestamp);

    return {
      position: (startTimestamp - collectionStartTimestamp) / collectionDurationMs,
      duration: (endTimestamp - startTimestamp) / collectionDurationMs,
    };
  }, [adapter, collectionStart, collectionEnd, start, end]);
}

namespace useElementPositionInCollection {
  export interface Parameters {
    start: SchedulerProcessedDate;
    end: SchedulerProcessedDate;
    collectionStart: SchedulerValidDate;
    collectionEnd: SchedulerValidDate;
  }

  export interface ReturnValue {
    position: number;
    duration: number;
  }
}
