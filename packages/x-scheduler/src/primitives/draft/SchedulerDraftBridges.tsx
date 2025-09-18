'use client';
import * as React from 'react';
import { useSchedulerDraft } from './SchedulerDraftContext';
import { useTimeGridRootContext } from '../time-grid/root/TimeGridRootContext';
import { useDayGridRootContext } from '../day-grid/root/DayGridRootContext';

export function TimeGridDraftBridge() {
  const { registerSurface } = useSchedulerDraft();
  const { setPlaceholder } = useTimeGridRootContext();

  const setRef = React.useRef(setPlaceholder);
  React.useEffect(() => {
    setRef.current = setPlaceholder;
  }, [setPlaceholder]);

  const api = React.useMemo(
    () => ({
      setPlaceholder: ({ id, start, end }: any) =>
        setRef.current?.({ eventId: id, columnId: null, start, end }),
      clearPlaceholder: () => setRef.current?.(null),
    }),
    [],
  );

  React.useEffect(() => {
    const unregister = registerSurface('time', api);
    return unregister;
  }, [registerSurface, api]);

  return null;
}

export function DayGridDraftBridge() {
  const { registerSurface } = useSchedulerDraft();
  const { setPlaceholder } = useDayGridRootContext();

  const setRef = React.useRef(setPlaceholder);
  React.useEffect(() => {
    setRef.current = setPlaceholder;
  }, [setPlaceholder]);

  const api = React.useMemo(
    () => ({
      setPlaceholder: ({ id, start, end }: any) =>
        setRef.current?.({ eventId: id, columnId: null, start, end }),
      clearPlaceholder: () => setRef.current?.(null),
    }),
    [],
  );

  React.useEffect(() => {
    const unregister = registerSurface('day', api);
    return unregister;
  }, [registerSurface, api]);

  return null;
}
