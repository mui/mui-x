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

export interface PickerOwnerState<TValue> {
  /**
   * The value currently displayed in the field and in the view.
   */
  value: TValue;
  /**
   * `true` if the picker is open, `false` otherwise.
   */
  open: boolean;
  /**
   * `true` if the picker is disabled, `false` otherwise.
   */
  disabled: boolean;
  /**
   * `true` if the picker is read-only, `false` otherwise.
   */
  readOnly: boolean;
}
