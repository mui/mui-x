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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsMenu = ChartsMenu;
var React = require("react");
var prop_types_1 = require("prop-types");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var HTMLElementType_1 = require("@mui/utils/HTMLElementType");
var internals_1 = require("@mui/x-charts/internals");
function ChartsMenu(props) {
    var open = props.open, target = props.target, onClose = props.onClose, children = props.children, position = props.position, className = props.className, onExited = props.onExited, other = __rest(props, ["open", "target", "onClose", "children", "position", "className", "onExited"]);
    var _a = (0, internals_1.useChartsSlots)(), slots = _a.slots, slotProps = _a.slotProps;
    var Popper = slots.basePopper;
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
    var handleClickAway = function (event) {
        if (event.target && (target === event.target || (target === null || target === void 0 ? void 0 : target.contains(event.target)))) {
            return;
        }
        onClose(event);
    };
    return (<Popper open={open} target={target} transition placement={position} onClickAway={handleClickAway} onExited={onExited} clickAwayMouseEvent="onMouseDown" {...other} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.basePopper}>
      {children}
    </Popper>);
}
ChartsMenu.propTypes = {
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
