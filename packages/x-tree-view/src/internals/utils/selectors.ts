import { TreeViewAnyPluginSignature, TreeViewState } from '../models';

export type TreeViewSelector<
  TRequiredSignatures extends readonly TreeViewAnyPluginSignature[],
  TValue,
> = <TProvidedSignatures extends TRequiredSignatures>(
  state: TreeViewState<TProvidedSignatures>,
) => TValue;

export function createSelector<TSignatures extends readonly TreeViewAnyPluginSignature[], TValue>(
  selector: TreeViewSelector<TSignatures, TValue>,
): TreeViewSelector<TSignatures, TValue> {
  return selector;
}
