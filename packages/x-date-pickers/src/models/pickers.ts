import type { PickersShortcutsItem } from '../PickersShortcuts';

export interface PickerChangeHandlerContext<TError> {
  validationError: TError;
  /**
   * Label of the shortcut causing this `onChange` call.
   * If the call has not been caused by a shortcut selection, it will equal `null`.
   */
  shortcut: Omit<PickersShortcutsItem<unknown>, 'getValue'> | null;
}
