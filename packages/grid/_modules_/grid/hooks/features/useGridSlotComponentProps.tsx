import * as React from 'react';
import { useGridApiContext } from '../root/useGridApiContext';
import { GridSlotComponentProps } from '../../models/params/gridSlotComponentProps';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedGridRowModelsSelector } from './rows/gridRowsSelector';

export const useGridSlotComponentProps = () => {
  const apiRef = useGridApiContext();
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedGridRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef);

  const slotComponentProps: GridSlotComponentProps = React.useMemo(
    () => ({
      state,
      rows,
      columns,
      options,
      apiRef,
      rootElement: apiRef.current.rootElementRef!,
    }),
    [state, rows, columns, options, apiRef],
  );

  return slotComponentProps;
};
