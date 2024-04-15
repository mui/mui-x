import type { PickerValidDateLookup, PickerValidDate } from '@mui/x-adapter-common';
import type { PickersShortcutsItemContext } from '../PickersShortcuts';

export interface PickerChangeHandlerContext<TError> {
  validationError: TError;
  /**
   * Shortcut causing this `onChange` call.
   * If the call has not been caused by a shortcut selection, this property will be `undefined`.
   */
  shortcut?: PickersShortcutsItemContext;
}

export type { PickerValidDate, PickerValidDateLookup };
