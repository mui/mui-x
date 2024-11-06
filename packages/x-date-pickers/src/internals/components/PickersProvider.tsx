import * as React from 'react';
import { PickerOwnerState } from '../../models';
import { PickersInputLocaleText } from '../../locales';
import { LocalizationProvider } from '../../LocalizationProvider';
import { PickerOrientation, PickerVariant } from '../models';

export const PickersContext = React.createContext<PickersContextValue | null>(null);

export const PickersPrivateContext = React.createContext<PickersPrivateContextValue>({
  ownerState: {
    isPickerDisabled: false,
    isPickerReadOnly: false,
    isPickerValueEmpty: false,
    isPickerOpen: false,
    pickerVariant: 'desktop',
    pickerOrientation: 'portrait',
  },
});

/**
 * Provides the context for the various parts of a picker component:
 * - contextValue: the context for the picker sub-components.
 * - localizationProvider: the translations passed through the props and through a parent LocalizationProvider.
 *
 * @ignore - do not document.
 */
export function PickersProvider(props: PickersProviderProps) {
  const { contextValue, privateContextValue, localeText, children } = props;

  return (
    <PickersContext.Provider value={contextValue}>
      <PickersPrivateContext.Provider value={privateContextValue}>
        <LocalizationProvider localeText={localeText}>{children}</LocalizationProvider>
      </PickersPrivateContext.Provider>
    </PickersContext.Provider>
  );
}

export interface PickersProviderProps {
  contextValue: PickersContextValue;
  privateContextValue: PickersPrivateContextValue;
  localeText: PickersInputLocaleText | undefined;
  children: React.ReactNode;
}

export interface PickersContextValue {
  /**
   * Open the picker.
   * @param {React.UIEvent} event The DOM event that triggered the change.
   */
  onOpen: (event: React.UIEvent) => void;
  /**
   * Close the picker.
   * @param {React.UIEvent} event The DOM event that triggered the change.
   */
  onClose: (event: React.UIEvent) => void;
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
  /**
   * The responsive variant of the picker.
   * Is equal to "desktop" when using a desktop picker (like <DesktopDatePicker />).
   * Is equal to "mobile" when using a mobile picker (like <MobileDatePicker />).
   * Is equal to "mobile" or "desktop" when using a responsive picker (like <DatePicker />) depending on the `desktopModeMediaQuery` prop.
   * Is equal to "mobile" or "desktop" when using a static picker (like <StaticDatePicker />) depending on the `displayStaticWrapperAs` prop.
   * Is always equal to "desktop" if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  variant: PickerVariant;
  /**
   * The orientation of the picker.
   * Is equal to "landscape" when the picker is in landscape orientation.
   * Is equal to "portrait" when the picker is in portrait orientation.
   * You can use the "orientation" on any picker component to force the orientation.
   * Is always equal to "portrait" if the component you are accessing the ownerState from is not wrapped by a picker.
   */
  orientation: PickerOrientation;
}
export interface PickersPrivateContextValue {
  /**
   * The ownerState of the picker.
   */
  ownerState: PickerOwnerState;
}
