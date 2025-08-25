"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCalendarContext = void 0;
exports.useEventCalendarContext = useEventCalendarContext;
var React = require("react");
exports.EventCalendarContext = React.createContext(null);
function useEventCalendarContext() {
    var context = React.useContext(exports.EventCalendarContext);
    if (context == null) {
        throw new Error('useEventCalendarContext must be used within an <EventCalendar /> component');
    }
    return context;
}
