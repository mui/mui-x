import * as React from 'react';
import type { GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Usage:
 * - Set `debug` prop to `true`
 * - Find the root HTML element (`.MuiDataGrid-root`) in dev tools and select it.
 * - Type `$0.apiRef` in the console to access the `apiRef`.
 */
export const useDebugMode = ({
  rootContainerEl,
  apiRef,
  enabled,
}: {
  rootContainerEl?: HTMLElement | null;
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>;
  enabled: boolean;
}) => {
  React.useEffect(() => {
    if (enabled && rootContainerEl) {
      // @ts-ignore
      rootContainerEl.apiRef = apiRef;
    }
  }, [
    rootContainerEl,
    apiRef,
    // @ts-ignore
    enabled,
  ]);
};
