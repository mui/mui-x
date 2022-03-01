import * as React from 'react';
import { GridEvents } from '../../models/events';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';
import { useGridApiEventHandler } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export function useGridErrorHandler(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'error'>,
) {
  const handleError = React.useCallback(
    (args: any) => {
      // We are handling error here, to set up the handler as early as possible and be able to catch error thrown at init time.
      apiRef.current.setState((state) => ({ ...state, error: args }));
    },
    [apiRef],
  );

  React.useEffect(() => {
    handleError(props.error);
  }, [handleError, props.error]);

  useGridApiEventHandler(apiRef, GridEvents.componentError, handleError);
}
