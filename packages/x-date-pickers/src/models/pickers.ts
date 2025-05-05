import { PickerOrientation, PickerVariant } from '../internals/models/common';
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

/**
 * Importance of the change when picking a value:
 * - "accept": fires `onChange`, fires `onAccept` and closes the Picker.
 * - "set": fires `onChange` but do not fire `onAccept` and does not close the Picker.
 * @default "accept"
 */
export type PickerChangeImportance = 'set' | 'accept';

export interface PickerOwnerState {
  /**
   * `true` if the value of the Picker is currently empty.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped with a Picker.
   */
  isPickerValueEmpty: boolean;
  /**
   * `true` if the Picker is open, `false` otherwise.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped with a Picker.
   */
  isPickerOpen: boolean;
  /**
   * `true` if the Picker is disabled, `false` otherwise.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped with a Picker.
   */
  isPickerDisabled: boolean;
  /**
   * `true` if the Picker is read-only, `false` otherwise.
   * Is always `false` if the component you are accessing the ownerState from is not wrapped with a Picker.
   */
  isPickerReadOnly: boolean;
  /**
   * The responsive variant of the Picker.
   * Is equal to "desktop" when using a desktop Picker (like <DesktopDatePicker />).
   * Is equal to "mobile" when using a mobile Picker (like <MobileDatePicker />).
   * Is equal to "mobile" or "desktop" when using a responsive Picker (like <DatePicker />) depending on the `desktopModeMediaQuery` prop.
   * Is equal to "mobile" or "desktop" when using a static Picker (like <StaticDatePicker />) depending on the `displayStaticWrapperAs` prop.
   * Is always equal to "desktop" if the component you are accessing the ownerState from is not wrapped with a Picker.
   */
  pickerVariant: PickerVariant;
  /**
   * The orientation of the Picker.
   * Is equal to "landscape" when the Picker is in landscape orientation.
   * Is equal to "portrait" when the Picker is in portrait orientation.
   * You can use the "orientation" on any Picker component to force the orientation.
   * Is always equal to "portrait" if the component you are accessing the ownerState from is not wrapped with a Picker.
   */
  pickerOrientation: PickerOrientation;
}
