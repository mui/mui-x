'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useTimeGridColumnContext } from './TimeGridColumnContext';

export function useGetDateFromPositionInColumn(
  parameters: useGetDateFromPositionInColumn.Parameters,
): useGetDateFromPositionInColumn.ReturnValue {
  const { elementRef, snapMinutes } = parameters;
  const adapter = useAdapter();
  const { getCursorPositionInElementMs, start } = useTimeGridColumnContext();

  return React.useCallback(
    (clientY: number): SchedulerValidDate => {
      const offsetMs = getCursorPositionInElementMs({ input: { clientY }, elementRef });
      const offsetMin = Math.floor(offsetMs / 60000);
      const anchor = adapter.addMinutes(start, offsetMin);
      return adapter.addMinutes(anchor, -(adapter.getMinutes(anchor) % snapMinutes));
    },
    [adapter, getCursorPositionInElementMs, elementRef, snapMinutes, start],
  );
}

export namespace useGetDateFromPositionInColumn {
  export interface Parameters {
    /**
     * Column DOM element ref.
     */
    elementRef: React.RefObject<HTMLElement | null>;
    /**
     * Snap interval in minutes.
     */
    snapMinutes: number;
  }
  /**
   * Returns the snapped date within the current column for a given mouse clientY.
   */
  export type ReturnValue = (clientY: number) => SchedulerValidDate;
}
