import * as React from 'react';
import { PickerValidDate } from '../../models';
import { PickersInputLocaleText } from '../../locales';
import { LocalizationProvider } from '../../LocalizationProvider';

export const PickersContext = React.createContext<PickersContextValue | null>(null);

/**
 * Provides the context for the various parts of a picker component:
 * - contextValue: the context for the picker sub-components.
 * - localizationProvider: the translations passed through the props and through a parent LocalizationProvider.
 *
 * @ignore - do not document.
 */
export function PickersProvider<TDate extends PickerValidDate>(
  props: PickersFieldProviderProps<TDate>,
) {
  const { contextValue, localeText, children } = props;

  return (
    <PickersContext.Provider value={contextValue}>
      <LocalizationProvider localeText={localeText}>{children}</LocalizationProvider>
    </PickersContext.Provider>
  );
}

interface PickersFieldProviderProps<TDate extends PickerValidDate> {
  contextValue: PickersContextValue;
  localeText: PickersInputLocaleText<TDate> | undefined;
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
