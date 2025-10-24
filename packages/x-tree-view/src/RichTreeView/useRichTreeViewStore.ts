import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { useRtl } from '@mui/system/RtlProvider';
import { TreeViewValidItem } from '../models';
import { RichTreeViewStore, RichTreeViewParameters } from '../internals/RichTreeViewStore';

export function useRichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
>(parameters: RichTreeViewParameters<R, Multiple>) {
  const isRtl = useRtl();
  const store = useRefWithInit(() => new RichTreeViewStore(parameters, isRtl)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, isRtl),
    [store, isRtl, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
