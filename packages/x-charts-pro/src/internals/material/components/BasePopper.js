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
exports.BasePopper = BasePopper;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var Popper_1 = require("@mui/material/Popper");
var Unstable_TrapFocus_1 = require("@mui/material/Unstable_TrapFocus");
var ClickAwayListener_1 = require("@mui/material/ClickAwayListener");
var Grow_1 = require("@mui/material/Grow");
var Paper_1 = require("@mui/material/Paper");
function clickAwayWrapper(props, content) {
    if (props.onClickAway === undefined) {
        return content;
    }
    return ((0, jsx_runtime_1.jsx)(ClickAwayListener_1.default, { onClickAway: props.onClickAway, touchEvent: props.clickAwayTouchEvent, mouseEvent: props.clickAwayMouseEvent, children: content }));
}
function focusTrapWrapper(props, content) {
    if (props.focusTrap === undefined) {
        return content;
    }
    return ((0, jsx_runtime_1.jsx)(Unstable_TrapFocus_1.default, { open: true, disableEnforceFocus: true, disableAutoFocus: true, children: (0, jsx_runtime_1.jsx)("div", { tabIndex: -1, children: content }) }));
}
function wrappers(props, content) {
    return focusTrapWrapper(props, clickAwayWrapper(props, content));
}
var transformOrigin = {
    'bottom-start': 'top left',
    'bottom-end': 'top right',
};
function BasePopper(props) {
    var ref = props.ref, open = props.open, children = props.children, className = props.className, clickAwayTouchEvent = props.clickAwayTouchEvent, clickAwayMouseEvent = props.clickAwayMouseEvent, flip = props.flip, focusTrap = props.focusTrap, onExited = props.onExited, onClickAway = props.onClickAway, onDidShow = props.onDidShow, onDidHide = props.onDidHide, id = props.id, target = props.target, transition = props.transition, placement = props.placement, other = __rest(props, ["ref", "open", "children", "className", "clickAwayTouchEvent", "clickAwayMouseEvent", "flip", "focusTrap", "onExited", "onClickAway", "onDidShow", "onDidHide", "id", "target", "transition", "placement"]);
    var modifiers = React.useMemo(function () {
        var result = [
            {
                name: 'preventOverflow',
                options: {
                    padding: 8,
                },
            },
        ];
        if (flip) {
            result.push({
                name: 'flip',
                enabled: true,
                options: {
                    rootBoundary: 'document',
                },
            });
        }
        if (onDidShow || onDidHide) {
            result.push({
                name: 'isPlaced',
                enabled: true,
                phase: 'main',
                fn: function () {
                    onDidShow === null || onDidShow === void 0 ? void 0 : onDidShow();
                },
                effect: function () { return function () {
                    onDidHide === null || onDidHide === void 0 ? void 0 : onDidHide();
                }; },
            });
        }
        return result;
    }, [flip, onDidShow, onDidHide]);
    var content;
    if (!transition) {
        content = wrappers(props, children);
    }
    else {
        var handleExited_1 = function (popperOnExited) { return function (node) {
            if (popperOnExited) {
                popperOnExited();
            }
            if (onExited) {
                onExited(node);
            }
        }; };
        content = function (p) {
            var _a;
            return wrappers(props, (0, jsx_runtime_1.jsx)(Grow_1.default, __assign({}, p.TransitionProps, { style: { transformOrigin: transformOrigin[p.placement] }, onExited: handleExited_1((_a = p.TransitionProps) === null || _a === void 0 ? void 0 : _a.onExited), children: (0, jsx_runtime_1.jsx)(Paper_1.default, { children: children }) })));
        };
    }
    return ((0, jsx_runtime_1.jsx)(Popper_1.default, __assign({ id: id, className: className, open: open, anchorEl: target, transition: transition, placement: placement, modifiers: modifiers }, other, { children: content })));
}
