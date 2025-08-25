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
exports.DayTimeGrid = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useMergedRefs_1 = require("@base-ui-components/utils/useMergedRefs");
var useIsoLayoutEffect_1 = require("@base-ui-components/utils/useIsoLayoutEffect");
var store_1 = require("@base-ui-components/utils/store");
var event_utils_1 = require("../../../../primitives/utils/event-utils");
var getAdapter_1 = require("../../../../primitives/utils/adapter/getAdapter");
var time_grid_1 = require("../../../../primitives/time-grid");
var day_grid_1 = require("../../../../primitives/day-grid");
var TimeGridEvent_1 = require("../event/time-grid-event/TimeGridEvent");
var date_utils_1 = require("../../../../primitives/utils/date-utils");
var TranslationsContext_1 = require("../../utils/TranslationsContext");
var useEventCalendarContext_1 = require("../../hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../../../primitives/use-event-calendar");
var event_popover_1 = require("../event-popover");
require("./DayTimeGrid.css");
var event_1 = require("../event");
var adapter = (0, getAdapter_1.getAdapter)();
exports.DayTimeGrid = React.forwardRef(function DayTimeGrid(props, forwardedRef) {
    var days = props.days, className = props.className, other = __rest(props, ["days", "className"]);
    var translations = (0, TranslationsContext_1.useTranslations)();
    var today = adapter.date();
    var bodyRef = React.useRef(null);
    var allDayHeaderWrapperRef = React.useRef(null);
    var containerRef = React.useRef(null);
    var handleRef = (0, useMergedRefs_1.useMergedRefs)(forwardedRef, containerRef);
    var _a = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _a.store, instance = _a.instance;
    var resourcesByIdMap = (0, store_1.useStore)(store, use_event_calendar_1.selectors.resourcesByIdMap);
    var visibleDate = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleDate);
    var hasDayView = (0, store_1.useStore)(store, use_event_calendar_1.selectors.hasDayView);
    var daysWithEvents = (0, store_1.useStore)(store, use_event_calendar_1.selectors.eventsToRenderGroupedByDay, {
        days: days,
        shouldOnlyRenderEventInOneCell: false,
    });
    var ampm = (0, store_1.useStore)(store, use_event_calendar_1.selectors.ampm);
    var handleEventChangeFromPrimitive = React.useCallback(function (data) {
        var updatedEvent = __assign(__assign({}, use_event_calendar_1.selectors.getEventById(store.state, data.eventId)), { start: data.start, end: data.end });
        instance.updateEvent(updatedEvent);
    }, [instance, store]);
    (0, useIsoLayoutEffect_1.useIsoLayoutEffect)(function () {
        var body = bodyRef.current;
        var allDayHeader = allDayHeaderWrapperRef.current;
        if (!body || !allDayHeader) {
            return;
        }
        var hasScroll = body.scrollHeight > body.clientHeight;
        allDayHeader.style.setProperty('--has-scroll', hasScroll ? '1' : '0');
    }, [daysWithEvents]);
    var lastIsWeekend = (0, date_utils_1.isWeekend)(adapter, days[days.length - 1]);
    var renderHeaderContent = function (day) { return (<span className="DayTimeGridHeaderContent">
      {/* TODO: Add the 3 letter week day format to the adapter */}
      <span className="DayTimeGridHeaderDayName">{adapter.formatByString(day, 'ccc')}</span>
      <span className={(0, clsx_1.default)('DayTimeGridHeaderDayNumber', adapter.isSameDay(day, today) && 'Today')}>
        {adapter.format(day, 'dayOfMonth')}
      </span>
    </span>); };
    return (<div ref={handleRef} className={(0, clsx_1.default)('DayTimeGridContainer', 'mui-x-scheduler', className)} {...other}>
      <event_popover_1.EventPopoverProvider containerRef={containerRef}>
        <div className="DayTimeGridHeader">
          <div className="DayTimeGridGridRow DayTimeGridHeaderRow" role="row">
            <div className="DayTimeGridAllDayEventsCell"/>
            {daysWithEvents.map(function (_a) {
            var day = _a.day;
            return (<div key={day.toString()} id={"DayTimeGridHeaderCell-".concat(day.toString())} role="columnheader" aria-label={"".concat(adapter.format(day, 'weekday'), " ").concat(adapter.format(day, 'dayOfMonth'))}>
                {hasDayView ? (<button type="button" className="DayTimeGridHeaderButton" onClick={function (event) { return instance.switchToDay(day, event); }} tabIndex={0}>
                    {renderHeaderContent(day)}
                  </button>) : (renderHeaderContent(day))}
              </div>);
        })}
          </div>
        </div>
        <day_grid_1.DayGrid.Root ref={allDayHeaderWrapperRef} className={(0, clsx_1.default)('DayTimeGridGridRow', 'DayTimeGridAllDayEventsGrid')} data-weekend={lastIsWeekend ? '' : undefined}>
          <div className="DayTimeGridAllDayEventsCell DayTimeGridAllDayEventsHeaderCell" id="DayTimeGridAllDayEventsHeaderCell" role="columnheader">
            {translations.allDay}
          </div>
          <day_grid_1.DayGrid.Row className="DayTimeGridAllDayEventsRow" role="row" style={{ '--column-count': days.length }}>
            {daysWithEvents.map(function (_a, dayIndex) {
            var day = _a.day, allDayEvents = _a.allDayEvents;
            return (<day_grid_1.DayGrid.Cell key={day.toString()} className="DayTimeGridAllDayEventsCell" style={{
                    '--row-count': (0, event_utils_1.getEventWithLargestRowIndex)(allDayEvents),
                }} aria-labelledby={"DayTimeGridHeaderCell-".concat(adapter.getDate(day), " DayTimeGridAllDayEventsHeaderCell")} role="gridcell" data-weekend={(0, date_utils_1.isWeekend)(adapter, day) ? '' : undefined}>
                {allDayEvents.map(function (event) {
                    var durationInDays = (0, date_utils_1.diffIn)(adapter, event.end, day, 'days') + 1;
                    var gridColumnSpan = Math.min(durationInDays, days.length - dayIndex); // Don't exceed available columns
                    var shouldRenderEvent = adapter.isSameDay(event.start, day) || dayIndex === 0;
                    return shouldRenderEvent ? (<event_popover_1.EventPopoverTrigger key={"".concat(event.key, "-").concat(day.toString())} event={event} render={<event_1.DayGridEvent event={event} eventResource={resourcesByIdMap.get(event.resource)} variant="allDay" ariaLabelledBy={"MonthViewHeaderCell-".concat(day.toString())} gridRow={event.eventRowIndex} columnSpan={gridColumnSpan}/>}/>) : (<event_1.DayGridEvent key={"invisible-".concat(event.key, "-").concat(day.toString())} event={event} eventResource={resourcesByIdMap.get(event.resource)} variant="invisible" ariaLabelledBy={"MonthViewHeaderCell-".concat(day.toString())} aria-hidden="true" gridRow={event.eventRowIndex}/>);
                })}
              </day_grid_1.DayGrid.Cell>);
        })}
          </day_grid_1.DayGrid.Row>
          <div className="ScrollablePlaceholder"/>
        </day_grid_1.DayGrid.Root>
        <time_grid_1.TimeGrid.Root className="DayTimeGridRoot" onEventChange={handleEventChangeFromPrimitive}>
          <time_grid_1.TimeGrid.ScrollableContent ref={bodyRef} className="DayTimeGridBody">
            <div className="DayTimeGridScrollableContent">
              <div className="DayTimeGridTimeAxis" aria-hidden="true">
                {/* TODO: Handle DST days where there are not exactly 24 hours */}
                {Array.from({ length: 24 }, function (_, hour) { return (<div key={hour} className="DayTimeGridTimeAxisCell" style={{ '--hour': hour }}>
                    <time className="DayTimeGridTimeAxisText">
                      {hour === 0
                ? null
                : adapter.format(adapter.setHours(visibleDate, hour), ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                    </time>
                  </div>); })}
              </div>
              <div className="DayTimeGridGrid">
                {daysWithEvents.map(function (_a) {
            var day = _a.day, regularEvents = _a.events;
            return (<time_grid_1.TimeGrid.Column key={day.day.toString()} start={adapter.startOfDay(day)} end={adapter.endOfDay(day)} className="DayTimeGridColumn" data-weekend={(0, date_utils_1.isWeekend)(adapter, day) ? '' : undefined}>
                    {regularEvents.map(function (event) { return (<event_popover_1.EventPopoverTrigger key={event.key} event={event} render={<TimeGridEvent_1.TimeGridEvent event={event} eventResource={resourcesByIdMap.get(event.resource)} variant="regular" ariaLabelledBy={"DayTimeGridHeaderCell-".concat(adapter.getDate(day))}/>}/>); })}
                    <TimeGridEventPlaceholder day={day}/>
                  </time_grid_1.TimeGrid.Column>);
        })}
              </div>
            </div>
          </time_grid_1.TimeGrid.ScrollableContent>
        </time_grid_1.TimeGrid.Root>
      </event_popover_1.EventPopoverProvider>
    </div>);
});
function TimeGridEventPlaceholder(_a) {
    var _b;
    var day = _a.day;
    var placeholder = time_grid_1.TimeGrid.useColumnPlaceholder();
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var event = (0, store_1.useStore)(store, use_event_calendar_1.selectors.getEventById, (_b = placeholder === null || placeholder === void 0 ? void 0 : placeholder.eventId) !== null && _b !== void 0 ? _b : null);
    var resourcesByIdMap = (0, store_1.useStore)(store, use_event_calendar_1.selectors.resourcesByIdMap);
    var updatedEvent = React.useMemo(function () {
        if (!event || !placeholder) {
            return null;
        }
        return __assign(__assign({}, event), { start: placeholder.start, end: placeholder.end, readOnly: true });
    }, [event, placeholder]);
    if (!updatedEvent) {
        return null;
    }
    return (<TimeGridEvent_1.TimeGridEvent event={updatedEvent} eventResource={resourcesByIdMap.get(updatedEvent.resource)} variant="regular" ariaLabelledBy={"DayTimeGridHeaderCell-".concat(adapter.getDate(day))}/>);
}
