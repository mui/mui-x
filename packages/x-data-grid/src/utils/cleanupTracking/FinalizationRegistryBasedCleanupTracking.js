export class FinalizationRegistryBasedCleanupTracking {
    registry = new FinalizationRegistry((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    });
    register(object, unsubscribe, unregisterToken) {
        this.registry.register(object, unsubscribe, unregisterToken);
    }
    unregister(unregisterToken) {
        this.registry.unregister(unregisterToken);
    }
    reset() { }
}
