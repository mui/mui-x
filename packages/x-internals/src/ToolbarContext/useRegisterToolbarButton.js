"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegisterToolbarButton = useRegisterToolbarButton;
var React = require("react");
var useId_1 = require("@mui/utils/useId");
var ToolbarContext_1 = require("./ToolbarContext");
function useRegisterToolbarButton(props, ref) {
    var onKeyDown = props.onKeyDown, onFocus = props.onFocus, disabled = props.disabled, ariaDisabled = props["aria-disabled"];
    var id = (0, useId_1.default)();
    var _a = (0, ToolbarContext_1.useToolbarContext)(), focusableItemId = _a.focusableItemId, registerItem = _a.registerItem, unregisterItem = _a.unregisterItem, onItemKeyDown = _a.onItemKeyDown, onItemFocus = _a.onItemFocus, onItemDisabled = _a.onItemDisabled;
    var handleKeyDown = function (event) {
        onItemKeyDown(event);
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
    };
    var handleFocus = function (event) {
        onItemFocus(id);
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(event);
    };
    React.useEffect(function () {
        registerItem(id, ref);
        return function () { return unregisterItem(id); };
    }, [id, ref, registerItem, unregisterItem]);
    var previousDisabled = React.useRef(disabled);
    React.useEffect(function () {
        if (previousDisabled.current !== disabled && disabled === true) {
            onItemDisabled(id, disabled);
        }
        previousDisabled.current = disabled;
    }, [disabled, id, onItemDisabled]);
    var previousAriaDisabled = React.useRef(ariaDisabled);
    React.useEffect(function () {
        if (previousAriaDisabled.current !== ariaDisabled && ariaDisabled === true) {
            onItemDisabled(id, true);
        }
        previousAriaDisabled.current = ariaDisabled;
    }, [ariaDisabled, id, onItemDisabled]);
    return {
        tabIndex: focusableItemId === id ? 0 : -1,
        disabled: disabled,
        'aria-disabled': ariaDisabled,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
    };
}
