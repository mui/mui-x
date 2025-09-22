'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import type { CalendarPrimitiveEventData, SchedulerValidDate } from '../models';

type Surface = 'time' | 'day';

type DraftState = {
  id: string | null;
  start: SchedulerValidDate | null;
  end: SchedulerValidDate | null;
  allDay: boolean;
  surface: Surface | null;
  lockSurface: Surface | null;
};

type SurfaceAPI = {
  setPlaceholder: (placeholder: CalendarPrimitiveEventData | null) => void;
  clearPlaceholder: () => void;
};

type DraftContextValue = {
  draft: DraftState;
  startDraft: (init: {
    id: string;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    surface: Surface;
    allDay?: boolean;
    lockSurface?: Surface;
  }) => void;
  updateDraft: (next: {
    start?: SchedulerValidDate;
    end?: SchedulerValidDate;
    allDay?: boolean;
    surface?: Surface;
  }) => void;
  clearDraft: () => void;
  registerSurface: (surface: Surface, api: SurfaceAPI) => () => void;
};

const SchedulerDraftContext = React.createContext<DraftContextValue | undefined>(undefined);

export function useSchedulerDraft(): DraftContextValue {
  const ctx = React.useContext(SchedulerDraftContext);
  if (ctx === undefined) {
    throw new Error(
      'Scheduler: `SchedulerDraftContext` is missing. Wrap with <SchedulerDraftProvider>.',
    );
  }
  return ctx;
}

export function SchedulerDraftProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const [draft, setDraft] = React.useState<DraftState>({
    id: null,
    start: null,
    end: null,
    allDay: false,
    surface: null,
    lockSurface: null,
  });

  // API that registers surfaces (day grid, time grid) use to communicate with the draft
  const apisRef = React.useRef<Partial<Record<Surface, SurfaceAPI>>>({});

  const registerSurface = useEventCallback((surface: Surface, api: SurfaceAPI) => {
    apisRef.current[surface] = api;

    return () => {
      if (apisRef.current[surface] === api) {
        delete apisRef.current[surface];
      }
    };
  });

  const clearAllPlaceholders = useEventCallback(() => {
    const apis = apisRef.current;
    apis.time?.clearPlaceholder();
    apis.day?.clearPlaceholder();
  });

  const startDraft = useEventCallback(
    (init: {
      id: string;
      start: SchedulerValidDate;
      end: SchedulerValidDate;
      surface: Surface;
      allDay?: boolean;
      lockSurface?: Surface;
    }) => {
      clearAllPlaceholders();
      setDraft({
        id: init.id,
        start: init.start,
        end: init.end,
        allDay: Boolean(init.allDay),
        surface: init.surface,
        lockSurface: init.lockSurface ?? null,
      });
      apisRef.current[init.surface]?.setPlaceholder({
        eventId: init.id,
        start: init.start,
        end: init.end,
        columnId: null,
        originalStart: init.start,
      });
    },
  );

  const updateDraft = useEventCallback(
    (next: {
      start?: SchedulerValidDate;
      end?: SchedulerValidDate;
      allDay?: boolean;
      surface?: Surface;
    }) => {
      setDraft((prev) => {
        if (!prev.id) {
          return prev;
        }

        const nextAllDay = next.allDay ?? prev.allDay;

        const desiredSurface: Surface =
          prev.lockSurface ?? next.surface ?? (nextAllDay ? 'day' : 'time');

        const updated: DraftState = {
          id: prev.id,
          start: next.start ?? prev.start!,
          end: next.end ?? prev.end!,
          allDay: next.allDay ?? prev.allDay,
          surface: desiredSurface,
          lockSurface: prev.lockSurface,
        };

        // change surface, it clears the previous placeholder and sets a new one
        if (updated.surface !== prev.surface) {
          if (prev.surface) {
            apisRef.current[prev.surface!]?.clearPlaceholder();
          }
          apisRef.current[updated.surface!]?.setPlaceholder({
            eventId: updated.id!,
            start: updated.start!,
            end: updated.end!,
            columnId: null,
            originalStart: updated.start!,
          });
        } else {
          // same surface, just update the existing placeholder
          apisRef.current[updated.surface!]?.setPlaceholder({
            eventId: updated.id!,
            start: updated.start!,
            end: updated.end!,
            columnId: null,
            originalStart: updated.start!,
          });
        }

        return updated;
      });
    },
  );

  const clearDraft = useEventCallback(() => {
    clearAllPlaceholders();
    setDraft({ id: null, start: null, end: null, allDay: false, surface: null, lockSurface: null });
  });

  const value = React.useMemo<DraftContextValue>(
    () => ({
      draft,
      startDraft,
      updateDraft,
      clearDraft,
      registerSurface,
    }),
    [draft, startDraft, updateDraft, clearDraft, registerSurface],
  );

  return <SchedulerDraftContext.Provider value={value}>{children}</SchedulerDraftContext.Provider>;
}
