"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal_registryContainer = void 0;
exports.useGridEvent = useGridEvent;
exports.useGridEventPriority = useGridEventPriority;
exports.unstable_resetCleanupTracking = unstable_resetCleanupTracking;
var React = require("react");
var TimerBasedCleanupTracking_1 = require("../../utils/cleanupTracking/TimerBasedCleanupTracking");
var FinalizationRegistryBasedCleanupTracking_1 = require("../../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking");
// Based on https://github.com/Bnaya/use-dispose-uncommitted/blob/main/src/finalization-registry-based-impl.ts
// Check https://github.com/facebook/react/issues/15317 to get more information
// We use class to make it easier to detect in heap snapshots by name
var ObjectToBeRetainedByReact = /** @class */ (function () {
    function ObjectToBeRetainedByReact() {
    }
    ObjectToBeRetainedByReact.create = function () {
        return new ObjectToBeRetainedByReact();
    };
    return ObjectToBeRetainedByReact;
}());
var registryContainer = {
    current: createRegistry(),
};
var cleanupTokensCounter = 0;
function useGridEvent(apiRef, eventName, handler, options) {
    var objectRetainedByReact = React.useState(ObjectToBeRetainedByReact.create)[0];
    var subscription = React.useRef(null);
    var handlerRef = React.useRef(null);
    handlerRef.current = handler;
    var cleanupTokenRef = React.useRef(null);
    if (!subscription.current && handlerRef.current) {
        var enhancedHandler = function (params, event, details) {
            var _a;
            if (!event.defaultMuiPrevented) {
                (_a = handlerRef.current) === null || _a === void 0 ? void 0 : _a.call(handlerRef, params, event, details);
            }
        };
        subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
        cleanupTokensCounter += 1;
        cleanupTokenRef.current = { cleanupToken: cleanupTokensCounter };
        registryContainer.current.register(objectRetainedByReact, // The callback below will be called once this reference stops being retained
        function () {
            var _a;
            (_a = subscription.current) === null || _a === void 0 ? void 0 : _a.call(subscription);
            subscription.current = null;
            cleanupTokenRef.current = null;
        }, cleanupTokenRef.current);
    }
    else if (!handlerRef.current && subscription.current) {
        subscription.current();
        subscription.current = null;
        if (cleanupTokenRef.current) {
            registryContainer.current.unregister(cleanupTokenRef.current);
            cleanupTokenRef.current = null;
        }
    }
    React.useEffect(function () {
        if (!subscription.current && handlerRef.current) {
            var enhancedHandler = function (params, event, details) {
                var _a;
                if (!event.defaultMuiPrevented) {
                    (_a = handlerRef.current) === null || _a === void 0 ? void 0 : _a.call(handlerRef, params, event, details);
                }
            };
            subscription.current = apiRef.current.subscribeEvent(eventName, enhancedHandler, options);
        }
        if (cleanupTokenRef.current && registryContainer.current) {
            // If the effect was called, it means that this render was committed
            // so we can trust the cleanup function to remove the listener.
            registryContainer.current.unregister(cleanupTokenRef.current);
            cleanupTokenRef.current = null;
        }
        return function () {
            var _a;
            (_a = subscription.current) === null || _a === void 0 ? void 0 : _a.call(subscription);
            subscription.current = null;
        };
    }, [apiRef, eventName, options]);
}
var OPTIONS_IS_FIRST = { isFirst: true };
function useGridEventPriority(apiRef, eventName, handler) {
    useGridEvent(apiRef, eventName, handler, OPTIONS_IS_FIRST);
}
// TODO: move to @mui/x-data-grid/internals
// eslint-disable-next-line @typescript-eslint/naming-convention
function unstable_resetCleanupTracking() {
    var _a;
    (_a = registryContainer.current) === null || _a === void 0 ? void 0 : _a.reset();
    registryContainer.current = createRegistry();
}
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.internal_registryContainer = registryContainer;
function createRegistry() {
    return typeof FinalizationRegistry !== 'undefined'
        ? new FinalizationRegistryBasedCleanupTracking_1.FinalizationRegistryBasedCleanupTracking()
        : new TimerBasedCleanupTracking_1.TimerBasedCleanupTracking();
}
