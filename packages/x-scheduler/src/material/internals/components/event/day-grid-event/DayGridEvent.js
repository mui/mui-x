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
exports.DayGridEvent = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useId_1 = require("@base-ui-components/utils/useId");
var store_1 = require("@base-ui-components/utils/store");
var lucide_react_1 = require("lucide-react");
var getAdapter_1 = require("../../../../../primitives/utils/adapter/getAdapter");
var day_grid_1 = require("../../../../../primitives/day-grid");
var color_utils_1 = require("../../../utils/color-utils");
var TranslationsContext_1 = require("../../../utils/TranslationsContext");
var use_event_calendar_1 = require("../../../../../primitives/use-event-calendar");
var useEventCalendarContext_1 = require("../../../hooks/useEventCalendarContext");
require("./DayGridEvent.css");
// TODO: Create a standalone component for the resource color pin instead of re-using another component's CSS classes
require("../../resource-legend/ResourceLegend.css");
require("../index.css");
var adapter = (0, getAdapter_1.getAdapter)();
exports.DayGridEvent = React.forwardRef(function DayGridEvent(props, forwardedRef) {
    var eventProp = props.event, eventResource = props.eventResource, ariaLabelledBy = props.ariaLabelledBy, variant = props.variant, className = props.className, onEventClick = props.onEventClick, idProp = props.id, gridRow = props.gridRow, _a = props.columnSpan, columnSpan = _a === void 0 ? 1 : _a, style = props.style, other = __rest(props, ["event", "eventResource", "ariaLabelledBy", "variant", "className", "onEventClick", "id", "gridRow", "columnSpan", "style"]);
    var id = (0, useId_1.useId)(idProp);
    var translations = (0, TranslationsContext_1.useTranslations)();
    var store = (0, useEventCalendarContext_1.useEventCalendarContext)().store;
    var ampm = (0, store_1.useStore)(store, use_event_calendar_1.selectors.ampm);
    var isRecurring = Boolean(eventProp.rrule);
    var content = React.useMemo(function () {
        switch (variant) {
            case 'allDay':
            case 'invisible':
                return (<React.Fragment>
            <p className={(0, clsx_1.default)('DayGridEventTitle', 'LinesClamp')} style={{ '--number-of-lines': 1 }}>
              {eventProp.title}
            </p>
            {isRecurring && (<lucide_react_1.Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true"/>)}
          </React.Fragment>);
            case 'compact':
            default:
                return (<div className="DayGridEventCardWrapper">
            <span className="ResourceLegendColor" role="img" aria-label={(eventResource === null || eventResource === void 0 ? void 0 : eventResource.name)
                        ? translations.resourceAriaLabel(eventResource.name)
                        : translations.noResourceAriaLabel}/>
            <p className={(0, clsx_1.default)('DayGridEventCardContent', 'LinesClamp')} style={{ '--number-of-lines': 1 }}>
              {(eventProp === null || eventProp === void 0 ? void 0 : eventProp.allDay) ? (<span className="DayGridEventTime">{translations.allDay}</span>) : (<time className="DayGridEventTime">
                  <span className="DayGridEventTimeStart">
                    {adapter.format(eventProp.start, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                  <span className="DayGridEventTimeEnd">
                    {' '}
                    - {adapter.format(eventProp.end, ampm ? 'hoursMinutes12h' : 'hoursMinutes24h')}
                  </span>
                </time>)}

              <span className="DayGridEventTitle">{eventProp.title}</span>
            </p>
            {isRecurring && (<lucide_react_1.Repeat size={12} strokeWidth={1.5} className="EventRecurringIcon" aria-hidden="true"/>)}
          </div>);
        }
    }, [
        variant,
        eventProp.title,
        eventProp === null || eventProp === void 0 ? void 0 : eventProp.allDay,
        eventProp.start,
        eventProp.end,
        isRecurring,
        eventResource === null || eventResource === void 0 ? void 0 : eventResource.name,
        translations,
        ampm,
    ]);
    return (<day_grid_1.DayGrid.Event ref={forwardedRef} id={id} className={(0, clsx_1.default)(className, 'EventContainer', 'EventCard', "EventCard--".concat(variant), (0, color_utils_1.getColorClassName)({ resource: eventResource }))} aria-labelledby={"".concat(ariaLabelledBy, " ").concat(id)} aria-hidden={variant === 'invisible'} start={eventProp.start} end={eventProp.end} style={__assign({ '--grid-row': gridRow, '--grid-column-span': columnSpan }, style)} {...other}>
      {content}
    </day_grid_1.DayGrid.Event>);
});
