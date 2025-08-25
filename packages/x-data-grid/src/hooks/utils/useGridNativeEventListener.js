"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridNativeEventListener = void 0;
var useGridLogger_1 = require("./useGridLogger");
var useGridEvent_1 = require("./useGridEvent");
var useGridNativeEventListener = function (apiRef, ref, eventName, handler, options) {
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useNativeEventListener');
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'rootMount', function () {
        var targetElement = ref();
        if (!targetElement || !eventName) {
            return undefined;
        }
        logger.debug("Binding native ".concat(eventName, " event"));
        targetElement.addEventListener(eventName, handler, options);
        return function () {
            logger.debug("Clearing native ".concat(eventName, " event"));
            targetElement.removeEventListener(eventName, handler, options);
        };
    });
};
exports.useGridNativeEventListener = useGridNativeEventListener;
