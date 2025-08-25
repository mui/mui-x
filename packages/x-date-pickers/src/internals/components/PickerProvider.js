"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickerPrivateContext = exports.PickerActionsContext = void 0;
exports.PickerProvider = PickerProvider;
var React = require("react");
var LocalizationProvider_1 = require("../../LocalizationProvider");
var useIsValidValue_1 = require("../../hooks/useIsValidValue");
var useNullableFieldPrivateContext_1 = require("../hooks/useNullableFieldPrivateContext");
var usePickerContext_1 = require("../../hooks/usePickerContext");
exports.PickerActionsContext = React.createContext(null);
exports.PickerPrivateContext = React.createContext({
    ownerState: {
        isPickerDisabled: false,
        isPickerReadOnly: false,
        isPickerValueEmpty: false,
        isPickerOpen: false,
        pickerVariant: 'desktop',
        pickerOrientation: 'portrait',
    },
    rootRefObject: { current: null },
    labelId: undefined,
    dismissViews: function () { },
    hasUIView: true,
    getCurrentViewMode: function () { return 'UI'; },
    triggerElement: null,
    viewContainerRole: null,
    defaultActionBarActions: [],
    onPopperExited: undefined,
});
/**
 * Provides the context for the various parts of a Picker component:
 * - contextValue: the context for the Picker sub-components.
 * - localizationProvider: the translations passed through the props and through a parent LocalizationProvider.
 *
 * @ignore - do not document.
 */
function PickerProvider(props) {
    var contextValue = props.contextValue, actionsContextValue = props.actionsContextValue, privateContextValue = props.privateContextValue, fieldPrivateContextValue = props.fieldPrivateContextValue, isValidContextValue = props.isValidContextValue, localeText = props.localeText, children = props.children;
    return (<usePickerContext_1.PickerContext.Provider value={contextValue}>
      <exports.PickerActionsContext.Provider value={actionsContextValue}>
        <exports.PickerPrivateContext.Provider value={privateContextValue}>
          <useNullableFieldPrivateContext_1.PickerFieldPrivateContext.Provider value={fieldPrivateContextValue}>
            <useIsValidValue_1.IsValidValueContext.Provider value={isValidContextValue}>
              <LocalizationProvider_1.LocalizationProvider localeText={localeText}>{children}</LocalizationProvider_1.LocalizationProvider>
            </useIsValidValue_1.IsValidValueContext.Provider>
          </useNullableFieldPrivateContext_1.PickerFieldPrivateContext.Provider>
        </exports.PickerPrivateContext.Provider>
      </exports.PickerActionsContext.Provider>
    </usePickerContext_1.PickerContext.Provider>);
}
