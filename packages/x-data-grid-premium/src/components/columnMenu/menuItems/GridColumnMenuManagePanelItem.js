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
exports.GridColumnMenuManagePanelItem = GridColumnMenuManagePanelItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var GridColumnMenuPivotItem_1 = require("./GridColumnMenuPivotItem");
var GridColumnMenuChartsItem_1 = require("./GridColumnMenuChartsItem");
function GridColumnMenuManagePanelItem(props) {
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(GridColumnMenuPivotItem_1.GridColumnMenuPivotItem, __assign({}, props)), (0, jsx_runtime_1.jsx)(GridColumnMenuChartsItem_1.GridColumnMenuChartsItem, __assign({}, props))] }));
}
