import * as React from 'react';
import { useGridApiContext } from '../root/useGridApiContext';
import { GridSlotComponentProps } from '../../models/params/gridSlotComponentProps';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedGridRowModelsSelector } from './rows/gridRowsSelector';

export const useGridSlotComponentProps = () => {
  const apiRef = useGridApiContext();
  const rows = useGridSelector(apiRef, unorderedGridRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef);

  return React.useMemo<GridSlotComponentProps>(
    () => ({
      state,
      rows,
      columns,
      apiRef,
      rootElement: apiRef.current.rootElementRef!,
    }),
    [state, rows, columns, apiRef],
  );
};
