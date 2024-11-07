import * as React from 'react';
import { PickerOwnerState } from '../../models';
import { PickersInputLocaleText } from '../../locales';
import { LocalizationProvider } from '../../LocalizationProvider';

export const PickerContext = React.createContext<PickerContextValue | null>(null);

export const PickerPrivateContext = React.createContext<PickerPrivateContextValue>({
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
export function PickerProvider(props: PickerProviderProps) {
  const { contextValue, privateContextValue, localeText, children } = props;

  return (
    <PickerContext.Provider value={contextValue}>
      <PickerPrivateContext.Provider value={privateContextValue}>
        <LocalizationProvider localeText={localeText}>{children}</LocalizationProvider>
      </PickerPrivateContext.Provider>
    </PickerContext.Provider>
  );
}

export interface PickerProviderProps {
  contextValue: PickerContextValue;
  privateContextValue: PickerPrivateContextValue;
  localeText: PickersInputLocaleText | undefined;
  children: React.ReactNode;
}

export interface PickerContextValue {
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
export interface PickerPrivateContextValue {
  /**
   * The ownerState of the picker.
   */
  ownerState: PickerOwnerState;
}
