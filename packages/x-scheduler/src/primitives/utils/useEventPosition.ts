import * as React from 'react';
import { useAdapter } from './adapter/useAdapter';
import { SchedulerValidDate } from '../models';

export function useEventPosition(
  parameters: useEventPosition.Parameters,
): useEventPosition.ReturnValue {
  const { start, end, collectionStart, collectionEnd } = parameters;

  const adapter = useAdapter();

  return React.useMemo(() => {
    // TODO: Avoid JS date conversion
    const getTimestamp = (date: SchedulerValidDate) => adapter.toJsDate(date).getTime();

    const collectionStartTimestamp = getTimestamp(collectionStart);
    const collectionEndTimestamp = getTimestamp(collectionEnd);
    const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;
    const startTimestamp = Math.max(getTimestamp(start), collectionStartTimestamp);
    const endTimestamp = Math.min(getTimestamp(end), collectionEndTimestamp);

    return {
      position: (startTimestamp - collectionStartTimestamp) / collectionDurationMs,
      duration: (endTimestamp - startTimestamp) / collectionDurationMs,
    };
  }, [adapter, collectionStart, collectionEnd, start, end]);
}

namespace useEventPosition {
  export interface Parameters {
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    collectionStart: SchedulerValidDate;
    collectionEnd: SchedulerValidDate;
  }

  export interface ReturnValue {
    position: number;
    duration: number;
  }
}
