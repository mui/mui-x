"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInstanceEventHandler = exports.unstable_resetCleanupTracking = void 0;
exports.createUseInstanceEventHandler = createUseInstanceEventHandler;
var React = require("react");
var TimerBasedCleanupTracking_1 = require("../utils/cleanupTracking/TimerBasedCleanupTracking");
var FinalizationRegistryBasedCleanupTracking_1 = require("../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking");
// We use class to make it easier to detect in heap snapshots by name
var ObjectToBeRetainedByReact = /** @class */ (function () {
    function ObjectToBeRetainedByReact() {
    }
    return ObjectToBeRetainedByReact;
}());
// Based on https://github.com/Bnaya/use-dispose-uncommitted/blob/main/src/finalization-registry-based-impl.ts
// Check https://github.com/facebook/react/issues/15317 to get more information
function createUseInstanceEventHandler(registryContainer) {
    var cleanupTokensCounter = 0;
    return function useInstanceEventHandler(instance, eventName, handler) {
        if (registryContainer.registry === null) {
            registryContainer.registry =
                typeof FinalizationRegistry !== 'undefined'
                    ? new FinalizationRegistryBasedCleanupTracking_1.FinalizationRegistryBasedCleanupTracking()
                    : new TimerBasedCleanupTracking_1.TimerBasedCleanupTracking();
        }
        var objectRetainedByReact = React.useState(new ObjectToBeRetainedByReact())[0];
        var subscription = React.useRef(null);
        var handlerRef = React.useRef(undefined);
        handlerRef.current = handler;
        var cleanupTokenRef = React.useRef(null);
        if (!subscription.current && handlerRef.current) {
            var enhancedHandler = function (params, event) {
                var _a;
                if (!event.defaultMuiPrevented) {
                    (_a = handlerRef.current) === null || _a === void 0 ? void 0 : _a.call(handlerRef, params, event);
                }
            };
            subscription.current = instance.$$subscribeEvent(eventName, enhancedHandler);
            cleanupTokensCounter += 1;
            cleanupTokenRef.current = { cleanupToken: cleanupTokensCounter };
            registryContainer.registry.register(objectRetainedByReact, // The callback below will be called once this reference stops being retained
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
                registryContainer.registry.unregister(cleanupTokenRef.current);
                cleanupTokenRef.current = null;
            }
        }
        React.useEffect(function () {
            if (!subscription.current && handlerRef.current) {
                var enhancedHandler = function (params, event) {
                    var _a;
                    if (!event.defaultMuiPrevented) {
                        (_a = handlerRef.current) === null || _a === void 0 ? void 0 : _a.call(handlerRef, params, event);
                    }
                };
                subscription.current = instance.$$subscribeEvent(eventName, enhancedHandler);
            }
            if (cleanupTokenRef.current && registryContainer.registry) {
                // If the effect was called, it means that this render was committed
                // so we can trust the cleanup function to remove the listener.
                registryContainer.registry.unregister(cleanupTokenRef.current);
                cleanupTokenRef.current = null;
            }
            return function () {
                var _a;
                (_a = subscription.current) === null || _a === void 0 ? void 0 : _a.call(subscription);
                subscription.current = null;
            };
        }, [instance, eventName]);
    };
}
var registryContainer = { registry: null };
// eslint-disable-next-line @typescript-eslint/naming-convention
var unstable_resetCleanupTracking = function () {
    var _a;
    (_a = registryContainer.registry) === null || _a === void 0 ? void 0 : _a.reset();
    registryContainer.registry = null;
};
exports.unstable_resetCleanupTracking = unstable_resetCleanupTracking;
exports.useInstanceEventHandler = createUseInstanceEventHandler(registryContainer);
