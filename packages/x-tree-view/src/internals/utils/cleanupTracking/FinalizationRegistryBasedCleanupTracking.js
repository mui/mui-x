"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizationRegistryBasedCleanupTracking = void 0;
var FinalizationRegistryBasedCleanupTracking = /** @class */ (function () {
    function FinalizationRegistryBasedCleanupTracking() {
        this.registry = new FinalizationRegistry(function (unsubscribe) {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
    }
    FinalizationRegistryBasedCleanupTracking.prototype.register = function (object, unsubscribe, unregisterToken) {
        this.registry.register(object, unsubscribe, unregisterToken);
    };
    FinalizationRegistryBasedCleanupTracking.prototype.unregister = function (unregisterToken) {
        this.registry.unregister(unregisterToken);
    };
    // eslint-disable-next-line class-methods-use-this
    FinalizationRegistryBasedCleanupTracking.prototype.reset = function () { };
    return FinalizationRegistryBasedCleanupTracking;
}());
exports.FinalizationRegistryBasedCleanupTracking = FinalizationRegistryBasedCleanupTracking;
