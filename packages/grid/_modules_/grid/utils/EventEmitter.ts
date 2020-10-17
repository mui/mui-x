type Listener = (...args: any[]) => void;

export class EventEmitter {
  events: { [key: string]: Listener[] } = {};

  on(event: string, listener: Listener): void {
    if (!Array.isArray(this.events[event])) {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  }

  removeListener(event: string, listener: Listener): void {
    if (Array.isArray(this.events[event])) {
      const idx = this.events[event].indexOf(listener);

      if (idx > -1) {
        this.events[event].splice(idx, 1);
      }
    }
  }

  removeAllListeners(event?: string): void {
    if (!event) {
      this.events = {};
    } else if (Array.isArray(this.events[event])) {
      this.events[event] = [];
    }
  }

  emit(event: string, ...args: any[]): void {
    if (Array.isArray(this.events[event])) {
      const listeners = this.events[event].slice();
      const length = listeners.length;

      for (let i = 0; i < length; i += 1) {
        listeners[i].apply(this, args);
      }
    }
  }

  once(event: string, listener: Listener): void {
    // eslint-disable-next-line consistent-this
    const that = this;
    this.on(event, function oneTimeListener(...args) {
      that.removeListener(event, oneTimeListener);
      listener.apply(that, args);
    });
  }
}
