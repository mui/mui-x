import * as React from 'react';
import { useGridApiContext } from './useGridApiContext';
import { GridSlotComponentProps } from '../../models/params/gridSlotComponentProps';
import { visibleGridColumnsSelector } from '../features/columns/gridColumnsSelector';
import { useGridSelector } from './useGridSelector';
import { useGridState } from './useGridState';
import { unorderedGridRowModelsSelector } from '../features/rows/gridRowsSelector';

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
