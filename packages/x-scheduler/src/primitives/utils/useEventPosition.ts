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

    const rowStartTimestamp = getTimestamp(collectionStart);
    const rowEndTimestamp = getTimestamp(collectionEnd);
    const eventStartTimestamp = getTimestamp(start);
    const eventEndTimestamp = getTimestamp(end);
    const rowDurationMs = rowEndTimestamp - rowStartTimestamp;

    const startTimestamp = Math.max(eventStartTimestamp, rowStartTimestamp);
    const endTimestamp = Math.min(eventEndTimestamp, rowEndTimestamp);

    return {
      position: (startTimestamp - rowStartTimestamp) / rowDurationMs,
      duration: (endTimestamp - startTimestamp) / rowDurationMs,
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
