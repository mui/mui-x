import * as React from 'react';
import { PickerOwnerState } from '../../models';
import { PickersInputLocaleText } from '../../locales';
import { LocalizationProvider } from '../../LocalizationProvider';

export const PickersContext = React.createContext<PickersContextValue | null>(null);

export const PickersPrivateContext = React.createContext<PickersPrivateContextValue>({
  ownerState: {
    isPickerDisabled: false,
    isPickerReadOnly: false,
    isPickerValueEmpty: false,
    isPickerOpen: false,
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
}
export interface PickersPrivateContextValue {
  /**
   * The ownerState of the picker.
   */
  ownerState: PickerOwnerState;
}
