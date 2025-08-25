"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineRootContext = void 0;
exports.useTimelineRootContext = useTimelineRootContext;
var React = require("react");
exports.TimelineRootContext = React.createContext(undefined);
function useTimelineRootContext() {
    var context = React.useContext(exports.TimelineRootContext);
    if (context === undefined) {
        throw new Error('Scheduler: `TimelineRootContext` is missing. Timeline parts must be placed within <Timeline.Root />.');
    }
    return context;
}
