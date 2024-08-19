import {
  TreeViewAnyPluginSignature,
  TreeViewCacheValue,
  TreeViewInstance,
  TreeViewState,
} from '../models';
import { Store } from './Store';

type TreeViewInstanceWithTypedStore<TSignatures extends readonly TreeViewAnyPluginSignature[]> =
  Omit<TreeViewInstance<TSignatures>, 'selectorsStore'> & {
    selectorsStore: Store<TreeViewState<TSignatures>, TreeViewCacheValue<TSignatures>>;
  };

export type TreeViewSelector<TSignatures extends readonly TreeViewAnyPluginSignature[], TValue> = (
  instanceOrStoreValue:
    | TreeViewInstanceWithTypedStore<TSignatures>
    | Store<TreeViewState<TSignatures>, TreeViewCacheValue<TSignatures>>['value'],
) => TValue;

export type TreeViewRawSelector<
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TValue,
> = (storeValue: {
  state: TreeViewState<TSignatures>;
  cache: TreeViewCacheValue<TSignatures>;
}) => TValue;

export function createSelector<TSignatures extends readonly TreeViewAnyPluginSignature[], TValue>(
  selector: TreeViewRawSelector<TSignatures, TValue>,
): TreeViewSelector<TSignatures, TValue> {
  return (instanceOrStore) => {
    if ('selectorsStore' in instanceOrStore) {
      return selector(instanceOrStore.selectorsStore.value);
    }
    return selector(instanceOrStore);
  };
}
