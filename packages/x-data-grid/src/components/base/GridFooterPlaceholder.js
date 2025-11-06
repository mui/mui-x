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
exports.GridFooterPlaceholder = GridFooterPlaceholder;
var jsx_runtime_1 = require("react/jsx-runtime");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
function GridFooterPlaceholder() {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (rootProps.hideFooter) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(rootProps.slots.footer, __assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.footer /* FIXME: typing error */)));
}
