"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGridColumnContext = void 0;
exports.useTimeGridColumnContext = useTimeGridColumnContext;
var React = require("react");
exports.TimeGridColumnContext = React.createContext(undefined);
function useTimeGridColumnContext() {
    var context = React.useContext(exports.TimeGridColumnContext);
    if (context === undefined) {
        throw new Error('Scheduler: `TimeGridColumnContext` is missing. <TimeGrid.Event /> must be placed within <TimeGrid.Column />.');
    }
    return context;
}
