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
exports.GridHeader = GridHeader;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridPreferencesPanel_1 = require("./panel/GridPreferencesPanel");
function GridHeader() {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(GridPreferencesPanel_1.GridPreferencesPanel, {}), rootProps.showToolbar && ((0, jsx_runtime_1.jsx)(rootProps.slots.toolbar
            // Fixes error augmentation issue https://github.com/mui/mui-x/pull/15255#issuecomment-2454721612
            , __assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.toolbar)))] }));
}
