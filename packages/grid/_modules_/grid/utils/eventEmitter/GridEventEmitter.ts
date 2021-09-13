import { EventEmitter } from './EventEmitter';
import { GridCallbackDetails } from '../../models/api/gridCallbackDetails';
import { MuiEvent } from '../../models/muiEvent';

export type GridListener<Params, Event extends MuiEvent> = (
  params: Params,
  event: Event,
  details: GridCallbackDetails,
) => void;
export type GridSubscribeEventOptions = { isFirst?: boolean };

export class GridEventEmitter extends EventEmitter {
  /**
   * @ignore - do not document.
   */
  on<Params, Event extends MuiEvent>(
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
