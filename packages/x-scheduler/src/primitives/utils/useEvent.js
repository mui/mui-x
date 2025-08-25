"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvent = useEvent;
var React = require("react");
var useAdapter_1 = require("./adapter/useAdapter");
var useOnEveryMinuteStart_1 = require("./useOnEveryMinuteStart");
function useEvent(parameters) {
    var adapter = (0, useAdapter_1.useAdapter)();
    var start = parameters.start, end = parameters.end;
    var _a = React.useState(function () {
        var currentDate = adapter.date();
        return {
            started: adapter.isBefore(start, currentDate),
            ended: adapter.isBefore(end, currentDate),
        };
    }), state = _a[0], setState = _a[1];
    (0, useOnEveryMinuteStart_1.useOnEveryMinuteStart)(function () {
        setState(function (prevState) {
            var currentDate = adapter.date();
            var newState = {
                started: adapter.isBefore(start, currentDate),
                ended: adapter.isBefore(end, currentDate),
            };
            if (newState.started === state.started && newState.ended === state.ended) {
                return prevState;
            }
            return newState;
        });
    });
    var props = React.useMemo(function () { return ({}); }, []);
    return { state: state, props: props };
}
