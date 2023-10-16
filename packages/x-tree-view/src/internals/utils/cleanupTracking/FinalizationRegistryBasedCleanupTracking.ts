import { CleanupTracking, UnsubscribeFn, UnregisterToken } from './CleanupTracking';

export class FinalizationRegistryBasedCleanupTracking implements CleanupTracking {
  registry = new FinalizationRegistry<UnsubscribeFn>((unsubscribe) => {
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }
  });

  register(object: any, unsubscribe: UnsubscribeFn, unregisterToken: UnregisterToken): void {
    this.registry.register(object, unsubscribe, unregisterToken);
  }

  unregister(unregisterToken: UnregisterToken): void {
    this.registry.unregister(unregisterToken);
  }

  // eslint-disable-next-line class-methods-use-this
  reset() {}
}
