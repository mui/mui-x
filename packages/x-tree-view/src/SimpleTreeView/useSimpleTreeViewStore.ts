import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { useRtl } from '@mui/system/RtlProvider';
import { SimpleTreeViewStore, SimpleTreeViewParameters } from '../internals/SimpleTreeViewStore';

export function useSimpleTreeViewStore<Multiple extends boolean | undefined>(
  parameters: SimpleTreeViewParameters<Multiple>,
) {
  const isRtl = useRtl();
  const store = useRefWithInit(() => new SimpleTreeViewStore(parameters, isRtl)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, isRtl),
    [store, isRtl, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
