export type EventListener = (...args: any[]) => void;
export interface EventListenerOptions {
  isFirst?: boolean;
}

// Used https://gist.github.com/mudge/5830382 as a starting point.
// See https://github.com/browserify/events/blob/master/events.js for
// the Node.js (https://nodejs.org/api/events.html) polyfill used by webpack.
export class EventManager {
  maxListeners = 10;

  warnOnce = false;

  events: { [key: string]: EventListener[] } = {};

  on(eventName: string, listener: EventListener, options: EventListenerOptions = {}): void {
    if (!Array.isArray(this.events[eventName])) {
      this.events[eventName] = [];
    }

    if (options.isFirst) {
      this.events[eventName].splice(0, 0, listener);
    } else {
      this.events[eventName].push(listener);
    }

    if (process.env.NODE_ENV !== 'production') {
      if (this.events[eventName].length > this.maxListeners && this.warnOnce === false) {
        this.warnOnce = true;
        console.warn(
          [
            `Possible EventEmitter memory leak detected. ${this.events[eventName].length} ${eventName} listeners added.`,
            `Use emitter.setMaxListeners() to increase limit.`,
          ].join('\n'),
        );
      }
    }
  }

  removeListener(eventName: string, listener: EventListener): void {
    if (Array.isArray(this.events[eventName])) {
      const idx = this.events[eventName].indexOf(listener);

      if (idx > -1) {
        this.events[eventName].splice(idx, 1);
      }
    }
  }

  removeAllListeners(eventName?: string): void {
    if (!eventName) {
      this.events = {};
    } else if (Array.isArray(this.events[eventName])) {
      this.events[eventName] = [];
    }
  }

  emit(eventName: string, ...args: any[]): void {
    if (Array.isArray(this.events[eventName])) {
      const listeners = this.events[eventName].slice();
      const length = listeners.length;

      for (let i = 0; i < length; i += 1) {
        listeners[i].apply(this, args);
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
