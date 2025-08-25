"use strict";
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
exports.selectors = void 0;
var store_1 = require("@base-ui-components/utils/store");
var event_utils_1 = require("../utils/event-utils");
var recurrence_utils_1 = require("../utils/recurrence-utils");
// We don't pass the eventId to be able to pass events with properties not stored in state for the drag and drop.
var isEventReadOnlySelector = (0, store_1.createSelector)(function (state, event) {
    // TODO: Support putting the whole calendar as readOnly.
    return !!event.readOnly || !!event.rrule;
});
exports.selectors = {
    visibleDate: (0, store_1.createSelector)(function (state) { return state.visibleDate; }),
    ampm: (0, store_1.createSelector)(function (state) { return state.ampm; }),
    view: (0, store_1.createSelector)(function (state) { return state.view; }),
    views: (0, store_1.createSelector)(function (state) { return state.views; }),
    settings: (0, store_1.createSelector)(function (state) { return state.settings; }),
    hasDayView: (0, store_1.createSelector)(function (state) { return state.views.includes('day'); }),
    resources: (0, store_1.createSelector)(function (state) { return state.resources; }),
    visibleResourcesList: (0, store_1.createSelectorMemoized)(function (state) { return state.resources; }, function (state) { return state.visibleResources; }, function (resources, visibleResources) {
        return resources
            .filter(function (resource) {
            return !visibleResources.has(resource.id) || visibleResources.get(resource.id) === true;
        })
            .map(function (resource) { return resource.id; });
    }),
    resourcesByIdMap: (0, store_1.createSelectorMemoized)(function (state) { return state.resources; }, function (resources) {
        var map = new Map();
        for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
            var resource = resources_1[_i];
            map.set(resource.id, resource);
        }
        return map;
    }),
    eventsToRenderGroupedByDay: (0, store_1.createSelector)(function (state) { return state.events; }, function (state) { return state.visibleResources; }, function (state) { return state.adapter; }, function (_state, parameters) { return parameters; }, function (events, visibleResources, adapter, _a) {
        var days = _a.days, shouldOnlyRenderEventInOneCell = _a.shouldOnlyRenderEventInOneCell;
        var daysMap = new Map();
        for (var _i = 0, days_1 = days; _i < days_1.length; _i++) {
            var day = days_1[_i];
            var dayKey = adapter.format(day, 'keyboardDate');
            daysMap.set(dayKey, { events: [], allDayEvents: [] });
        }
        // Collect ALL event occurrences (both recurring and non-recurring)
        var visibleOccurrences = [];
        for (var _b = 0, events_1 = events; _b < events_1.length; _b++) {
            var event_1 = events_1[_b];
            // STEP 1: Skip events from resources that are not visible
            if (event_1.resource && visibleResources.get(event_1.resource) === false) {
                continue;
            }
            // STEP 2-A: Recurrent event processing, if it is recurrent expand it for the visible days
            if (event_1.rrule) {
                var occurrences = (0, recurrence_utils_1.getRecurringEventOccurrencesForVisibleDays)(event_1, days, adapter);
                visibleOccurrences.push.apply(visibleOccurrences, occurrences);
                continue;
            }
            // STEP 2-B: Non-recurring event processing, check if the event is within the visible days
            var eventFirstDay = adapter.startOfDay(event_1.start);
            var eventLastDay = adapter.endOfDay(event_1.end);
            if (adapter.isAfter(eventFirstDay, days[days.length - 1]) ||
                adapter.isBefore(eventLastDay, days[0])) {
                continue; // Skip events that are not in the visible days
            }
            visibleOccurrences.push(__assign(__assign({}, event_1), { key: String(event_1.id) }));
        }
        // STEP 3: Sort by the actual start date of each occurrence
        // We sort here so that events are processed in the correct order, ensuring consistent row index assignment for all-day events
        var sortedOccurrences = visibleOccurrences
            // TODO: Avoid JS Date conversion
            .map(function (occurrence) { return ({
            occurrence: occurrence,
            timestamp: adapter.toJsDate(occurrence.start).getTime(),
        }); })
            .sort(function (a, b) { return a.timestamp - b.timestamp; })
            .map(function (item) { return item.occurrence; });
        // STEP 4: Add the occurrence to the days map
        for (var _c = 0, sortedOccurrences_1 = sortedOccurrences; _c < sortedOccurrences_1.length; _c++) {
            var occurrence = sortedOccurrences_1[_c];
            var eventDays = (0, event_utils_1.getEventDays)(occurrence, days, adapter, shouldOnlyRenderEventInOneCell);
            for (var _d = 0, eventDays_1 = eventDays; _d < eventDays_1.length; _d++) {
                var day = eventDays_1[_d];
                var dayKey = adapter.format(day, 'keyboardDate');
                if (!daysMap.has(dayKey)) {
                    daysMap.set(dayKey, { events: [], allDayEvents: [] });
                }
                // STEP 4.1: Process all-day events and get their position in the row
                if (occurrence.allDay) {
                    var eventRowIndex = (0, event_utils_1.getEventRowIndex)(occurrence, day, days, daysMap, adapter);
                    daysMap.get(dayKey).allDayEvents.push(__assign(__assign({}, occurrence), { eventRowIndex: eventRowIndex }));
                }
                else {
                    daysMap.get(dayKey).events.push(occurrence);
                }
            }
        }
        return days.map(function (day) {
            var _a, _b;
            var dayKey = adapter.format(day, 'keyboardDate');
            return {
                day: day,
                events: ((_a = daysMap.get(dayKey)) === null || _a === void 0 ? void 0 : _a.events) || [],
                allDayEvents: ((_b = daysMap.get(dayKey)) === null || _b === void 0 ? void 0 : _b.allDayEvents) || [],
            };
        });
    }),
    // TODO: Add a new data structure (Map?) to avoid linear complexity here.
    getEventById: (0, store_1.createSelector)(function (state, eventId) {
        return state.events.find(function (event) { return event.id === eventId; });
    }),
    isEventReadOnly: isEventReadOnlySelector,
    isEventDraggable: (0, store_1.createSelector)(isEventReadOnlySelector, function (state) { return state.areEventsDraggable; }, function (isEventReadOnly, areEventsDraggable) { return !isEventReadOnly && areEventsDraggable; }),
    isEventResizable: (0, store_1.createSelector)(isEventReadOnlySelector, function (state) { return state.areEventsResizable; }, function (isEventReadOnly, areEventsResizable) { return !isEventReadOnly && areEventsResizable; }),
};
