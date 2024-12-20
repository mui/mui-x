import * as React from 'react';
import { PickerOwnerState } from '../../models';
import { PickersInputLocaleText } from '../../locales';
import { LocalizationProvider } from '../../LocalizationProvider';
import {
  DateOrTimeViewWithMeridiem,
  PickerOrientation,
  PickerValidValue,
  PickerVariant,
} from '../models';
import type {
  UsePickerValueActionsContextValue,
  UsePickerValueContextValue,
  UsePickerValuePrivateContextValue,
} from '../hooks/usePicker/usePickerValue.types';
import { UsePickerViewsContextValue } from '../hooks/usePicker/usePickerViews';
import { IsValidValueContext } from '../../hooks/useIsValidValue';

export const PickerContext = React.createContext<PickerContextValue<any, any, any> | null>(null);

export const PickerActionsContext = React.createContext<PickerActionsContextValue<any, any> | null>(
  null,
);

export const PickerPrivateContext = React.createContext<PickerPrivateContextValue>({
  ownerState: {
    isPickerDisabled: false,
    isPickerReadOnly: false,
    isPickerValueEmpty: false,
    isPickerOpen: false,
    pickerVariant: 'desktop',
    pickerOrientation: 'portrait',
  },
  dismissViews: () => {},
});

/**
 * Provides the context for the various parts of a picker component:
 * - contextValue: the context for the picker sub-components.
 * - localizationProvider: the translations passed through the props and through a parent LocalizationProvider.
 *
 * @ignore - do not document.
 */
export function PickerProvider<TValue extends PickerValidValue>(
  props: PickerProviderProps<TValue>,
) {
  const {
    contextValue,
    actionsContextValue,
    privateContextValue,
    isValidContextValue,
    localeText,
    children,
  } = props;

  return (
    <PickerContext.Provider value={contextValue}>
      <PickerActionsContext.Provider value={actionsContextValue}>
        <PickerPrivateContext.Provider value={privateContextValue}>
          <IsValidValueContext.Provider value={isValidContextValue}>
            <LocalizationProvider localeText={localeText}>{children}</LocalizationProvider>
          </IsValidValueContext.Provider>
        </PickerPrivateContext.Provider>
      </PickerActionsContext.Provider>
    </PickerContext.Provider>
  );
}

export interface PickerProviderProps<TValue extends PickerValidValue> {
  contextValue: PickerContextValue<any, any, any>;
  actionsContextValue: PickerActionsContextValue<any, any>;
  privateContextValue: PickerPrivateContextValue;
  isValidContextValue: (value: TValue) => boolean;
  localeText: PickersInputLocaleText | undefined;
  children: React.ReactNode;
}

export interface PickerContextValue<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
> extends UsePickerValueContextValue<TValue, TError>,
    UsePickerViewsContextValue<TView> {
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

export interface PickerActionsContextValue<TValue extends PickerValidValue, TError = string>
  extends UsePickerValueActionsContextValue<TValue, TError> {}

export interface PickerPrivateContextValue extends UsePickerValuePrivateContextValue {
  /**
   * The ownerState of the picker.
   */
  ownerState: PickerOwnerState;
}
