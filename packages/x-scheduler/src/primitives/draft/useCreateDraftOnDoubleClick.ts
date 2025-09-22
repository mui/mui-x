'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { CalendarEventOccurrence, SchedulerValidDate } from '../models';
import { useSchedulerDraft } from './SchedulerDraftContext';
import { CREATE_PLACEHOLDER_ID } from '../utils/event-utils';
import { Adapter } from '../utils/adapter/types';

type Surface = 'time' | 'day';

export type ComputeInitialRange = (event: React.MouseEvent) => {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
  allDay: boolean;
  surface?: Surface;
};

type UseCreateDraftOnDoubleClickOptions = {
  adapter: Adapter;
  startEditing: (event: React.MouseEvent, occurrence: CalendarEventOccurrence) => void;
  computeInitialRange: ComputeInitialRange;
  lockSurface?: Surface;
};

export function useCreateDraftOnDoubleClick(opts: UseCreateDraftOnDoubleClickOptions) {
  const { startEditing, computeInitialRange, lockSurface } = opts;
  const { startDraft } = useSchedulerDraft();

  const handle = useEventCallback((event: React.MouseEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const { start, end, allDay, surface } = computeInitialRange(event);

    const surfaceToUse: Surface = surface ?? (allDay ? 'day' : 'time');

    // 1) Initiate draft
    startDraft({
      id: CREATE_PLACEHOLDER_ID,
      start,
      end,
      allDay,
      surface: surfaceToUse,
      lockSurface,
    });

    // 2) Open popover
    startEditing(event, {
      key: CREATE_PLACEHOLDER_ID,
      id: CREATE_PLACEHOLDER_ID,
      title: '',
      start,
      end,
      allDay,
    });
  });

  return handle;
}
