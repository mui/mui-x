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
exports.DayGridEvent = void 0;
var React = require("react");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
var useEvent_1 = require("../../utils/useEvent");
exports.DayGridEvent = React.forwardRef(function DayGridEvent(componentProps, forwardedRef) {
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Internal props
    start = componentProps.start, end = componentProps.end, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render", "start", "end"]);
    var _a = (0, useEvent_1.useEvent)({ start: start, end: end }), state = _a.state, eventProps = _a.props;
    return (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        state: state,
        ref: [forwardedRef],
        props: [eventProps, elementProps],
    });
});
