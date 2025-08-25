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
exports.MonthView = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useMergedRefs_1 = require("@base-ui-components/utils/useMergedRefs");
var store_1 = require("@base-ui-components/utils/store");
var useResizeObserver_1 = require("@mui/x-internals/useResizeObserver");
var useDayList_1 = require("../../primitives/use-day-list/useDayList");
var getAdapter_1 = require("../../primitives/utils/adapter/getAdapter");
var useEventCalendarContext_1 = require("../internals/hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../primitives/use-event-calendar");
var useWeekList_1 = require("../../primitives/use-week-list/useWeekList");
var day_grid_1 = require("../../primitives/day-grid");
var event_popover_1 = require("../internals/components/event-popover");
var TranslationsContext_1 = require("../internals/utils/TranslationsContext");
var MonthViewWeekRow_1 = require("./month-view-row/MonthViewWeekRow");
require("./MonthView.css");
var adapter = (0, getAdapter_1.getAdapter)();
var EVENT_HEIGHT = 22;
var CELL_PADDING = 8;
var DAY_NUMBER_HEADER_HEIGHT = 18;
var HIDDEN_EVENTS_HEIGHT = 18;
exports.MonthView = React.memo(React.forwardRef(function MonthView(props, forwardedRef) {
    var className = props.className, other = __rest(props, ["className"]);
    var containerRef = React.useRef(null);
    var handleRef = (0, useMergedRefs_1.useMergedRefs)(forwardedRef, containerRef);
    var cellRef = React.useRef(null);
    var _a = React.useState(4), maxEvents = _a[0], setMaxEvents = _a[1];
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var settings = (0, store_1.useStore)(store, use_event_calendar_1.selectors.settings);
    var visibleDate = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleDate);
    var translations = (0, TranslationsContext_1.useTranslations)();
    var getDayList = (0, useDayList_1.useDayList)();
    var getWeekList = (0, useWeekList_1.useWeekList)();
    var weeks = React.useMemo(function () {
        return getWeekList({
            date: adapter.startOfMonth(visibleDate),
            amount: 'end-of-month',
        });
    }, [getWeekList, visibleDate]);
    (0, useResizeObserver_1.useResizeObserver)(cellRef, function () {
        var cellHeight = cellRef.current.clientHeight;
        var availableHeight = cellHeight - CELL_PADDING - DAY_NUMBER_HEADER_HEIGHT - HIDDEN_EVENTS_HEIGHT;
        var maxEventsCount = Math.floor(availableHeight / EVENT_HEIGHT);
        setMaxEvents(maxEventsCount);
    }, true);
    return (<div ref={handleRef} className={(0, clsx_1.default)('MonthViewContainer', 'mui-x-scheduler', className)} {...other}>
        <event_popover_1.EventPopoverProvider containerRef={containerRef}>
          <day_grid_1.DayGrid.Root className="MonthViewRoot">
            <div className="MonthViewHeader">
              <div className="MonthViewWeekHeaderCell">{translations.weekAbbreviation}</div>
              {getDayList({
            date: weeks[0],
            amount: 'week',
            excludeWeekends: settings.hideWeekends,
        }).map(function (day) { return (<div key={day.toString()} id={"MonthViewHeaderCell-".concat(day.toString())} role="columnheader" className="MonthViewHeaderCell" aria-label={adapter.format(day, 'weekday')}>
                  {adapter.formatByString(day, 'ccc')}
                </div>); })}
            </div>
            <div className="MonthViewBody">
              {weeks.map(function (week, weekIdx) { return (<MonthViewWeekRow_1.default key={weekIdx} maxEvents={maxEvents} week={week} firstDayRef={weekIdx === 0 ? cellRef : undefined}/>); })}
            </div>
          </day_grid_1.DayGrid.Root>
        </event_popover_1.EventPopoverProvider>
      </div>);
}));
