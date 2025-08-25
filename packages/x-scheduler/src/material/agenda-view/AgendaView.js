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
exports.AgendaView = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useMergedRefs_1 = require("@base-ui-components/utils/useMergedRefs");
var store_1 = require("@base-ui-components/utils/store");
var getAdapter_1 = require("../../primitives/utils/adapter/getAdapter");
var useDayList_1 = require("../../primitives/use-day-list/useDayList");
var useEventCalendarContext_1 = require("../internals/hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../primitives/use-event-calendar");
var event_popover_1 = require("../internals/components/event-popover");
var DayGridEvent_1 = require("../internals/components/event/day-grid-event/DayGridEvent");
require("./AgendaView.css");
var adapter = (0, getAdapter_1.getAdapter)();
exports.AgendaView = React.memo(React.forwardRef(function AgendaView(props, forwardedRef) {
    var containerRef = React.useRef(null);
    var handleRef = (0, useMergedRefs_1.useMergedRefs)(forwardedRef, containerRef);
    var className = props.className, other = __rest(props, ["className"]);
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var today = adapter.date();
    var visibleDate = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleDate);
    var settings = (0, store_1.useStore)(store, use_event_calendar_1.selectors.settings);
    var getDayList = (0, useDayList_1.useDayList)();
    var days = React.useMemo(function () {
        return getDayList({
            date: visibleDate,
            amount: use_event_calendar_1.AGENDA_VIEW_DAYS_AMOUNT,
            excludeWeekends: settings.hideWeekends,
        });
    }, [getDayList, settings.hideWeekends, visibleDate]);
    var daysWithEvents = (0, store_1.useStore)(store, use_event_calendar_1.selectors.eventsToRenderGroupedByDay, {
        days: days,
        shouldOnlyRenderEventInOneCell: false,
    });
    var resourcesByIdMap = (0, store_1.useStore)(store, use_event_calendar_1.selectors.resourcesByIdMap);
    return (<div ref={handleRef} className={(0, clsx_1.default)('AgendaViewContainer', 'mui-x-scheduler', className)} {...other}>
        <event_popover_1.EventPopoverProvider containerRef={containerRef}>
          {daysWithEvents.map(function (_a) {
            var day = _a.day, events = _a.events, allDayEvents = _a.allDayEvents;
            return (<section className="AgendaViewRow" key={day.toString()} id={"AgendaViewRow-".concat(day.toString())} aria-labelledby={"DayHeaderCell-".concat(day.day.toString())}>
              <header id={"DayHeaderCell-".concat(day.toString())} className={(0, clsx_1.default)('DayHeaderCell', adapter.isSameDay(day, today) && 'Today')} aria-label={"".concat(adapter.format(day, 'weekday'), " ").concat(adapter.format(day, 'dayOfMonth'))}>
                <span className="DayNumberCell">{adapter.format(day, 'dayOfMonth')}</span>
                <div className="WeekDayCell">
                  <span className={(0, clsx_1.default)('AgendaWeekDayNameLabel', 'LinesClamp')}>
                    {adapter.format(day, 'weekday')}
                  </span>
                  <span className={(0, clsx_1.default)('AgendaYearAndMonthLabel', 'LinesClamp')}>
                    {adapter.format(day, 'month')}, {adapter.format(day, 'year')}
                  </span>
                </div>
              </header>
              <ul className="EventsList">
                {allDayEvents.map(function (event) { return (<li>
                    <event_popover_1.EventPopoverTrigger key={event.key} event={event} render={<DayGridEvent_1.DayGridEvent event={event} variant="compact" eventResource={resourcesByIdMap.get(event.resource)} ariaLabelledBy={"DayHeaderCell-".concat(day.toString())}/>}/>
                  </li>); })}
                {events.map(function (event) { return (<li>
                    <event_popover_1.EventPopoverTrigger key={event.key} event={event} render={<DayGridEvent_1.DayGridEvent event={event} variant="compact" eventResource={resourcesByIdMap.get(event.resource)} ariaLabelledBy={"DayHeaderCell-".concat(day.toString())}/>}/>
                  </li>); })}
              </ul>
            </section>);
        })}
        </event_popover_1.EventPopoverProvider>
      </div>);
}));
