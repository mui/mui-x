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
exports.TimeGridEvent = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useId_1 = require("@base-ui-components/utils/useId");
var store_1 = require("@base-ui-components/utils/store");
var lucide_react_1 = require("lucide-react");
var getAdapter_1 = require("../../../../../primitives/utils/adapter/getAdapter");
var time_grid_1 = require("../../../../../primitives/time-grid");
var color_utils_1 = require("../../../utils/color-utils");
var use_event_calendar_1 = require("../../../../../primitives/use-event-calendar");
var useEventCalendarContext_1 = require("../../../hooks/useEventCalendarContext");
require("./TimeGridEvent.css");
require("../index.css");
var adapter = (0, getAdapter_1.getAdapter)();
exports.TimeGridEvent = React.forwardRef(function TimeGridEvent(props, forwardedRef) {
    var eventProp = props.event, eventResource = props.eventResource, ariaLabelledBy = props.ariaLabelledBy, variant = props.variant, className = props.className, idProp = props.id, other = __rest(props, ["event", "eventResource", "ariaLabelledBy", "variant", "className", "id"]);
    var id = (0, useId_1.useId)(idProp);
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var isRecurring = Boolean(eventProp.rrule);
    var isDraggable = (0, store_1.useStore)(store, use_event_calendar_1.selectors.isEventDraggable, eventProp);
    var isResizable = (0, store_1.useStore)(store, use_event_calendar_1.selectors.isEventResizable, eventProp);
    var ampm = (0, store_1.useStore)(store, use_event_calendar_1.selectors.ampm);
    var timeFormat = ampm ? 'hoursMinutes12h' : 'hoursMinutes24h';
    var durationMs = adapter.toJsDate(eventProp.end).getTime() - adapter.toJsDate(eventProp.start).getTime();
    var durationMinutes = durationMs / 60000;
    var isBetween30and60Minutes = durationMinutes >= 30 && durationMinutes < 60;
    var isLessThan30Minutes = durationMinutes < 30;
    var isMoreThan90Minutes = durationMinutes >= 90;
    var titleLineCountRegularVariant = isMoreThan90Minutes ? 2 : 1;
    var content = React.useMemo(function () {
        if (isBetween30and60Minutes || isLessThan30Minutes) {
            return (<p className={(0, clsx_1.default)('UnderHourEvent', 'LinesClamp', isLessThan30Minutes && 'Under30MinutesEvent')} style={{ '--number-of-lines': 1 }}>
          <span className="EventTitle">{eventProp.title}</span>
          <time className="EventTime">{adapter.format(eventProp.start, timeFormat)}</time>
          {isRecurring && (<lucide_react_1.Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true"/>)}
        </p>);
        }
        return (<React.Fragment>
        <p className={(0, clsx_1.default)('EventTitle', 'LinesClamp')} style={{ '--number-of-lines': titleLineCountRegularVariant }}>
          {eventProp.title}
        </p>
        <time className={(0, clsx_1.default)('EventTime', 'LinesClamp')} style={{ '--number-of-lines': 1 }}>
          {adapter.format(eventProp.start, timeFormat)} -{' '}
          {adapter.format(eventProp.end, timeFormat)}
        </time>
        {isRecurring && (<lucide_react_1.Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true"/>)}
      </React.Fragment>);
    }, [
        isBetween30and60Minutes,
        isLessThan30Minutes,
        titleLineCountRegularVariant,
        eventProp.title,
        eventProp.start,
        eventProp.end,
        timeFormat,
        isRecurring,
    ]);
    return (<time_grid_1.TimeGrid.Event ref={forwardedRef} id={id} isDraggable={isDraggable} className={(0, clsx_1.default)(className, 'EventContainer', 'EventCard', "EventCard--".concat(variant), (isLessThan30Minutes || isBetween30and60Minutes) && 'UnderHourEventCard', isDraggable && 'Draggable', isRecurring && 'Recurrent', (0, color_utils_1.getColorClassName)({ resource: eventResource }))} aria-labelledby={"".concat(ariaLabelledBy, " ").concat(id)} eventId={eventProp.id} start={eventProp.start} end={eventProp.end} {...other}>
      {isResizable && <time_grid_1.TimeGrid.EventResizeHandler side="start" className="EventResizeHandler"/>}
      {content}
      {isResizable && <time_grid_1.TimeGrid.EventResizeHandler side="end" className="EventResizeHandler"/>}
    </time_grid_1.TimeGrid.Event>);
});
