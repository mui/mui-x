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
   * `true` if the value of the picker is currently empty.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  isPickerValueEmpty: boolean;
  /**
   * `true` if the picker is open, `false` otherwise.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  isPickerOpen: boolean;
  /**
   * `true` if the picker is disabled, `false` otherwise.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  isPickerDisabled: boolean;
  /**
   * `true` if the picker is read-only, `false` otherwise.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  isPickerReadOnly: boolean;
}
