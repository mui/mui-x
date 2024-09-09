import { TreeViewAnyPluginSignature, TreeViewUsedStore } from '../models';
import { TreeViewStore } from './TreeViewStore';

type DefaultSignatures = readonly TreeViewAnyPluginSignature[] | TreeViewAnyPluginSignature;

type StoreFromSignatures<TSignatures extends DefaultSignatures> =
  TSignatures extends readonly TreeViewAnyPluginSignature[]
    ? TreeViewStore<TSignatures>
    : TSignatures extends TreeViewAnyPluginSignature
      ? TreeViewUsedStore<TSignatures>
      : TreeViewStore<[]>;

export type TreeViewSelector<TSignatures extends DefaultSignatures, TValue> = (
  storeOrStoreValue: StoreFromSignatures<TSignatures> | StoreFromSignatures<TSignatures>['value'],
) => TValue;

export type TreeViewRawSelector<TSignatures extends DefaultSignatures, TValue> = (
  storeValue: StoreFromSignatures<TSignatures>['value'],
) => TValue;

export function createSelector<TSignatures extends DefaultSignatures, TValue>(
  selector: TreeViewRawSelector<TSignatures, TValue>,
): TreeViewSelector<TSignatures, TValue> {
  return (storeOrStoreValue) => {
    if (storeOrStoreValue instanceof TreeViewStore) {
      return selector(storeOrStoreValue.value);
    }

    return selector(storeOrStoreValue);
  };
}
