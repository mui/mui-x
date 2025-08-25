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
exports.AGENDA_VIEW_DAYS_AMOUNT = void 0;
exports.useEventCalendar = useEventCalendar;
var React = require("react");
var useIsoLayoutEffect_1 = require("@base-ui-components/utils/useIsoLayoutEffect");
var useRefWithInit_1 = require("@base-ui-components/utils/useRefWithInit");
var store_1 = require("@base-ui-components/utils/store");
var useEventCallback_1 = require("@base-ui-components/utils/useEventCallback");
var useAssertModelConsistency_1 = require("../utils/useAssertModelConsistency");
var useAdapter_1 = require("../utils/adapter/useAdapter");
var useAssertStateValidity_1 = require("../utils/useAssertStateValidity");
// TODO: Create a prop to allow users to customize the number of days in agenda view
exports.AGENDA_VIEW_DAYS_AMOUNT = 12;
var DEFAULT_VIEWS = ['week', 'day', 'month', 'agenda'];
var DEFAULT_SETTINGS = { hideWeekends: false };
var EMPTY_ARRAY = [];
function useEventCalendar(parameters) {
    var adapter = (0, useAdapter_1.useAdapter)();
    var defaultVisibleDateFallback = (0, useRefWithInit_1.useRefWithInit)(function () {
        return adapter.startOfDay(adapter.date());
    }).current;
    var eventsProp = parameters.events, onEventsChange = parameters.onEventsChange, _a = parameters.resources, resourcesProp = _a === void 0 ? EMPTY_ARRAY : _a, viewProp = parameters.view, _b = parameters.defaultView, defaultView = _b === void 0 ? 'week' : _b, _c = parameters.views, views = _c === void 0 ? DEFAULT_VIEWS : _c, onViewChange = parameters.onViewChange, visibleDateProp = parameters.visibleDate, _d = parameters.defaultVisibleDate, defaultVisibleDate = _d === void 0 ? defaultVisibleDateFallback : _d, onVisibleDateChange = parameters.onVisibleDateChange, _e = parameters.areEventsDraggable, areEventsDraggable = _e === void 0 ? false : _e, _f = parameters.areEventsResizable, areEventsResizable = _f === void 0 ? false : _f, _g = parameters.ampm, ampm = _g === void 0 ? true : _g, _h = parameters.settings, settingsProp = _h === void 0 ? DEFAULT_SETTINGS : _h;
    var store = (0, useRefWithInit_1.useRefWithInit)(function () {
        return new store_1.Store({
            adapter: adapter,
            events: eventsProp,
            resources: resourcesProp,
            visibleResources: new Map(),
            visibleDate: visibleDateProp !== null && visibleDateProp !== void 0 ? visibleDateProp : defaultVisibleDate,
            view: viewProp !== null && viewProp !== void 0 ? viewProp : defaultView,
            views: views,
            areEventsDraggable: areEventsDraggable,
            areEventsResizable: areEventsResizable,
            ampm: ampm,
            settings: settingsProp,
        });
    }).current;
    (0, useAssertModelConsistency_1.useAssertModelConsistency)({
        componentName: 'Event Calendar',
        propName: 'view',
        controlled: viewProp,
        defaultValue: defaultView,
    });
    (0, useAssertModelConsistency_1.useAssertModelConsistency)({
        componentName: 'Event Calendar',
        propName: 'visibleDate',
        controlled: visibleDateProp,
        defaultValue: defaultVisibleDate,
    });
    (0, useAssertStateValidity_1.useAssertStateValidity)(store);
    (0, useIsoLayoutEffect_1.useIsoLayoutEffect)(function () {
        var partialState = {
            adapter: adapter,
            events: eventsProp,
            resources: resourcesProp,
            views: views,
            areEventsDraggable: areEventsDraggable,
            areEventsResizable: areEventsResizable,
            ampm: ampm,
        };
        if (viewProp !== undefined) {
            partialState.view = viewProp;
        }
        if (visibleDateProp !== undefined) {
            partialState.visibleDate = visibleDateProp;
        }
        store.apply(partialState);
    }, [
        store,
        adapter,
        eventsProp,
        resourcesProp,
        viewProp,
        visibleDateProp,
        areEventsDraggable,
        areEventsResizable,
        views,
        ampm,
    ]);
    var setVisibleDate = (0, useEventCallback_1.useEventCallback)(function (visibleDate, event) {
        if (visibleDateProp === undefined) {
            store.set('visibleDate', visibleDate);
        }
        onVisibleDateChange === null || onVisibleDateChange === void 0 ? void 0 : onVisibleDateChange(visibleDate, event);
    });
    var setView = (0, useEventCallback_1.useEventCallback)(function (view, event) {
        if (!store.state.views.includes(view)) {
            throw new Error([
                "Event Calendar: The view \"".concat(view, "\" provided to the setView method is not compatible with the available views: ").concat(views.join(', '), "."),
                'Please ensure that the requested view is included in the views array.',
            ].join('\n'));
        }
        if (viewProp === undefined) {
            store.set('view', view);
        }
        onViewChange === null || onViewChange === void 0 ? void 0 : onViewChange(view, event);
    });
    var updateEvent = (0, useEventCallback_1.useEventCallback)(function (calendarEvent) {
        var updatedEvents = store.state.events.map(function (ev) {
            return ev.id === calendarEvent.id ? calendarEvent : ev;
        });
        onEventsChange === null || onEventsChange === void 0 ? void 0 : onEventsChange(updatedEvents);
    });
    var deleteEvent = (0, useEventCallback_1.useEventCallback)(function (eventId) {
        var updatedEvents = store.state.events.filter(function (ev) { return ev.id !== eventId; });
        onEventsChange === null || onEventsChange === void 0 ? void 0 : onEventsChange(updatedEvents);
    });
    var goToToday = (0, useEventCallback_1.useEventCallback)(function (event) {
        setVisibleDate(adapter.startOfDay(adapter.date()), event);
    });
    var goToPreviousVisibleDate = (0, useEventCallback_1.useEventCallback)(function (event) {
        setVisibleDate(getNavigationDate({ adapter: adapter, store: store, delta: -1 }), event);
    });
    var goToNextVisibleDate = (0, useEventCallback_1.useEventCallback)(function (event) {
        setVisibleDate(getNavigationDate({ adapter: adapter, store: store, delta: 1 }), event);
    });
    var switchToDay = (0, useEventCallback_1.useEventCallback)(function (visibleDate, event) {
        if (!store.state.views.includes('day')) {
            throw new Error('The "day" view is disabled on your Event Calendar. Please ensure that "day" is included in the views prop before using the switchToDay method.');
        }
        setVisibleDate(visibleDate, event);
        setView('day', event);
    });
    var setVisibleResources = (0, useEventCallback_1.useEventCallback)(function (visibleResources) {
        store.set('visibleResources', visibleResources);
    });
    var setSettings = (0, useEventCallback_1.useEventCallback)(function (partialSettings, _) {
        store.set('settings', __assign(__assign({}, store.state.settings), partialSettings));
    });
    var instanceRef = React.useRef({
        setView: setView,
        updateEvent: updateEvent,
        deleteEvent: deleteEvent,
        goToToday: goToToday,
        goToPreviousVisibleDate: goToPreviousVisibleDate,
        goToNextVisibleDate: goToNextVisibleDate,
        switchToDay: switchToDay,
        setVisibleResources: setVisibleResources,
        setSettings: setSettings,
    });
    var instance = instanceRef.current;
    return React.useMemo(function () { return ({ store: store, instance: instance }); }, [store, instance]);
}
function getNavigationDate(_a) {
    var adapter = _a.adapter, store = _a.store, delta = _a.delta;
    var _b = store.state, view = _b.view, visibleDate = _b.visibleDate;
    switch (view) {
        case 'day':
            return adapter.addDays(visibleDate, delta);
        case 'week':
            return adapter.addWeeks(adapter.startOfWeek(visibleDate), delta);
        case 'month':
            return adapter.addMonths(adapter.startOfMonth(visibleDate), delta);
        case 'agenda':
            return adapter.addDays(visibleDate, exports.AGENDA_VIEW_DAYS_AMOUNT * delta);
        default:
            return visibleDate;
    }
}
