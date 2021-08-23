import * as React from 'react';
import { useGridApiContext } from '../root/useGridApiContext';
import { GridSlotComponentProps } from '../../models/params/gridSlotComponentProps';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedGridRowModelsSelector } from './rows/gridRowsSelector';
import { useGridRootProps } from '../utils/useGridRootProps';

export const useGridSlotComponentProps = () => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const rows = useGridSelector(apiRef, unorderedGridRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef!);

  const slotComponentProps: GridSlotComponentProps = React.useMemo(
    () => ({
      state,
      rows,
      columns,
      rootProps,
      apiRef: apiRef!,
      rootElement: apiRef!.current.rootElementRef!,
    }),
    [state, rows, columns, rootProps, apiRef],
  );

  return slotComponentProps;
};
