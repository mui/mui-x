'use client';
import { useAxisTooltip, UseAxisTooltipParams, UseAxisTooltipReturnValue } from './useAxisTooltip';

type UseAxesTooltipParams = Omit<UseAxisTooltipParams, 'multipleAxes'>;

/**
 * Returns the axes to display in the tooltip and the series item related to them.
 */
export function useAxesTooltip(params?: UseAxesTooltipParams): UseAxisTooltipReturnValue[] | null {
  return useAxisTooltip({ ...params, multipleAxes: true });
}
