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
  /**
   * The responsive variant of the picker.
   * Is equal to "desktop" when using a desktop picker (like <DesktopDatePicker />).
   * Is equal to "mobile" when using a mobile picker (like <MobileDatePicker />).
   * Is equal to "mobile" or "desktop" when using a responsive picker (like <DatePicker />) depending on the `desktopModeMediaQuery` prop.
   * Is equal to "mobile" or "desktop" when using a static picker (like <StaticDatePicker />) depending on the `displayStaticWrapperAs` prop.
   * Is always equal to "desktop" if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  pickerVariant: PickerVariant;
  /**
   * The orientation of the picker.
   * Is equal to "landscape" when the picker is in landscape orientation.
   * Is equal to "portrait" when the picker is in portrait orientation.
   * You can use the "orientation" on any picker component to force the orientation.
   * Is always equal to "portrait" if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  pickerOrientation: PickerOrientation;
}
