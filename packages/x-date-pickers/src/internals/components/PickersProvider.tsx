import * as React from 'react';
import { PickerValidDate } from '../../models';
import { PickersInputLocaleText } from '../../locales';
import { LocalizationProvider } from '../../LocalizationProvider';

export const PickersFieldContext = React.createContext<PickersFieldContextValue | null>(null);

/**
 * Provides the context for the various parts of a picker component:
 * - fieldContextValue: the context for the field
 * - localizationProvider: the translations passed through the props and through a parent LocalizationProvider.
 *
 * @ignore - do not document.
 */
export function PickersProvider<TDate extends PickerValidDate>(
  props: PickersFieldProviderProps<TDate>,
) {
  const { fieldContextValue, localeText, children } = props;

  return (
    <PickersFieldContext.Provider value={fieldContextValue}>
      <LocalizationProvider localeText={localeText}>{children}</LocalizationProvider>
    </PickersFieldContext.Provider>
  );
}

interface PickersFieldProviderProps<TDate extends PickerValidDate> {
  fieldContextValue: PickersFieldContextValue;
  localeText: PickersInputLocaleText<TDate> | undefined;
  children: React.ReactNode;
}

export interface PickersFieldContextValue {
  /**
   * Open the view if they are closed, close them otherwise.
   * @param {React.UIEvent} event The DOM event that triggered the change.
   */
  onToggleView: (event: React.UIEvent) => void;
}
