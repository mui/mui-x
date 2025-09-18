'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import type { SchedulerValidDate } from '../models';

type Surface = 'time' | 'day';

type Unregister = () => void;

type DraftState = {
  id: string | null;
  start: SchedulerValidDate | null;
  end: SchedulerValidDate | null;
  allDay: boolean;
  surface: Surface | null;
};

type SurfaceAPI = {
  setPlaceholder: (ph: {
    id: string;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    allDay?: boolean;
  }) => void;
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
  }) => void;
  updateDraft: (next: {
    start?: SchedulerValidDate;
    end?: SchedulerValidDate;
    allDay?: boolean;
    surface?: Surface;
  }) => void;
  clearDraft: () => void;
  registerSurface: (surface: Surface, api: SurfaceAPI) => void;
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
  });

  // API that registers surfaces (day grid, time grid) use to communicate with the draft
  const apisRef = React.useRef<Partial<Record<Surface, SurfaceAPI>>>({});

  const registerSurface = useEventCallback((surface: Surface, api: SurfaceAPI): Unregister => {
    apisRef.current[surface] = api;
    return () => {
      const current = apisRef.current[surface];
      // avoid unregistering if another api has been registered in the meantime
      if (current === api) {
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
    }) => {
      clearAllPlaceholders();
      setDraft({
        id: init.id,
        start: init.start,
        end: init.end,
        allDay: Boolean(init.allDay),
        surface: init.surface,
      });
      apisRef.current[init.surface]?.setPlaceholder({
        id: init.id,
        start: init.start,
        end: init.end,
        allDay: init.allDay,
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

        const updated: DraftState = {
          id: prev.id,
          start: next.start ?? prev.start!,
          end: next.end ?? prev.end!,
          allDay: next.allDay ?? prev.allDay,
          surface: next.surface ?? prev.surface!,
        };

        // change surface, it clears the previous placeholder and sets a new one
        if (updated.surface !== prev.surface) {
          if (prev.surface) {
            apisRef.current[prev.surface!]?.clearPlaceholder();
          }
          apisRef.current[updated.surface!]?.setPlaceholder({
            id: updated.id!,
            start: updated.start!,
            end: updated.end!,
            allDay: updated.allDay,
          });
        } else {
          // same surface, just update the existing placeholder
          apisRef.current[updated.surface!]?.setPlaceholder({
            id: updated.id!,
            start: updated.start!,
            end: updated.end!,
            allDay: updated.allDay,
          });
        }

        return updated;
      });
    },
  );

  const clearDraft = useEventCallback(() => {
    clearAllPlaceholders();
    setDraft({ id: null, start: null, end: null, allDay: false, surface: null });
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
