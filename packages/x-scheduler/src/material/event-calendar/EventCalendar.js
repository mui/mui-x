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
exports.EventCalendar = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var store_1 = require("@base-ui-components/utils/store");
var WeekView_1 = require("../week-view/WeekView");
var agenda_view_1 = require("../agenda-view");
var DayView_1 = require("../day-view/DayView");
var TranslationsContext_1 = require("../internals/utils/TranslationsContext");
var useEventCalendarContext_1 = require("../internals/hooks/useEventCalendarContext");
var month_view_1 = require("../month-view");
var header_toolbar_1 = require("../internals/components/header-toolbar");
var date_navigator_1 = require("../internals/components/date-navigator");
var resource_legend_1 = require("../internals/components/resource-legend");
var use_event_calendar_1 = require("../../primitives/use-event-calendar");
require("../index.css");
require("./EventCalendar.css");
exports.EventCalendar = React.forwardRef(function EventCalendar(props, forwardedRef) {
    var eventsProp = props.events, onEventsChange = props.onEventsChange, resourcesProp = props.resources, viewProp = props.view, defaultView = props.defaultView, views = props.views, visibleDateProp = props.visibleDate, defaultVisibleDate = props.defaultVisibleDate, onVisibleDateChange = props.onVisibleDateChange, areEventsDraggable = props.areEventsDraggable, areEventsResizable = props.areEventsResizable, ampm = props.ampm, 
    // TODO: Move inside useEventCalendar so that standalone view can benefit from it (#19293).
    translations = props.translations, className = props.className, other = __rest(props, ["events", "onEventsChange", "resources", "view", "defaultView", "views", "visibleDate", "defaultVisibleDate", "onVisibleDateChange", "areEventsDraggable", "areEventsResizable", "ampm", "translations", "className"]);
    var contextValue = (0, use_event_calendar_1.useEventCalendar)({
        events: eventsProp,
        onEventsChange: onEventsChange,
        resources: resourcesProp,
        view: viewProp,
        defaultView: defaultView,
        views: views,
        visibleDate: visibleDateProp,
        defaultVisibleDate: defaultVisibleDate,
        onVisibleDateChange: onVisibleDateChange,
        areEventsDraggable: areEventsDraggable,
        areEventsResizable: areEventsResizable,
        ampm: ampm,
    });
    var view = (0, store_1.useStore)(contextValue.store, use_event_calendar_1.selectors.view);
    var content;
    switch (view) {
        case 'week':
            content = <WeekView_1.WeekView />;
            break;
        case 'day':
            content = <DayView_1.DayView />;
            break;
        case 'month':
            content = <month_view_1.MonthView />;
            break;
        case 'agenda':
            content = <agenda_view_1.AgendaView />;
            break;
        default:
            content = null;
    }
    return (<useEventCalendarContext_1.EventCalendarContext.Provider value={contextValue}>
      <TranslationsContext_1.TranslationsProvider translations={translations}>
        <div className={(0, clsx_1.default)(className, 'EventCalendarRoot', 'mui-x-scheduler')} ref={forwardedRef} {...other}>
          <aside className="EventCalendarSidePanel">
            <date_navigator_1.DateNavigator />
            <section className="EventCalendarMonthCalendarPlaceholder" 
    // TODO: Add localization
    aria-label="Month calendar">
              Month Calendar
            </section>
            <resource_legend_1.ResourceLegend />
          </aside>
          <div className={(0, clsx_1.default)('EventCalendarMainPanel', view === 'month' && 'EventCalendarMainPanel--month')}>
            <header_toolbar_1.HeaderToolbar />
            <section 
    // TODO: Add localization
    className="EventCalendarContent" aria-label="Calendar content">
              {content}
            </section>
          </div>
        </div>
      </TranslationsContext_1.TranslationsProvider>
    </useEventCalendarContext_1.EventCalendarContext.Provider>);
});
