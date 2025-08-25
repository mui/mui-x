"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGridColumnPlaceholderContext = void 0;
exports.useTimeGridColumnPlaceholderContext = useTimeGridColumnPlaceholderContext;
var React = require("react");
exports.TimeGridColumnPlaceholderContext = React.createContext(undefined);
function useTimeGridColumnPlaceholderContext() {
    var context = React.useContext(exports.TimeGridColumnPlaceholderContext);
    if (context === undefined) {
        throw new Error('Scheduler: `TimeGridColumnPlaceholderContext` is missing. TimeGrid.useColumnPlaceholder() must be placed within <TimeGrid.Column />.');
    }
    return context;
}
