"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekView = void 0;
var React = require("react");
var store_1 = require("@base-ui-components/utils/store");
var useDayList_1 = require("../../primitives/use-day-list/useDayList");
var getAdapter_1 = require("../../primitives/utils/adapter/getAdapter");
var DayTimeGrid_1 = require("../internals/components/day-time-grid/DayTimeGrid");
var useEventCalendarContext_1 = require("../internals/hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../primitives/use-event-calendar");
var adapter = (0, getAdapter_1.getAdapter)();
exports.WeekView = React.memo(React.forwardRef(function WeekView(props, forwardedRef) {
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var visibleDate = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleDate);
    var settings = (0, store_1.useStore)(store, use_event_calendar_1.selectors.settings);
    var getDayList = (0, useDayList_1.useDayList)();
    var days = React.useMemo(function () {
        return getDayList({
            date: adapter.startOfWeek(visibleDate),
            amount: 'week',
            excludeWeekends: settings.hideWeekends,
        });
    }, [getDayList, visibleDate, settings.hideWeekends]);
    return <DayTimeGrid_1.DayTimeGrid ref={forwardedRef} days={days} {...props}/>;
}));
