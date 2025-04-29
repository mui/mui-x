export type EventListener = (...args: any[]) => void;

export interface EventListenerOptions {
  isFirst?: boolean;
}

interface EventListenerCollection {
  /**
   * List of listeners to run before the others
   * They are run in the opposite order of the registration order
   */
  highPriority: Map<EventListener, true>;
  /**
   * List of events to run after the high priority listeners
   * They are run in the registration order
   */
  regular: Map<EventListener, true>;
}

// Used https://gist.github.com/mudge/5830382 as a starting point.
// See https://github.com/browserify/events/blob/master/events.js for
// the Node.js (https://nodejs.org/api/events.html) polyfill used by webpack.
export class EventManager {
  maxListeners = 20;

  warnOnce = false;

  events: { [eventName: string]: EventListenerCollection } = {};

  on(eventName: string, listener: EventListener, options: EventListenerOptions = {}): void {
    let collection = this.events[eventName];

    if (!collection) {
      collection = {
        highPriority: new Map(),
        regular: new Map(),
      };
      this.events[eventName] = collection;
    }

    if (options.isFirst) {
      collection.highPriority.set(listener, true);
    } else {
      collection.regular.set(listener, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      const collectionSize = collection.highPriority.size + collection.regular.size;
      if (collectionSize > this.maxListeners && !this.warnOnce) {
        this.warnOnce = true;
        console.warn(
          [
            `Possible EventEmitter memory leak detected. ${collectionSize} ${eventName} listeners added.`,
          ].join('\n'),
        );
      }
    }
  }

  removeListener(eventName: string, listener: EventListener): void {
    if (this.events[eventName]) {
      this.events[eventName].regular.delete(listener);
      this.events[eventName].highPriority.delete(listener);
    }
  }

  removeAllListeners(): void {
    this.events = {};
  }

  emit(eventName: string, ...args: any[]): void {
    const collection = this.events[eventName];
    if (!collection) {
      return;
    }

    const highPriorityListeners = Array.from(collection.highPriority.keys());
    const regularListeners = Array.from(collection.regular.keys());

    for (let i = highPriorityListeners.length - 1; i >= 0; i -= 1) {
      const listener = highPriorityListeners[i];
      if (collection.highPriority.has(listener)) {
        listener.apply(this, args);
      }
    }

    for (let i = 0; i < regularListeners.length; i += 1) {
      const listener = regularListeners[i];
      if (collection.regular.has(listener)) {
        listener.apply(this, args);
      }
    }
  }

  once(eventName: string, listener: EventListener): void {
    // eslint-disable-next-line consistent-this
    const that = this;
    this.on(eventName, function oneTimeListener(...args) {
      that.removeListener(eventName, oneTimeListener);
      listener.apply(that, args);
    });
  }
}
