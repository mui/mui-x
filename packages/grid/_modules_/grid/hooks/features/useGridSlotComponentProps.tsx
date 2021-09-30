import * as React from 'react';
import { useGridApiContext } from '../root/useGridApiContext';
import { GridSlotComponentProps } from '../../models/params/gridSlotComponentProps';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';

export const useGridSlotComponentProps = () => {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef);

  return React.useMemo<GridSlotComponentProps>(
    () => ({
      state,
      columns,
      apiRef,
      rootElement: apiRef.current.rootElementRef!,
    }),
    [state, columns, apiRef],
  );
};
