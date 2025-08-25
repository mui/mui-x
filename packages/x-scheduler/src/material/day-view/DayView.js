"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayView = void 0;
var React = require("react");
var store_1 = require("@base-ui-components/utils/store");
var DayTimeGrid_1 = require("../internals/components/day-time-grid/DayTimeGrid");
var useEventCalendarContext_1 = require("../internals/hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../primitives/use-event-calendar");
exports.DayView = React.memo(React.forwardRef(function DayView(props, forwardedRef) {
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var visibleDate = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleDate);
    var days = React.useMemo(function () { return [visibleDate]; }, [visibleDate]);
    return <DayTimeGrid_1.DayTimeGrid ref={forwardedRef} days={days} {...props}/>;
}));
