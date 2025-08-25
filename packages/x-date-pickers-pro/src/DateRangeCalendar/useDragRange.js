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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDragRange = void 0;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var date_utils_1 = require("../internals/utils/date-utils");
var resolveDateFromTarget = function (target, adapter, timezone) {
    var timestampString = target.dataset.timestamp;
    if (!timestampString) {
        return null;
    }
    var timestamp = +timestampString;
    return adapter.date(new Date(timestamp).toISOString(), timezone);
};
var isSameAsDraggingDate = function (event) {
    var timestampString = event.target.dataset.timestamp;
    return timestampString === event.dataTransfer.getData('draggingDate');
};
var resolveButtonElement = function (element) {
    if (element) {
        if (element instanceof HTMLButtonElement && !element.disabled) {
            return element;
        }
        if (element.children.length) {
            return resolveButtonElement(element.children[0]);
        }
        return null;
    }
    return element;
};
var resolveElementFromTouch = function (event, ignoreTouchTarget) {
    var _a;
    // don't parse multi-touch result
    if (((_a = event.changedTouches) === null || _a === void 0 ? void 0 : _a.length) === 1 && event.touches.length <= 1) {
        var element = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        // `elementFromPoint` could have resolved preview div or wrapping div
        // might need to recursively find the nested button
        var buttonElement = resolveButtonElement(element);
        if (ignoreTouchTarget && buttonElement === event.changedTouches[0].target) {
            return null;
        }
        return buttonElement;
    }
    return null;
};
var useDragRangeEvents = function (_a) {
    var adapter = _a.adapter, setRangeDragDay = _a.setRangeDragDay, setIsDragging = _a.setIsDragging, isDragging = _a.isDragging, onDatePositionChange = _a.onDatePositionChange, onDrop = _a.onDrop, disableDragEditing = _a.disableDragEditing, dateRange = _a.dateRange, timezone = _a.timezone;
    var emptyDragImgRef = React.useRef(null);
    React.useEffect(function () {
        // Preload the image - required for Safari support: https://stackoverflow.com/a/40923520/3303436
        emptyDragImgRef.current = document.createElement('img');
        emptyDragImgRef.current.src =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }, []);
    var isElementDraggable = function (day) {
        if (day == null) {
            return false;
        }
        var shouldInitDragging = !disableDragEditing && !!dateRange[0] && !!dateRange[1];
        var isSelectedStartDate = (0, date_utils_1.isStartOfRange)(adapter, day, dateRange);
        var isSelectedEndDate = (0, date_utils_1.isEndOfRange)(adapter, day, dateRange);
        return shouldInitDragging && (isSelectedStartDate || isSelectedEndDate);
    };
    var handleDragStart = (0, useEventCallback_1.default)(function (event) {
        var newDate = resolveDateFromTarget(event.target, adapter, timezone);
        if (!isElementDraggable(newDate)) {
            return;
        }
        event.stopPropagation();
        if (emptyDragImgRef.current) {
            event.dataTransfer.setDragImage(emptyDragImgRef.current, 0, 0);
        }
        setRangeDragDay(newDate);
        event.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
        var buttonDataset = event.target.dataset;
        if (buttonDataset.timestamp) {
            event.dataTransfer.setData('draggingDate', buttonDataset.timestamp);
        }
        if (buttonDataset.position) {
            onDatePositionChange(buttonDataset.position);
        }
    });
    var handleTouchStart = (0, useEventCallback_1.default)(function (event) {
        var target = resolveElementFromTouch(event);
        if (!target) {
            return;
        }
        var newDate = resolveDateFromTarget(target, adapter, timezone);
        if (!isElementDraggable(newDate)) {
            return;
        }
        setRangeDragDay(newDate);
    });
    var handleDragEnter = (0, useEventCallback_1.default)(function (event) {
        if (!isDragging) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        setRangeDragDay(resolveDateFromTarget(event.target, adapter, timezone));
    });
    var handleTouchMove = (0, useEventCallback_1.default)(function (event) {
        var target = resolveElementFromTouch(event);
        if (!target) {
            return;
        }
        var newDate = resolveDateFromTarget(target, adapter, timezone);
        if (newDate) {
            setRangeDragDay(newDate);
        }
        // this prevents initiating drag when user starts touchmove outside and then moves over a draggable element
        var targetsAreIdentical = target === event.changedTouches[0].target;
        if (!targetsAreIdentical || !isElementDraggable(newDate)) {
            return;
        }
        // on mobile we should only initialize dragging state after move is detected
        setIsDragging(true);
        var button = event.target;
        var buttonDataset = button.dataset;
        if (buttonDataset.position) {
            onDatePositionChange(buttonDataset.position);
        }
    });
    var handleDragLeave = (0, useEventCallback_1.default)(function (event) {
        if (!isDragging) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    });
    var handleDragOver = (0, useEventCallback_1.default)(function (event) {
        if (!isDragging) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
    });
    var handleTouchEnd = (0, useEventCallback_1.default)(function (event) {
        if (!isDragging) {
            return;
        }
        setRangeDragDay(null);
        setIsDragging(false);
        var target = resolveElementFromTouch(event, true);
        if (!target) {
            return;
        }
        // make sure the focused element is the element where touch ended
        target.focus();
        var newDate = resolveDateFromTarget(target, adapter, timezone);
        if (newDate) {
            onDrop(newDate);
        }
    });
    var handleDragEnd = (0, useEventCallback_1.default)(function (event) {
        if (!isDragging) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        setRangeDragDay(null);
    });
    var handleDrop = (0, useEventCallback_1.default)(function (event) {
        if (!isDragging) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        setRangeDragDay(null);
        // make sure the focused element is the element where drop ended
        event.currentTarget.focus();
        if (isSameAsDraggingDate(event)) {
            return;
        }
        var newDate = resolveDateFromTarget(event.target, adapter, timezone);
        if (newDate) {
            onDrop(newDate);
        }
    });
    return {
        onDragStart: handleDragStart,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDragEnd: handleDragEnd,
        onDrop: handleDrop,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
    };
};
var useDragRange = function (_a) {
    var disableDragEditing = _a.disableDragEditing, adapter = _a.adapter, onDatePositionChange = _a.onDatePositionChange, onDrop = _a.onDrop, dateRange = _a.dateRange, timezone = _a.timezone;
    var _b = React.useState(false), isDragging = _b[0], setIsDragging = _b[1];
    var _c = React.useState(null), rangeDragDay = _c[0], setRangeDragDay = _c[1];
    var handleRangeDragDayChange = (0, useEventCallback_1.default)(function (newValue) {
        if (!adapter.isEqual(newValue, rangeDragDay)) {
            setRangeDragDay(newValue);
        }
    });
    var draggingDatePosition = React.useMemo(function () {
        var start = dateRange[0], end = dateRange[1];
        if (rangeDragDay) {
            if (start && adapter.isBefore(rangeDragDay, start)) {
                return 'start';
            }
            if (end && adapter.isAfter(rangeDragDay, end)) {
                return 'end';
            }
        }
        return null;
    }, [dateRange, rangeDragDay, adapter]);
    var dragRangeEvents = useDragRangeEvents({
        adapter: adapter,
        onDatePositionChange: onDatePositionChange,
        onDrop: onDrop,
        setIsDragging: setIsDragging,
        isDragging: isDragging,
        setRangeDragDay: handleRangeDragDayChange,
        disableDragEditing: disableDragEditing,
        dateRange: dateRange,
        timezone: timezone,
    });
    return React.useMemo(function () { return (__assign({ isDragging: isDragging, rangeDragDay: rangeDragDay, draggingDatePosition: draggingDatePosition }, (!disableDragEditing ? dragRangeEvents : {}))); }, [isDragging, rangeDragDay, draggingDatePosition, disableDragEditing, dragRangeEvents]);
};
exports.useDragRange = useDragRange;
