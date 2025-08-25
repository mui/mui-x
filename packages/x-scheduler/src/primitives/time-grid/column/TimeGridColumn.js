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
exports.TimeGridColumn = void 0;
var React = require("react");
var adapter_1 = require("@atlaskit/pragmatic-drag-and-drop/element/adapter");
var useRenderElement_1 = require("../../../base-ui-copy/utils/useRenderElement");
var TimeGridColumnContext_1 = require("./TimeGridColumnContext");
var TimeGridColumnPlaceholderContext_1 = require("./TimeGridColumnPlaceholderContext");
var useAdapter_1 = require("../../utils/adapter/useAdapter");
var TimeGridRootContext_1 = require("../root/TimeGridRootContext");
var drag_utils_1 = require("../../utils/drag-utils");
exports.TimeGridColumn = React.forwardRef(function TimeGridColumn(componentProps, forwardedRef) {
    var adapter = (0, useAdapter_1.useAdapter)();
    var 
    // Rendering props
    className = componentProps.className, render = componentProps.render, 
    // Internal props
    start = componentProps.start, end = componentProps.end, _a = componentProps.columnId, columnId = _a === void 0 ? null : _a, 
    // Props forwarded to the DOM element
    elementProps = __rest(componentProps, ["className", "render", "start", "end", "columnId"]);
    var ref = React.useRef(null);
    var _b = (0, TimeGridRootContext_1.useTimeGridRootContext)(), onEventChange = _b.onEventChange, setPlaceholder = _b.setPlaceholder, placeholder = _b.placeholder;
    var columnPlaceholder = React.useMemo(function () {
        if (placeholder == null) {
            return null;
        }
        if (adapter.isBefore(placeholder.start, start) || adapter.isAfter(placeholder.end, end)) {
            return null;
        }
        return placeholder;
    }, [adapter, start, end, placeholder]);
    var contextValue = React.useMemo(function () { return ({
        start: start,
        end: end,
    }); }, [start, end]);
    var placeholderContextValue = React.useMemo(function () { return ({
        placeholder: columnPlaceholder,
    }); }, [columnPlaceholder]);
    var props = React.useMemo(function () { return ({ role: 'gridcell' }); }, []);
    var element = (0, useRenderElement_1.useRenderElement)('div', componentProps, {
        ref: [forwardedRef, ref],
        props: [props, elementProps],
    });
    React.useEffect(function () {
        var domElement = ref.current;
        if (!domElement) {
            return function () { };
        }
        function getEventDropData(_a) {
            var data = _a.data, input = _a.input;
            var position = (0, drag_utils_1.getCursorPositionRelativeToElement)({ ref: ref, input: input });
            // Move event
            if ((0, drag_utils_1.isDraggingTimeGridEvent)(data)) {
                var cursorPositionPx = position.y - data.position.y;
                // TODO: Avoid JS Date conversion
                var eventDuration = (adapter.toJsDate(data.end).getTime() - adapter.toJsDate(data.start).getTime()) /
                    (60 * 1000);
                var newStartDate = (0, drag_utils_1.createDateFromPositionInCollection)({
                    adapter: adapter,
                    collectionStart: start,
                    collectionEnd: end,
                    position: cursorPositionPx / domElement.offsetHeight,
                });
                var newEndDate = adapter.addMinutes(newStartDate, eventDuration);
                return { start: newStartDate, end: newEndDate, eventId: data.id, columnId: columnId };
            }
            // Resize event
            if ((0, drag_utils_1.isDraggingTimeGridEventResizeHandler)(data)) {
                var cursorPositionPx = position.y - data.position.y;
                var cursorDate = (0, drag_utils_1.createDateFromPositionInCollection)({
                    adapter: adapter,
                    collectionStart: start,
                    collectionEnd: end,
                    position: cursorPositionPx / domElement.offsetHeight,
                });
                if (data.side === 'start') {
                    var maxStartDate = adapter.addMinutes(data.end, -drag_utils_1.EVENT_DRAG_PRECISION_MINUTE);
                    // Ensure the new start date is not after or too close to the end date.
                    var newStartDate = adapter.isBefore(cursorDate, maxStartDate)
                        ? cursorDate
                        : maxStartDate;
                    return {
                        start: newStartDate,
                        end: data.end,
                        eventId: data.id,
                        columnId: columnId,
                    };
                }
                var minEndDate = adapter.addMinutes(data.start, drag_utils_1.EVENT_DRAG_PRECISION_MINUTE);
                // Ensure the new end date is not before or too close to the start date.
                var newEndDate = adapter.isAfter(cursorDate, minEndDate) ? cursorDate : minEndDate;
                return {
                    start: data.start,
                    end: newEndDate,
                    eventId: data.id,
                    columnId: columnId,
                };
            }
            return undefined;
        }
        return (0, adapter_1.dropTargetForElements)({
            element: domElement,
            canDrop: function (arg) {
                return (0, drag_utils_1.isDraggingTimeGridEvent)(arg.source.data) ||
                    (0, drag_utils_1.isDraggingTimeGridEventResizeHandler)(arg.source.data);
            },
            onDrag: function (_a) {
                var data = _a.source.data, location = _a.location;
                var newPlaceholder = getEventDropData({
                    data: data,
                    input: location.current.input,
                });
                if (newPlaceholder) {
                    setPlaceholder(newPlaceholder);
                }
            },
            onDragStart: function (_a) {
                var data = _a.source.data;
                if ((0, drag_utils_1.isDraggingTimeGridEvent)(data) || (0, drag_utils_1.isDraggingTimeGridEventResizeHandler)(data)) {
                    setPlaceholder({ eventId: data.id, start: data.start, end: data.end, columnId: columnId });
                }
            },
            onDrop: function (_a) {
                var data = _a.source.data, location = _a.location;
                var newEvent = getEventDropData({
                    data: data,
                    input: location.current.input,
                });
                if (newEvent) {
                    onEventChange(newEvent);
                    setPlaceholder(null);
                }
            },
        });
    }, [adapter, onEventChange, setPlaceholder, start, end, columnId]);
    return (<TimeGridColumnContext_1.TimeGridColumnContext.Provider value={contextValue}>
      <TimeGridColumnPlaceholderContext_1.TimeGridColumnPlaceholderContext.Provider value={placeholderContextValue}>
        {element}
      </TimeGridColumnPlaceholderContext_1.TimeGridColumnPlaceholderContext.Provider>
    </TimeGridColumnContext_1.TimeGridColumnContext.Provider>);
});
