import type { PickersShortcutsItemWithoutValue } from '../PickersShortcuts';

export interface PickerChangeHandlerContext<TError> {
  validationError: TError;
  /**
   * Shortcut causing this `onChange` call.
   * If the call has not been caused by a shortcut selection, it will equal `null`.
   */
  shortcut: PickersShortcutsItemWithoutValue | null;
}
