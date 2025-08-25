"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGridEventContext = void 0;
exports.useTimeGridEventContext = useTimeGridEventContext;
var React = require("react");
exports.TimeGridEventContext = React.createContext(undefined);
function useTimeGridEventContext() {
    var context = React.useContext(exports.TimeGridEventContext);
    if (context === undefined) {
        throw new Error('Scheduler: `TimeGridEventContext` is missing. TimeGrid Event parts must be placed within <TimeGrid.Event />.');
    }
    return context;
}
