import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import { PickerChangeImportance, PickerOwnerState, PickersTimezone } from '../../models';
import { PickersInputLocaleText } from '../../locales';
import { LocalizationProvider } from '../../LocalizationProvider';
import {
  DateOrTimeViewWithMeridiem,
  PickerOrientation,
  PickerValidValue,
  PickerVariant,
} from '../models';
import { IsValidValueContext } from '../../hooks/useIsValidValue';
import {
  PickerFieldPrivateContext,
  PickerFieldPrivateContextValue,
} from '../hooks/useNullableFieldPrivateContext';
import { PickerContext } from '../../hooks/usePickerContext';
import type { PickersShortcutsItemContext } from '../../PickersShortcuts';

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
> extends PickerActionsContextValue<TValue, TView, TError> {
  /**
   * The current value of the picker.
   */
  value: TValue;
  /**
   * The timezone to use when rendering the dates.
   * If a `timezone` prop is provided, it will be used.
   * If the `value` prop contains a valid date, its timezone will be used.
   * If no `value` prop is provided, but the `defaultValue` contains a valid date, its timezone will be used.
   * If no `value` or `defaultValue` is provided, but the `referenceDate` is provided, its timezone will be used.
   * Otherwise, the timezone will be the default one of your date library.
   */
  timezone: PickersTimezone;
  /**
   * Whether the picker is open.
   */
  open: boolean;
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
   * The views that the picker has to render.
   * It is equal to the picker `views` prop—if defined.
   * Otherwise, a default set of views is provided based on the component you are using:
   * - Date Pickers: ['year', 'day']
   * - Time Pickers: ['hours', 'minutes']
   * - Date Time Pickers: ['year', 'day', 'hours', 'minutes']
   * - Date Range Pickers: ['day']
   * - Date Time Range Pickers: ['day', 'hours', 'minutes']
   */
  views: readonly TView[];
  /**
   * The currently rendered view.
   */
  view: TView | null;
  /**
   * The view showed when first opening the picker.
   */
  initialView: TView | null;
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
> {
  /**
   * Set the current value of the picker.
   * @param {TValue} value The new value of the picker.
   * @param {SetValueActionOptions<TError>} options The options to customize the behavior of this update.
   */
  setValue: (value: TValue, options?: SetValueActionOptions<TError>) => void;
  /**
   * Set the current open state of the Picker.
   * ```ts
   * setOpen(true); // Opens the picker.
   * setOpen(false); // Closes the picker.
   * setOpen((prevOpen) => !prevOpen); // Toggles the open state.
   * ```
   * @param {React.SetStateAction<boolean>} action The new open state of the Picker.
   * It can be a function that will receive the current open state.
   */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Set the current view.
   * @template TView
   * @param {TView} view The view to render
   */
  setView: (view: TView) => void;
  /**
   * Set the current value of the picker to be empty.
   * The value will be `null` on single pickers and `[null, null]` on range pickers.
   */
  clearValue: () => void;
  /**
   * Set the current value of the picker to be the current date.
   * The value will be `today` on single pickers and `[today, today]` on range pickers.
   * With `today` being the current date, with its time set to `00:00:00` on Date Pickers and its time set to the current time on Time and Date Pickers.
   */
  setValueToToday: () => void;
  /**
   * Accept the current value of the picker.
   * Will call `onAccept` if defined.
   * If the picker is re-opened, this value will be the one used to initialize the views.
   */
  acceptValueChanges: () => void;
  /**
   * Cancel the changes made to the current value of the picker.
   * The value will be reset to the last accepted value.
   */
  cancelValueChanges: () => void;
}

export interface SetValueActionOptions<TError = string | null> {
  /**
   * The importance of the change when picking a value:
   * - "accept": fires `onChange`, fires `onAccept` and closes the picker.
   * - "set": fires `onChange` but do not fire `onAccept` and does not close the picker.
   * @default "accept"
   */
  changeImportance?: PickerChangeImportance;
  /**
   * The validation error associated to the current value.
   * If not defined, the validation will be computed by the picker.
   */
  validationError?: TError;
  /**
   * The shortcut that triggered this change.
   * It should not be defined if the change does not come from a shortcut.
   */
  shortcut?: PickersShortcutsItemContext;
  /**
   * Whether the value should call `onChange` and `onAccept` when the value is not controlled and has never been modified.
   * If `true`, the `onChange` and `onAccept` callback will only be fired if the value has been modified (and is not equal to the last published value).
   * If `false`, the `onChange` and `onAccept` callback will be fired when the value has never been modified (`onAccept` only if `changeImportance` is set to "accept").
   * @default false
   */
  skipPublicationIfPristine?: boolean;
  /**
   * Whether the picker should close.
   * @default changeImportance === "accept"
   */
  shouldClose?: boolean;
}

export interface PickerPrivateContextValue {
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
  /*
   * Close the picker and accepts the current value if it is not equal to the last accepted value.
   */
  dismissViews: () => void;
  /**
   * Whether at least one view has an UI (it has a view renderer associated).
   */
  hasUIView: boolean;
  /**
   * Check whether the current view has an UI.
   * @returns {boolean} Whether the current view has an UI.
   */
  doesTheCurrentViewHasAnUI: () => boolean;
  /**
   * The aria role associated with the view container.
   * It is equal to "dialog" when the view is rendered inside a `@mui/material/Dialog`.
   * It is equal to "dialog" when the view is rendered inside a `@mui/material/Popper` and the focus is trapped inside the view.
   * It is equal to "tooltip" when the view is rendered inside a `@mui/material/Popper` and the focus remains inside the field.
   * It is always equal to null if the picker does not have a field (static pickers).
   * It is always equal to null if the component you are accessing the context from is not wrapped by a picker.
   */
  viewContainerRole: 'dialog' | 'tooltip' | null;
}
