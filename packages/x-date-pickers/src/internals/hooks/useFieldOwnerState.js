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
exports.useFieldOwnerState = useFieldOwnerState;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var usePickerPrivateContext_1 = require("./usePickerPrivateContext");
function useFieldOwnerState(parameters) {
    var pickerOwnerState = (0, usePickerPrivateContext_1.usePickerPrivateContext)().ownerState;
    var isRtl = (0, RtlProvider_1.useRtl)();
    return React.useMemo(function () {
        var _a, _b, _c;
        return (__assign(__assign({}, pickerOwnerState), { isFieldDisabled: (_a = parameters.disabled) !== null && _a !== void 0 ? _a : false, isFieldReadOnly: (_b = parameters.readOnly) !== null && _b !== void 0 ? _b : false, isFieldRequired: (_c = parameters.required) !== null && _c !== void 0 ? _c : false, fieldDirection: isRtl ? 'rtl' : 'ltr' }));
    }, [pickerOwnerState, parameters.disabled, parameters.readOnly, parameters.required, isRtl]);
}
