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
exports.TimeGridRoot = void 0;
var React = require("react");
var useEventCallback_1 = require("@base-ui-components/utils/useEventCallback");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
var TimeGridRootContext_1 = require("./TimeGridRootContext");
var useAdapter_1 = require("../../utils/adapter/useAdapter");
exports.TimeGridRoot = React.forwardRef(function TimeGridRoot(componentProps, forwardedRef) {
    var adapter = (0, useAdapter_1.useAdapter)();
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Internal props
    onEventChangeProp = componentProps.onEventChange, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render", "onEventChange"]);
    var _a = React.useState(null), placeholder = _a[0], setPlaceholder = _a[1];
    var handlePlaceholderChange = (0, useEventCallback_1.useEventCallback)(function (newPlaceholder) {
        if (newPlaceholder != null &&
            placeholder != null &&
            adapter.isEqual(newPlaceholder.start, placeholder.start) &&
            adapter.isEqual(newPlaceholder.end, placeholder.end) &&
            placeholder.eventId === newPlaceholder.eventId &&
            placeholder.columnId === newPlaceholder.columnId) {
            return;
        }
        setPlaceholder(newPlaceholder);
    });
    var props = React.useMemo(function () { return ({ role: 'grid' }); }, []);
    var state = React.useMemo(function () { return ({}); }, []);
    var element = (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        state: state,
        ref: [forwardedRef],
        props: [props, elementProps],
    });
    var onEventChange = (0, useEventCallback_1.useEventCallback)(onEventChangeProp);
    var contextValue = React.useMemo(function () { return ({ onEventChange: onEventChange, placeholder: placeholder, setPlaceholder: handlePlaceholderChange }); }, [onEventChange, placeholder, handlePlaceholderChange]);
    return (<TimeGridRootContext_1.TimeGridRootContext.Provider value={contextValue}>{element}</TimeGridRootContext_1.TimeGridRootContext.Provider>);
});
