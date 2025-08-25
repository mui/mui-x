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
exports.TimelineEvent = void 0;
var React = require("react");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
var useButton_1 = require("../../../base-ui-copy/utils/useButton");
var TimelineEventRowContext_1 = require("../event-row/TimelineEventRowContext");
var useEvent_1 = require("../../utils/useEvent");
var TimelineEventCssVars_1 = require("./TimelineEventCssVars");
var useEventPosition_1 = require("../../utils/useEventPosition");
exports.TimelineEvent = React.forwardRef(function TimelineEvent(componentProps, forwardedRef) {
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Internal props
    start = componentProps.start, end = componentProps.end, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render", "start", "end"]);
    // TODO: Expose a real `interactive` prop
    // to control whether the event should behave like a button
    var isInteractive = true;
    var _a = (0, useButton_1.useButton)({ disabled: !isInteractive }), getButtonProps = _a.getButtonProps, buttonRef = _a.buttonRef;
    var _b = (0, TimelineEventRowContext_1.useTimelineEventRowContext)(), rowStart = _b.start, rowEnd = _b.end;
    var _c = (0, useEventPosition_1.useEventPosition)({
        start: start,
        end: end,
        collectionStart: rowStart,
        collectionEnd: rowEnd,
    }), position = _c.position, duration = _c.duration;
    var style = React.useMemo(function () {
        var _a;
        return (_a = {},
            _a[TimelineEventCssVars_1.TimelineEventCssVars.xPosition] = "".concat(position * 100, "%"),
            _a[TimelineEventCssVars_1.TimelineEventCssVars.width] = "".concat(duration * 100, "%"),
            _a);
    }, [position, duration]);
    var props = React.useMemo(function () { return ({ style: style }); }, [style]);
    var _d = (0, useEvent_1.useEvent)({ start: start, end: end }), state = _d.state, eventProps = _d.props;
    return (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        state: state,
        ref: [forwardedRef, buttonRef],
        props: [props, eventProps, elementProps, getButtonProps],
    });
});
