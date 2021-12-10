import * as React from 'react';
import { GridEvents } from '../../models/events';
import { GridApiRef } from '../../models/api';
import { useGridState } from '../utils/useGridState';
import { useGridApiEventHandler } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export function useGridErrorHandler(
  apiRef: GridApiRef,
  props: Pick<DataGridProcessedProps, 'error'>,
) {
  const [, setGridState] = useGridState(apiRef);

  const handleError = React.useCallback(
    (args: any) => {
      // We are handling error here, to set up the handler as early as possible and be able to catch error thrown at init time.
      setGridState((state) => ({ ...state, error: args }));
    },
    [setGridState],
  );

  React.useEffect(() => {
    handleError(props.error);
  }, [handleError, props.error]);

  useGridApiEventHandler(apiRef, GridEvents.componentError, handleError);
}
