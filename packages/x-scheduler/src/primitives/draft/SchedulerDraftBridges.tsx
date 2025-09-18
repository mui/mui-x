'use client';
import * as React from 'react';
import { useSchedulerDraft } from './SchedulerDraftContext';
import { useTimeGridRootContext } from '../time-grid/root/TimeGridRootContext';
import { useDayGridRootContext } from '../day-grid/root/DayGridRootContext';

export function TimeGridDraftBridge() {
  const { registerSurface } = useSchedulerDraft();
  const { setPlaceholder } = useTimeGridRootContext();

  React.useEffect(() => {
    const unregister = registerSurface('time', {
      setPlaceholder: ({ id, start, end }) =>
        setPlaceholder?.({ eventId: id, columnId: null, start, end }),
      clearPlaceholder: () => setPlaceholder?.(null),
    });
    return unregister;
  }, [registerSurface, setPlaceholder]);

  return null;
}

export function DayGridDraftBridge() {
  const { registerSurface } = useSchedulerDraft();
  const { setPlaceholder } = useDayGridRootContext();

  React.useEffect(() => {
    const unregister = registerSurface('day', {
      setPlaceholder: ({ id, start, end }) =>
        setPlaceholder?.({
          eventId: id,
          columnId: null,
          start,
          end,
        }),
      clearPlaceholder: () => setPlaceholder?.(null),
    });
    return unregister;
  }, [registerSurface, setPlaceholder]);

  return null;
}
