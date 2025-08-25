"use strict";
'use client';
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridMenu = GridMenu;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var HTMLElementType_1 = require("@mui/utils/HTMLElementType");
var styles_1 = require("@mui/material/styles");
var keyboardUtils_1 = require("../../utils/keyboardUtils");
var cssVariables_1 = require("../../constants/cssVariables");
var context_1 = require("../../utils/css/context");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var assert_1 = require("../../utils/assert");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['menu'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridMenuRoot = (0, styles_1.styled)((assert_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'Menu',
})((_a = {
        zIndex: cssVariables_1.vars.zIndex.menu
    },
    _a["& .".concat(gridClasses_1.gridClasses.menuList)] = {
        outline: 0,
    },
    _a));
function GridMenu(props) {
    var _a;
    var open = props.open, target = props.target, onClose = props.onClose, children = props.children, position = props.position, className = props.className, onExited = props.onExited, other = __rest(props, ["open", "target", "onClose", "children", "position", "className", "onExited"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var variablesClass = (0, context_1.useCSSVariablesClass)();
    var savedFocusRef = React.useRef(null);
    (0, useEnhancedEffect_1.default)(function () {
        var _a, _b;
        if (open) {
            savedFocusRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }
        else {
            (_b = (_a = savedFocusRef.current) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
            savedFocusRef.current = null;
        }
    }, [open]);
    React.useEffect(function () {
        // Emit menuOpen or menuClose events
        var eventName = open ? 'menuOpen' : 'menuClose';
        apiRef.current.publishEvent(eventName, { target: target });
    }, [apiRef, open, target]);
    var handleClickAway = function (event) {
        if (event.target && (target === event.target || (target === null || target === void 0 ? void 0 : target.contains(event.target)))) {
            return;
        }
        onClose(event);
    };
    var handleKeyDown = function (event) {
        if ((0, keyboardUtils_1.isHideMenuKey)(event.key)) {
            onClose(event);
        }
    };
    return (<GridMenuRoot as={rootProps.slots.basePopper} className={(0, clsx_1.default)(classes.root, className, variablesClass)} ownerState={rootProps} open={open} target={target} transition placement={position} onClickAway={handleClickAway} onExited={onExited} clickAwayMouseEvent="onMouseDown" onKeyDown={handleKeyDown} {...other} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.basePopper}>
      {children}
    </GridMenuRoot>);
}
GridMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    className: prop_types_1.default.string,
    onClose: prop_types_1.default.func.isRequired,
    onExited: prop_types_1.default.func,
    open: prop_types_1.default.bool.isRequired,
    position: prop_types_1.default.oneOf([
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
    ]),
    target: HTMLElementType_1.default,
};
