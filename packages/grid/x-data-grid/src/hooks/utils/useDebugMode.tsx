import * as React from 'react';
import type { GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Usage:
 * - Set the `debug` prop to `true`.
 * - In the dev tools, select the root HTML element (`.MuiDataGrid-root`).
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
      rootContainerEl.apiRef = {
        current: apiRef.current.getPublicApi(),
      };
    }
  }, [
    rootContainerEl,
    apiRef,
    // @ts-ignore
    enabled,
  ]);
};
