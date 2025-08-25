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
exports.TimeGridEventResizeHandler = void 0;
var React = require("react");
var adapter_1 = require("@atlaskit/pragmatic-drag-and-drop/element/adapter");
var disable_native_drag_preview_1 = require("@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
var TimeGridEventContext_1 = require("../event/TimeGridEventContext");
var drag_utils_1 = require("../../utils/drag-utils");
exports.TimeGridEventResizeHandler = React.forwardRef(function TimeGridEventResizeHandler(componentProps, forwardedRef) {
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Internal props
    side = componentProps.side, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render", "side"]);
    var ref = React.useRef(null);
    var _a = (0, TimeGridEventContext_1.useTimeGridEventContext)(), eventId = _a.eventId, setIsResizing = _a.setIsResizing, eventStart = _a.start, eventEnd = _a.end;
    var props = React.useMemo(function () { return ({}); }, []);
    var state = React.useMemo(function () { return ({ start: side === 'start', end: side === 'end' }); }, [side]);
    React.useEffect(function () {
        var domElement = ref.current;
        if (!domElement) {
            return function () { };
        }
        return (0, adapter_1.draggable)({
            element: domElement,
            getInitialData: function (_a) {
                var input = _a.input;
                return ({
                    source: 'TimeGridEventResizeHandler',
                    id: eventId,
                    start: eventStart,
                    end: eventEnd,
                    side: side,
                    position: (0, drag_utils_1.getCursorPositionRelativeToElement)({ ref: ref, input: input }),
                });
            },
            onGenerateDragPreview: function (_a) {
                var nativeSetDragImage = _a.nativeSetDragImage;
                (0, disable_native_drag_preview_1.disableNativeDragPreview)({ nativeSetDragImage: nativeSetDragImage });
            },
            onDragStart: function () { return setIsResizing(true); },
            onDrop: function () { return setIsResizing(false); },
        });
    }, [eventStart, eventEnd, eventId, side, setIsResizing]);
    return (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        state: state,
        ref: [forwardedRef, ref],
        props: [props, elementProps],
    });
});
