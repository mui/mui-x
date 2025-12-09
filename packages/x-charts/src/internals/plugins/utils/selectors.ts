import type { Selector } from 'reselect';
import { type ChartAnyPluginSignature } from '../models/plugin';
import { type ChartState } from '../models/chart';

export type ChartRootSelector<
  TSignature extends ChartAnyPluginSignature,
  T extends keyof TSignature['state'] = keyof TSignature['state'],
> = Selector<ChartState<[TSignature]>, TSignature['state'][T]>;

export type ChartOptionalRootSelector<TSignature extends ChartAnyPluginSignature> = Selector<
  ChartState<[], [TSignature]>,
  TSignature['state'][keyof TSignature['state']] | undefined
>;
