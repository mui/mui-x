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
exports.GridColumnsPanel = GridColumnsPanel;
var jsx_runtime_1 = require("react/jsx-runtime");
var GridPanelWrapper_1 = require("./GridPanelWrapper");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
function GridColumnsPanel(props) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    return ((0, jsx_runtime_1.jsx)(GridPanelWrapper_1.GridPanelWrapper, __assign({}, props, { children: (0, jsx_runtime_1.jsx)(rootProps.slots.columnsManagement, __assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.columnsManagement)) })));
}
