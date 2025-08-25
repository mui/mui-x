"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineEventRowContext = void 0;
exports.useTimelineEventRowContext = useTimelineEventRowContext;
var React = require("react");
exports.TimelineEventRowContext = React.createContext(undefined);
function useTimelineEventRowContext() {
    var context = React.useContext(exports.TimelineEventRowContext);
    if (context === undefined) {
        throw new Error('Scheduler: `TimelineEventRowContext` is missing. <Timeline.Event /> part must be placed within <Timeline.EventRow />.');
    }
    return context;
}
