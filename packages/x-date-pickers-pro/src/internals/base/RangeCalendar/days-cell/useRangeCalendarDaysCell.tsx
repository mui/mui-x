// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCell';

export function useRangeCalendarDaysCell(parameters: useRangeCalendarDaysCell.Parameters) {
  return useBaseCalendarDaysCell(parameters);
}

export namespace useRangeCalendarDaysCell {
  export interface Parameters extends Omit<useBaseCalendarDaysCell.Parameters, 'ctx'> {
    ctx: Context;
  }

  export interface Context extends useBaseCalendarDaysCell.Context {
    isSelectionStart: boolean;
    isSelectionEnd: boolean;
  }
}
