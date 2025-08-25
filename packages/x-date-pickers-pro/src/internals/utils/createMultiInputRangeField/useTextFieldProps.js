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
exports.useTextFieldProps = useTextFieldProps;
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var PickersTextField_1 = require("@mui/x-date-pickers/PickersTextField");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var internals_1 = require("@mui/x-date-pickers/internals");
var useNullablePickerRangePositionContext_1 = require("../../hooks/useNullablePickerRangePositionContext");
function useTextFieldProps(_a) {
    var slotProps = _a.slotProps, ownerState = _a.ownerState, position = _a.position, allowTriggerShifting = _a.allowTriggerShifting;
    var pickerContext = (0, internals_1.useNullablePickerContext)();
    var translations = (0, hooks_1.usePickerTranslations)();
    var pickerFieldUIContext = React.useContext(internals_1.PickerFieldUIContext);
    var rangePositionContext = (0, useNullablePickerRangePositionContext_1.useNullablePickerRangePositionContext)();
    var textFieldProps = (0, useSlotProps_1.default)({
        elementType: PickersTextField_1.PickersTextField,
        externalSlotProps: (0, internals_1.mergeSlotProps)(pickerFieldUIContext.slotProps.textField, slotProps === null || slotProps === void 0 ? void 0 : slotProps.textField),
        additionalProps: {
            // TODO: Decide if we also want to set the default labels on standalone fields.
            label: pickerContext ? translations[position] : undefined,
            focused: (pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.open) ? (rangePositionContext === null || rangePositionContext === void 0 ? void 0 : rangePositionContext.rangePosition) === position : undefined,
        },
        ownerState: __assign(__assign({}, ownerState), { position: position }),
    });
    if (!textFieldProps.InputProps) {
        textFieldProps.InputProps = {};
    }
    if (pickerContext) {
        if (!allowTriggerShifting) {
            if (position === 'start') {
                textFieldProps.InputProps.ref = pickerContext.triggerRef;
            }
        }
        else if ((rangePositionContext === null || rangePositionContext === void 0 ? void 0 : rangePositionContext.rangePosition) === position) {
            textFieldProps.InputProps.ref = pickerContext.triggerRef;
        }
    }
    textFieldProps.InputProps['data-multi-input'] = position;
    return textFieldProps;
}
