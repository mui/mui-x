import * as React from 'react';
import { EventEmitter } from './EventEmitter';

// TODO replace any with Generics
export type GridListener = (params: any, event?: React.SyntheticEvent) => void;
export type GridSubscribeEventOptions = { isFirst?: boolean };

export class GridEventEmitter extends EventEmitter {
  /**
   * @ignore - do not document.
   */
  on(eventName: string, listener: GridListener, options?: GridSubscribeEventOptions): void {
    if (!Array.isArray(this.events[eventName])) {
      this.events[eventName] = [];
    }

    if (options && options.isFirst) {
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
}
