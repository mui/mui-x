import type { ChartState } from '../models/chart';
import type { ChartAnyPluginSignature } from '../models/plugin';

type Listener<T> = (value: T) => void;

export type StoreUpdater<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> = (
  prevState: ChartState<TSignatures, TOptionalSignatures>,
) => ChartState<TSignatures, TOptionalSignatures>;

export class ChartStore<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> {
  public value: ChartState<TSignatures, TOptionalSignatures>;

  private listeners: Set<Listener<ChartState<TSignatures, TOptionalSignatures>>>;

  constructor(value: ChartState<TSignatures, TOptionalSignatures>) {
    this.value = value;
    this.listeners = new Set();
  }

  public subscribe = (fn: Listener<ChartState<TSignatures, TOptionalSignatures>>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  public getSnapshot = () => {
    return this.value;
  };

  public update = (updater: StoreUpdater<TSignatures, TOptionalSignatures>) => {
    const newState = updater(this.value);
    if (newState !== this.value) {
      this.value = newState;
      this.listeners.forEach((l) => l(newState));
    }
  };
}
