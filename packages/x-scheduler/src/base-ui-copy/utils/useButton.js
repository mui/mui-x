"use strict";
/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-returns-type */
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
exports.useButton = useButton;
var React = require("react");
var useIsoLayoutEffect_1 = require("@base-ui-components/utils/useIsoLayoutEffect");
var merge_props_1 = require("@base-ui-components/react/merge-props");
var useEventCallback_1 = require("@base-ui-components/utils/useEventCallback");
var useMergedRefs_1 = require("@base-ui-components/utils/useMergedRefs");
var useRootElementName_1 = require("./useRootElementName");
var CompositeRootContext_1 = require("../composite/CompositeRootContext");
var BUTTON_TYPES = new Set(['button', 'submit', 'reset']);
function useButton(parameters) {
    if (parameters === void 0) { parameters = {}; }
    var externalRef = parameters.buttonRef, _a = parameters.disabled, disabled = _a === void 0 ? false : _a, focusableWhenDisabled = parameters.focusableWhenDisabled, _b = parameters.tabIndex, tabIndex = _b === void 0 ? 0 : _b, _c = parameters.type, type = _c === void 0 ? 'button' : _c, elementNameProp = parameters.elementName;
    var buttonRef = React.useRef(null);
    var _d = (0, useRootElementName_1.useRootElementName)({
        rootElementName: elementNameProp,
    }), elementName = _d.rootElementName, updateRootElementName = _d.updateRootElementName;
    var isCompositeItem = (0, CompositeRootContext_1.useCompositeRootContext)(true) !== undefined;
    var isNativeButton = (0, useEventCallback_1.useEventCallback)(function () {
        var element = buttonRef.current;
        return (elementName === 'BUTTON' ||
            (elementName === 'INPUT' && BUTTON_TYPES.has(element === null || element === void 0 ? void 0 : element.type)));
    });
    var isValidLink = (0, useEventCallback_1.useEventCallback)(function () {
        var element = buttonRef.current;
        return Boolean(elementName === 'A' && (element === null || element === void 0 ? void 0 : element.href));
    });
    var mergedRef = (0, useMergedRefs_1.useMergedRefs)(updateRootElementName, externalRef, buttonRef);
    var buttonProps = React.useMemo(function () {
        var additionalProps = {};
        if (tabIndex !== undefined && !isCompositeItem) {
            additionalProps.tabIndex = tabIndex;
        }
        if (elementName === 'BUTTON' || elementName === 'INPUT') {
            if (focusableWhenDisabled || isCompositeItem) {
                additionalProps['aria-disabled'] = disabled;
            }
            else if (!isCompositeItem) {
                additionalProps.disabled = disabled;
            }
        }
        else if (elementName !== '') {
            if (elementName !== 'A') {
                additionalProps.role = 'button';
                if (!isCompositeItem) {
                    additionalProps.tabIndex = tabIndex !== null && tabIndex !== void 0 ? tabIndex : 0;
                }
            }
            else if (tabIndex && !isCompositeItem) {
                additionalProps.tabIndex = tabIndex;
            }
            if (disabled) {
                additionalProps['aria-disabled'] = disabled;
                if (!isCompositeItem) {
                    additionalProps.tabIndex = focusableWhenDisabled ? (tabIndex !== null && tabIndex !== void 0 ? tabIndex : 0) : -1;
                }
            }
        }
        return additionalProps;
    }, [disabled, elementName, focusableWhenDisabled, isCompositeItem, tabIndex]);
    // handles a disabled composite button rendering another button, e.g.
    // <Toolbar.Button disabled render={<Menu.Trigger />} />
    // the `disabled` prop needs to pass through 2 `useButton`s then finally
    // delete the `disabled` attribute from DOM
    (0, useIsoLayoutEffect_1.useIsoLayoutEffect)(function () {
        var element = buttonRef.current;
        if (!(element instanceof HTMLButtonElement)) {
            return;
        }
        if (isCompositeItem && disabled && buttonProps.disabled === undefined && element.disabled) {
            element.disabled = false;
        }
    }, [disabled, buttonProps.disabled, isCompositeItem]);
    var getButtonProps = React.useCallback(function (externalProps) {
        if (externalProps === void 0) { externalProps = {}; }
        var externalOnClick = externalProps.onClick, externalOnMouseDown = externalProps.onMouseDown, externalOnKeyUp = externalProps.onKeyUp, externalOnKeyDown = externalProps.onKeyDown, externalOnPointerDown = externalProps.onPointerDown, otherExternalProps = __rest(externalProps, ["onClick", "onMouseDown", "onKeyUp", "onKeyDown", "onPointerDown"]);
        return (0, merge_props_1.mergeProps)({
            type: elementName === 'BUTTON' || elementName === 'INPUT' ? type : undefined,
            onClick: function (event) {
                if (disabled) {
                    event.preventDefault();
                    return;
                }
                externalOnClick === null || externalOnClick === void 0 ? void 0 : externalOnClick(event);
            },
            onMouseDown: function (event) {
                if (!disabled) {
                    externalOnMouseDown === null || externalOnMouseDown === void 0 ? void 0 : externalOnMouseDown(event);
                }
            },
            onKeyDown: function (event) {
                if (
                // allow Tabbing away from focusableWhenDisabled buttons
                (disabled && focusableWhenDisabled && event.key !== 'Tab') ||
                    (event.target === event.currentTarget && !isNativeButton() && event.key === ' ')) {
                    event.preventDefault();
                }
                if (!disabled) {
                    (0, merge_props_1.makeEventPreventable)(event);
                    externalOnKeyDown === null || externalOnKeyDown === void 0 ? void 0 : externalOnKeyDown(event);
                }
                if (event.baseUIHandlerPrevented) {
                    return;
                }
                // Keyboard accessibility for non interactive elements
                if (event.target === event.currentTarget &&
                    !isNativeButton() &&
                    !isValidLink() &&
                    event.key === 'Enter' &&
                    !disabled) {
                    externalOnClick === null || externalOnClick === void 0 ? void 0 : externalOnClick(event);
                    event.preventDefault();
                }
            },
            onKeyUp: function (event) {
                // calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
                // https://codesandbox.io/p/sandbox/button-keyup-preventdefault-dn7f0
                // Keyboard accessibility for non interactive elements
                if (!disabled) {
                    (0, merge_props_1.makeEventPreventable)(event);
                    externalOnKeyUp === null || externalOnKeyUp === void 0 ? void 0 : externalOnKeyUp(event);
                }
                if (event.baseUIHandlerPrevented) {
                    return;
                }
                if (event.target === event.currentTarget &&
                    !isNativeButton() &&
                    !disabled &&
                    event.key === ' ') {
                    externalOnClick === null || externalOnClick === void 0 ? void 0 : externalOnClick(event);
                }
            },
            onPointerDown: function (event) {
                if (disabled) {
                    event.preventDefault();
                    return;
                }
                externalOnPointerDown === null || externalOnPointerDown === void 0 ? void 0 : externalOnPointerDown(event);
            },
            ref: mergedRef,
        }, buttonProps, otherExternalProps);
    }, [
        buttonProps,
        disabled,
        elementName,
        focusableWhenDisabled,
        isNativeButton,
        isValidLink,
        mergedRef,
        type,
    ]);
    return {
        getButtonProps: getButtonProps,
        buttonRef: mergedRef,
    };
}
