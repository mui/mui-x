"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewInstanceEvents = void 0;
var React = require("react");
var EventManager_1 = require("@mui/x-internals/EventManager");
var isSyntheticEvent = function (event) {
    return event.isPropagationStopped !== undefined;
};
var useTreeViewInstanceEvents = function () {
    var eventManager = React.useState(function () { return new EventManager_1.EventManager(); })[0];
    var publishEvent = React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var name = args[0], params = args[1], _a = args[2], event = _a === void 0 ? {} : _a;
        event.defaultMuiPrevented = false;
        if (isSyntheticEvent(event) && event.isPropagationStopped()) {
            return;
        }
        eventManager.emit(name, params, event);
    }, [eventManager]);
    var subscribeEvent = React.useCallback(function (event, handler) {
        eventManager.on(event, handler);
        return function () {
            eventManager.removeListener(event, handler);
        };
    }, [eventManager]);
    return {
        instance: {
            $$publishEvent: publishEvent,
            $$subscribeEvent: subscribeEvent,
        },
    };
};
exports.useTreeViewInstanceEvents = useTreeViewInstanceEvents;
exports.useTreeViewInstanceEvents.params = {};
