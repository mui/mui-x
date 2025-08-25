"use strict";
'use client';
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
exports.TimeGridEvent = void 0;
var React = require("react");
var adapter_1 = require("@atlaskit/pragmatic-drag-and-drop/element/adapter");
var disable_native_drag_preview_1 = require("@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview");
var useButton_1 = require("../../../base-ui-copy/utils/useButton");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
var TimeGridEventCssVars_1 = require("./TimeGridEventCssVars");
var TimeGridColumnContext_1 = require("../column/TimeGridColumnContext");
var useEvent_1 = require("../../utils/useEvent");
var useEventPosition_1 = require("../../utils/useEventPosition");
var drag_utils_1 = require("../../utils/drag-utils");
var TimeGridEventContext_1 = require("./TimeGridEventContext");
exports.TimeGridEvent = React.forwardRef(function TimeGridEvent(componentProps, forwardedRef) {
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Internal props
    start = componentProps.start, end = componentProps.end, eventId = componentProps.eventId, _a = componentProps.isDraggable, isDraggable = _a === void 0 ? false : _a, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render", "start", "end", "eventId", "isDraggable"]);
    // TODO: Expose a real `interactive` prop
    // to control whether the event should behave like a button
    var isInteractive = true;
    var ref = React.useRef(null);
    var _b = React.useState(false), isDragging = _b[0], setIsDragging = _b[1];
    var _c = React.useState(false), isResizing = _c[0], setIsResizing = _c[1];
    var _d = (0, useButton_1.useButton)({ disabled: !isInteractive }), getButtonProps = _d.getButtonProps, buttonRef = _d.buttonRef;
    var _e = (0, TimeGridColumnContext_1.useTimeGridColumnContext)(), columnStart = _e.start, columnEnd = _e.end;
    var _f = (0, useEventPosition_1.useEventPosition)({
        start: start,
        end: end,
        collectionStart: columnStart,
        collectionEnd: columnEnd,
    }), position = _f.position, duration = _f.duration;
    var style = React.useMemo(function () {
        var _a;
        return (_a = {},
            _a[TimeGridEventCssVars_1.TimeGridEventCssVars.yPosition] = "".concat(position * 100, "%"),
            _a[TimeGridEventCssVars_1.TimeGridEventCssVars.height] = "".concat(duration * 100, "%"),
            _a);
    }, [position, duration]);
    var props = React.useMemo(function () { return ({ style: style }); }, [style]);
    var _g = (0, useEvent_1.useEvent)({ start: start, end: end }), eventState = _g.state, eventProps = _g.props;
    var state = React.useMemo(function () { return (__assign(__assign({}, eventState), { dragging: isDragging, resizing: isResizing })); }, [eventState, isDragging, isResizing]);
    var contextValue = React.useMemo(function () { return ({
        eventId: eventId,
        start: start,
        end: end,
        setIsResizing: setIsResizing,
    }); }, [eventId, start, end]);
    React.useEffect(function () {
        if (!isDraggable) {
            return;
        }
        // eslint-disable-next-line consistent-return
        return (0, adapter_1.draggable)({
            element: ref.current,
            getInitialData: function (_a) {
                var input = _a.input;
                return ({
                    type: 'event',
                    source: 'TimeGridEvent',
                    id: eventId,
                    start: start,
                    end: end,
                    position: (0, drag_utils_1.getCursorPositionRelativeToElement)({ ref: ref, input: input }),
                });
            },
            onGenerateDragPreview: function (_a) {
                var nativeSetDragImage = _a.nativeSetDragImage;
                (0, disable_native_drag_preview_1.disableNativeDragPreview)({ nativeSetDragImage: nativeSetDragImage });
            },
            onDragStart: function () { return setIsDragging(true); },
            onDrop: function () { return setIsDragging(false); },
        });
    }, [isDraggable, start, end, eventId]);
    var element = (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        state: state,
        ref: [forwardedRef, buttonRef, ref],
        props: [props, eventProps, elementProps, getButtonProps],
    });
    return (<TimeGridEventContext_1.TimeGridEventContext.Provider value={contextValue}>{element}</TimeGridEventContext_1.TimeGridEventContext.Provider>);
});
