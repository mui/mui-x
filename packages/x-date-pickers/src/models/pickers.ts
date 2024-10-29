import type { PickersShortcutsItemContext } from '../PickersShortcuts';

export interface PickerChangeHandlerContext<TError> {
  validationError: TError;
  /**
   * Shortcut causing this `onChange` or `onAccept` call.
   * If the call has not been caused by a shortcut selection, this property will be `undefined`.
   */
  shortcut?: PickersShortcutsItemContext;
}

export interface PickerValidDateLookup {}

export type PickerValidDate = keyof PickerValidDateLookup extends never
  ? any
  : PickerValidDateLookup[keyof PickerValidDateLookup];

export interface PickerOwnerState {
  /**
   * `true` if the value is currently empty.
   */
  isPickerValueEmpty: boolean;
  /**
   * `true` if the picker is open, `false` otherwise.
   */
  isPickerOpen: boolean;
  /**
   * `true` if the picker is disabled, `false` otherwise.
   */
  isPickerDisabled: boolean;
  /**
   * `true` if the picker is read-only, `false` otherwise.
   */
  isPickerReadOnly: boolean;
}
