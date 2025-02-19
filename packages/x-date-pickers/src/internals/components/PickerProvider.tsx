import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

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
import {
  UsePickerViewsActionsContextValue,
  UsePickerViewsContextValue,
  UsePickerViewsPrivateContextValue,
} from '../hooks/usePicker/usePickerViews';
import { IsValidValueContext } from '../../hooks/useIsValidValue';
import {
  PickerFieldPrivateContext,
  PickerFieldPrivateContextValue,
} from '../hooks/useNullableFieldPrivateContext';
import { PickerContext } from '../../hooks/usePickerContext';

export const PickerActionsContext = React.createContext<PickerActionsContextValue<
  any,
  any,
  any
> | null>(null);

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
  hasUIView: true,
  doesTheCurrentViewHasAnUI: () => true,
  rootRefObject: { current: null },
  viewContainerRole: null,
  labelId: undefined,
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
    fieldPrivateContextValue,
    isValidContextValue,
    localeText,
    children,
  } = props;

  return (
    <PickerContext.Provider value={contextValue}>
      <PickerActionsContext.Provider value={actionsContextValue}>
        <PickerPrivateContext.Provider value={privateContextValue}>
          <PickerFieldPrivateContext.Provider value={fieldPrivateContextValue}>
            <IsValidValueContext.Provider value={isValidContextValue}>
              <LocalizationProvider localeText={localeText}>{children}</LocalizationProvider>
            </IsValidValueContext.Provider>
          </PickerFieldPrivateContext.Provider>
        </PickerPrivateContext.Provider>
      </PickerActionsContext.Provider>
    </PickerContext.Provider>
  );
}

export interface PickerProviderProps<TValue extends PickerValidValue> {
  contextValue: PickerContextValue<any, any, any>;
  actionsContextValue: PickerActionsContextValue<any, any, any>;
  privateContextValue: PickerPrivateContextValue;
  fieldPrivateContextValue: PickerFieldPrivateContextValue;
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
   * Whether the picker is disabled.
   */
  disabled: boolean;
  /**
   * Whether the picker is read-only.
   */
  readOnly: boolean;
  /**
   * Whether the picker should be focused on mount.
   * If the picker has a field and is not open, the field should be focused.
   * If the picker does not have a field (if it is a static picker) or is not open, the view should be focused.
   */
  autoFocus: boolean;
  /**
   * The responsive variant of the picker.
   * It is equal to "desktop" when using a desktop picker (like <DesktopDatePicker />).
   * It is equal to "mobile" when using a mobile picker (like <MobileDatePicker />).
   * It is equal to "mobile" or "desktop" when using a responsive picker (like <DatePicker />) depending on the `desktopModeMediaQuery` prop.
   * It is equal to "mobile" or "desktop" when using a static picker (like <StaticDatePicker />) depending on the `displayStaticWrapperAs` prop.
   * It is always equal to "desktop" if the component you are accessing the context from is not wrapped by a picker.
   */
  variant: PickerVariant;
  /**
   * The orientation of the picker.
   * On Time Pickers and Date Time Pickers, it is always equal to "portrait".
   * On Date Pickers, it is equal to the picker `orientation` prop if defined, otherwise it is based on the current orientation of the user's screen.
   * It is always equal to "portrait" if the component you are accessing the context from is not wrapped by a picker.
   */
  orientation: PickerOrientation;
  /**
   * Whether the heavy animations should be disabled.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations?: boolean;
  /**
   * The ref to attach to the element that triggers the Picker opening.
   * When using a built-in field component, this property is automatically attached to the right element.
   */
  triggerRef: React.RefObject<any>;
  /**
   * The status of the element that triggers the Picker opening.
   * If it is "hidden", the field should not render the UI to open the Picker.
   * If it is "disabled", the field should render a disabled UI to open the Picker.
   * If it is "enabled", the field should render an interactive UI to open the Picker.
   */
  triggerStatus: 'hidden' | 'disabled' | 'enabled';
  /**
   * The ref to attach to the popup's outermost element that contains the view, if any.
   * When using a built-in popup component, this property is automatically attached to the appropriate element.
   */
  popupRef: React.RefObject<any>;
  /**
   * The format to use when rendering the value in the field.
   * It is equal to the picker `format` prop if defined.
   * It is generated based on the available views if not defined.
   * It is always equal to an empty string if the picker does not have a field (static pickers).
   * It is always equal to an empty string if the component you are accessing the context from is not wrapped by a picker.
   */
  fieldFormat: string;
  /**
   * The name to apply to the <input /> element if the picker contains one.
   * If the picker has a field, it should probably be applied to its input element.
   * It is equal to the picker `name` prop if defined (the prop does not exist on static pickers).
   * It is always equal to undefined if the component you are accessing the context from is not wrapped by a picker.
   */
  name: string | undefined;
  /**
   * The label to render by the field if the picker contains one.
   * It is equal to the picker `label` prop if defined (the prop does not exist on static pickers).
   * It is always equal to undefined if the component you are accessing the context from is not wrapped by a picker.
   */
  label: React.ReactNode | undefined;
  /**
   * The class name to apply to the root element.
   * If the picker has a field, it should be applied to field root element, otherwise to the layout root element.
   * It is equal to the picker `className` prop if defined.
   * It is always equal to undefined if the component you are accessing the context from is not wrapped by a picker.
   */
  rootClassName: string | undefined;
  /**
   * The MUI style prop to apply to the root element.
   * If the picker has a field, it should be applied to field root element, otherwise to the layout root element.
   * It is equal to the picker `sx` prop if defined.
   * It is always equal to undefined if the component you are accessing the context from is not wrapped by a picker.
   */
  rootSx: SxProps<Theme> | undefined;
  /**
   * The ref to attach to the root element.
   * If the picker has a field, it should be attached to field root element, otherwise to the layout root element.
   * It is equal to the ref passed to the picker component if defined.
   * It is always equal to undefined if the component you are accessing the context from is not wrapped by a picker.
   */
  rootRef: React.ForwardedRef<HTMLDivElement> | undefined;
}

export interface PickerActionsContextValue<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError = string | null,
> extends UsePickerValueActionsContextValue<TValue, TError>,
    UsePickerViewsActionsContextValue<TView> {}

export interface PickerPrivateContextValue
  extends UsePickerValuePrivateContextValue,
    UsePickerViewsPrivateContextValue {
  /**
   * The ownerState of the picker.
   */
  ownerState: PickerOwnerState;
  /**
   * The ref of the root element.
   * This is the object counterpart of the `usePickerContext().rootRef` property which can be a function.
   */
  rootRefObject: React.RefObject<HTMLDivElement | null>;
  /**
   * The id of the label element.
   */
  labelId: string | undefined;
}
