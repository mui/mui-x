"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnEveryMinuteStart = useOnEveryMinuteStart;
var React = require("react");
var utils_1 = require("@floating-ui/react/utils");
var useTimeout_1 = require("@base-ui-components/utils/useTimeout");
var ONE_MINUTE_IN_MS = 60 * 1000;
/**
 * Runs the provided callback at the start of every minute.
 * @param {() => void} callback The callback function to run.
 */
function useOnEveryMinuteStart(callback) {
    var timeout = (0, useTimeout_1.useTimeout)();
    var savedCallback = (0, utils_1.useEffectEvent)(callback);
    React.useEffect(function () {
        var intervalId = null;
        var currentDate = new Date();
        var timeUntilNextMinuteMs = ONE_MINUTE_IN_MS - (currentDate.getSeconds() * 1000 + currentDate.getMilliseconds());
        timeout.start(timeUntilNextMinuteMs, function () {
            savedCallback();
            intervalId = setInterval(function () {
                savedCallback();
            }, ONE_MINUTE_IN_MS);
        });
        return function () {
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
        };
    }, [timeout, savedCallback]);
}
