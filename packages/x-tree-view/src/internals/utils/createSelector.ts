import { TreeViewAnyPluginSignature, TreeViewUsedStore } from '../models';
import { Store } from './Store';

export type TreeViewSelector<TSignature extends TreeViewAnyPluginSignature, TValue> = (
  storeOrStoreValue: TreeViewUsedStore<TSignature> | TreeViewUsedStore<TSignature>['value'],
) => TValue;

export type TreeViewRawSelector<TSignature extends TreeViewAnyPluginSignature, TValue> = (
  storeValue: TreeViewUsedStore<TSignature>['value'],
) => TValue;

export function createSelector<TSignature extends TreeViewAnyPluginSignature, TValue>(
  selector: TreeViewRawSelector<TSignature, TValue>,
): TreeViewSelector<TSignature, TValue> {
  return (storeOrStoreValue) => {
    if (storeOrStoreValue instanceof Store) {
      return selector(storeOrStoreValue.value);
    }

    return selector(storeOrStoreValue);
  };
}
