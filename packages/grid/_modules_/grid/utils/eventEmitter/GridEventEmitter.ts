import * as React from 'react';
import { EventEmitter } from './EventEmitter';
import { MuiEvent } from '../../models/muiEvent';
import { GridCallbackDetails } from '../../models/api/gridCallbackDetails';

export type GridValidEvent = MuiEvent<
  React.SyntheticEvent | DocumentEventMap[keyof DocumentEventMap] | {}
>;
export type GridListener<Params, Event extends GridValidEvent> = (
  params: Params,
  event: Event,
  details: GridCallbackDetails,
) => void;
export type GridSubscribeEventOptions = { isFirst?: boolean };

export class GridEventEmitter extends EventEmitter {
  /**
   * @ignore - do not document.
   */
  on<Params, Event extends GridValidEvent>(
    eventName: string,
    listener: GridListener<Params, Event>,
    options?: GridSubscribeEventOptions,
  ): void {
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
