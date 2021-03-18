import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridBaseComponentProps } from '../../models/params/gridBaseComponentProps';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedGridRowModelsSelector } from './rows/gridRowsSelector';

export const useGridBaseComponentProps = (apiRef: GridApiRef | undefined) => {
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedGridRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef!);

  const baseComponentProps: GridBaseComponentProps | undefined = React.useMemo(
    () =>
      apiRef && {
        state,
        rows,
        columns,
        options,
        api: apiRef,
        rootElement: apiRef.current.rootElementRef!,
      },
    [state, rows, columns, options, apiRef],
  );

  return baseComponentProps;
};
