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
exports.GridColumnMenuContainer = void 0;
var clsx_1 = require("clsx");
var prop_types_1 = require("prop-types");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var keyboardUtils_1 = require("../../../utils/keyboardUtils");
var assert_1 = require("../../../utils/assert");
var gridClasses_1 = require("../../../constants/gridClasses");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var StyledMenuList = (0, styles_1.styled)((assert_1.NotRendered))(function () { return ({
    minWidth: 248,
}); });
function handleMenuScrollCapture(event) {
    if (!event.currentTarget.contains(event.target)) {
        return;
    }
    event.stopPropagation();
}
var GridColumnMenuContainer = (0, forwardRef_1.forwardRef)(function GridColumnMenuContainer(props, ref) {
    var hideMenu = props.hideMenu, colDef = props.colDef, id = props.id, labelledby = props.labelledby, className = props.className, children = props.children, open = props.open, other = __rest(props, ["hideMenu", "colDef", "id", "labelledby", "className", "children", "open"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var handleListKeyDown = React.useCallback(function (event) {
        if (event.key === 'Tab') {
            event.preventDefault();
        }
        if ((0, keyboardUtils_1.isHideMenuKey)(event.key)) {
            hideMenu(event);
        }
    }, [hideMenu]);
    return (<StyledMenuList as={rootProps.slots.baseMenuList} id={id} className={(0, clsx_1.default)(gridClasses_1.gridClasses.menuList, className)} aria-labelledby={labelledby} onKeyDown={handleListKeyDown} onWheel={handleMenuScrollCapture} onTouchMove={handleMenuScrollCapture} autoFocus={open} {...other} ref={ref}>
        {children}
      </StyledMenuList>);
});
exports.GridColumnMenuContainer = GridColumnMenuContainer;
GridColumnMenuContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    hideMenu: prop_types_1.default.func.isRequired,
    id: prop_types_1.default.string,
    labelledby: prop_types_1.default.string,
    open: prop_types_1.default.bool.isRequired,
};
