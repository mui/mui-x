"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGridRootContext = void 0;
exports.useTimeGridRootContext = useTimeGridRootContext;
var React = require("react");
exports.TimeGridRootContext = React.createContext(undefined);
function useTimeGridRootContext() {
    var context = React.useContext(exports.TimeGridRootContext);
    if (context === undefined) {
        throw new Error('Scheduler: `TimeGridRootContext` is missing. Time Grid parts must be placed within <TimeGrid.Root />.');
    }
    return context;
}
