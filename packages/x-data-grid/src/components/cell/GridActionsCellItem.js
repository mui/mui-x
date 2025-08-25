"use strict";
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
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridActionsCellItem = (0, forwardRef_1.forwardRef)(function (props, ref) {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (!props.showInMenu) {
        var label_1 = props.label, icon_1 = props.icon, showInMenu_1 = props.showInMenu, onClick_1 = props.onClick, other_1 = __rest(props, ["label", "icon", "showInMenu", "onClick"]);
        var handleClick_1 = function (event) {
            onClick_1 === null || onClick_1 === void 0 ? void 0 : onClick_1(event);
        };
        return (<rootProps.slots.baseIconButton size="small" role="menuitem" aria-label={label_1} {...other_1} onClick={handleClick_1} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton} ref={ref}>
        {React.cloneElement(icon_1, { fontSize: 'small' })}
      </rootProps.slots.baseIconButton>);
    }
    var label = props.label, icon = props.icon, showInMenu = props.showInMenu, onClick = props.onClick, _b = props.closeMenuOnClick, closeMenuOnClick = _b === void 0 ? true : _b, closeMenu = props.closeMenu, other = __rest(props, ["label", "icon", "showInMenu", "onClick", "closeMenuOnClick", "closeMenu"]);
    var handleClick = function (event) {
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
        if (closeMenuOnClick) {
            closeMenu === null || closeMenu === void 0 ? void 0 : closeMenu();
        }
    };
    return (<rootProps.slots.baseMenuItem ref={ref} {...other} onClick={handleClick} iconStart={icon}>
      {label}
    </rootProps.slots.baseMenuItem>);
});
exports.GridActionsCellItem = GridActionsCellItem;
GridActionsCellItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    /**
     * from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component
     */
    component: prop_types_1.default.elementType,
    disabled: prop_types_1.default.bool,
    icon: prop_types_1.default /* @typescript-to-proptypes-ignore */.oneOfType([
        prop_types_1.default.element,
        prop_types_1.default.func,
        prop_types_1.default.number,
        prop_types_1.default.object,
        prop_types_1.default.string,
        prop_types_1.default.bool,
    ]),
    label: prop_types_1.default.node,
    showInMenu: prop_types_1.default.bool,
    style: prop_types_1.default.object,
};
