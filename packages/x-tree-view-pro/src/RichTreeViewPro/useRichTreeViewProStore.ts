import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { useRtl } from '@mui/system/RtlProvider';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import { RichTreeViewProStore, RichTreeViewProParameters } from '../internals/RichTreeViewProStore';

export function useRichTreeViewProStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
>(parameters: RichTreeViewProParameters<R, Multiple>) {
  const isRtl = useRtl();
  const store = useRefWithInit(() => new RichTreeViewProStore(parameters, isRtl)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, isRtl),
    [store, isRtl, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
