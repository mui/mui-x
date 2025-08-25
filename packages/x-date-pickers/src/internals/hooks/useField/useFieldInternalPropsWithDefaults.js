"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldInternalPropsWithDefaults = useFieldInternalPropsWithDefaults;
var React = require("react");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useNullablePickerContext_1 = require("../useNullablePickerContext");
var useNullableFieldPrivateContext_1 = require("../useNullableFieldPrivateContext");
/**
 * Applies the default values to the field internal props.
 * This is a temporary hook that will be removed during a follow up when `useField` will receive the internal props without the defaults.
 * It is only here to allow the migration to be done in smaller steps.
 */
function useFieldInternalPropsWithDefaults(parameters) {
    var useApplyDefaultValuesToFieldInternalProps = parameters.manager.internal_useApplyDefaultValuesToFieldInternalProps, internalProps = parameters.internalProps, skipContextFieldRefAssignment = parameters.skipContextFieldRefAssignment;
    var pickerContext = (0, useNullablePickerContext_1.useNullablePickerContext)();
    var fieldPrivateContext = (0, useNullableFieldPrivateContext_1.useNullableFieldPrivateContext)();
    var handleFieldRef = (0, useForkRef_1.default)(internalProps.unstableFieldRef, skipContextFieldRefAssignment ? null : fieldPrivateContext === null || fieldPrivateContext === void 0 ? void 0 : fieldPrivateContext.fieldRef);
    var setValue = pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.setValue;
    var handleChangeFromPicker = React.useCallback(function (newValue, ctx) {
        return setValue === null || setValue === void 0 ? void 0 : setValue(newValue, {
            validationError: ctx.validationError,
            shouldClose: false,
        });
    }, [setValue]);
    var internalPropsWithDefaultsFromContext = React.useMemo(function () {
        // If one of the context is null,
        // Then the field is used as a standalone component and the other context will be null as well.
        if (fieldPrivateContext != null && pickerContext != null) {
            return __assign({ value: pickerContext.value, onChange: handleChangeFromPicker, timezone: pickerContext.timezone, disabled: pickerContext.disabled, readOnly: pickerContext.readOnly, autoFocus: pickerContext.autoFocus && !pickerContext.open, focused: pickerContext.open ? true : undefined, format: pickerContext.fieldFormat, formatDensity: fieldPrivateContext.formatDensity, enableAccessibleFieldDOMStructure: fieldPrivateContext.enableAccessibleFieldDOMStructure, selectedSections: fieldPrivateContext.selectedSections, onSelectedSectionsChange: fieldPrivateContext.onSelectedSectionsChange, unstableFieldRef: handleFieldRef }, internalProps);
        }
        return internalProps;
    }, [pickerContext, fieldPrivateContext, internalProps, handleChangeFromPicker, handleFieldRef]);
    return useApplyDefaultValuesToFieldInternalProps(internalPropsWithDefaultsFromContext);
}
