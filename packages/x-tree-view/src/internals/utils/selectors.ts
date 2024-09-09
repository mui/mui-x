import { TreeViewAnyPluginSignature, TreeViewUsedStore } from '../models';
import { TreeViewStore } from './TreeViewStore';

type DefaultSignatures = readonly TreeViewAnyPluginSignature[] | TreeViewAnyPluginSignature;

type StoreFromSignatures<TSignatures extends DefaultSignatures> =
  TSignatures extends readonly TreeViewAnyPluginSignature[]
    ? TreeViewStore<TSignatures>
    : TSignatures extends TreeViewAnyPluginSignature
      ? TreeViewUsedStore<TSignatures>
      : TreeViewStore<[]>;

export type StoreOrStateFromSignatures<TSignatures extends DefaultSignatures> =
  | StoreFromSignatures<TSignatures>
  | StoreFromSignatures<TSignatures>['value'];

export type TreeViewSelector<TSignatures extends DefaultSignatures, TValue> = (
  storeOrState: StoreFromSignatures<TSignatures> | StoreFromSignatures<TSignatures>['value'],
) => TValue;

export type TreeViewRawSelector<TSignatures extends DefaultSignatures, TValue> = (
  state: StoreFromSignatures<TSignatures>['value'],
) => TValue;

export function resolveState<TSignatures extends DefaultSignatures>(
  storeOrState: StoreOrStateFromSignatures<TSignatures>,
): StoreFromSignatures<TSignatures>['value'] {
  if (storeOrState instanceof TreeViewStore) {
    return storeOrState.value;
  }

  return storeOrState;
}

export function createSelector<TSignatures extends DefaultSignatures, TValue>(
  selector: TreeViewRawSelector<TSignatures, TValue>,
): // TODO: Try to support TreeViewSelector generic type
TreeViewSelector<any[], TValue> {
  return (storeOrState) => selector(resolveState(storeOrState));
}
