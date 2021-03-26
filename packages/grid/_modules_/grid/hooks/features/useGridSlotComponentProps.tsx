import * as React from 'react';
import { GridApiContext } from '../../components/GridApiContext';
import { GridSlotComponentProps } from '../../models/params/gridSlotComponentProps';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedGridRowModelsSelector } from './rows/gridRowsSelector';

export const useGridSlotComponentProps = () => {
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedGridRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef!);

  const slotComponentProps: GridSlotComponentProps = React.useMemo(
    () => ({
      state,
      rows,
      columns,
      options,
      apiRef: apiRef!,
      rootElement: apiRef!.current.rootElementRef!,
    }),
    [state, rows, columns, options, apiRef],
  );

  return slotComponentProps;
};
