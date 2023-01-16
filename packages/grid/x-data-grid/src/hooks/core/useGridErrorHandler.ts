import * as React from 'react';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import type { GridCoreApi } from '../../models';

export function useGridErrorHandler(
  apiRef: React.MutableRefObject<GridPrivateApiCommon>,
  props: Pick<DataGridProcessedProps, 'error'>,
) {
  const showError = React.useCallback<GridCoreApi['showError']>(
    (args) => {
      apiRef.current.setState((state) => ({ ...state, error: args }));
    },
    [apiRef],
  );

  React.useEffect(() => {
    if (props.error) {
      showError(props.error);
    } else {
      showError(null);
    }
  }, [showError, props.error]);

  useGridApiMethod(apiRef, { showError }, 'public');
}
