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
exports.useMultiInputRangeFieldRootProps = useMultiInputRangeFieldRootProps;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var internals_1 = require("@mui/x-date-pickers/internals");
/**
 * @ignore - internal hook.
 */
function useMultiInputRangeFieldRootProps(forwardedProps) {
    var pickerContext = (0, internals_1.useNullablePickerContext)();
    var privatePickerContext = (0, internals_1.usePickerPrivateContext)();
    var handleBlur = (0, useEventCallback_1.default)(function () {
        if (!pickerContext || privatePickerContext.viewContainerRole !== 'tooltip') {
            return;
        }
        (0, internals_1.executeInTheNextEventLoopTick)(function () {
            var _a, _b;
            if (((_a = privatePickerContext.rootRefObject.current) === null || _a === void 0 ? void 0 : _a.contains((0, internals_1.getActiveElement)(privatePickerContext.rootRefObject.current))) ||
                ((_b = pickerContext.popupRef.current) === null || _b === void 0 ? void 0 : _b.contains((0, internals_1.getActiveElement)(pickerContext.popupRef.current)))) {
                return;
            }
            privatePickerContext.dismissViews();
        });
    });
    return __assign(__assign({}, forwardedProps), { onBlur: handleBlur });
}
