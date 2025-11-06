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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridActionsCellItem = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridActionsCellItem = (0, forwardRef_1.forwardRef)(function (props, ref) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (!props.showInMenu) {
        var label_1 = props.label, icon_1 = props.icon, showInMenu_1 = props.showInMenu, onClick_1 = props.onClick, other_1 = __rest(props, ["label", "icon", "showInMenu", "onClick"]);
        var handleClick_1 = function (event) {
            event.stopPropagation();
            event.preventDefault();
            onClick_1 === null || onClick_1 === void 0 ? void 0 : onClick_1(event);
        };
        return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({ size: "small", role: "menuitem", "aria-label": label_1 }, other_1, { onClick: handleClick_1 }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton, { ref: ref, children: React.cloneElement(icon_1, { fontSize: 'small' }) })));
    }
    var label = props.label, icon = props.icon, showInMenu = props.showInMenu, onClick = props.onClick, _b = props.closeMenuOnClick, closeMenuOnClick = _b === void 0 ? true : _b, closeMenu = props.closeMenu, other = __rest(props, ["label", "icon", "showInMenu", "onClick", "closeMenuOnClick", "closeMenu"]);
    var handleClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
        if (closeMenuOnClick) {
            closeMenu === null || closeMenu === void 0 ? void 0 : closeMenu();
        }
    };
    return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({ ref: ref }, other, { onClick: handleClick, iconStart: icon, children: label })));
});
exports.GridActionsCellItem = GridActionsCellItem;
