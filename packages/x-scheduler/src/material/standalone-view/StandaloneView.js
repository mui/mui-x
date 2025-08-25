"use strict";
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
exports.StandaloneView = StandaloneView;
var React = require("react");
var useEventCalendarContext_1 = require("../internals/hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../primitives/use-event-calendar");
require("../index.css");
/**
 * Temporary component to help rendering standalone views in the doc.
 * A clean solution will be implemented later.
 */
function StandaloneView(props) {
    var children = props.children, other = __rest(props, ["children"]);
    var contextValue = (0, use_event_calendar_1.useEventCalendar)(other);
    return (<useEventCalendarContext_1.EventCalendarContext.Provider value={contextValue}>{children}</useEventCalendarContext_1.EventCalendarContext.Provider>);
}
