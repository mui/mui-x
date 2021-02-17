import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { BaseComponentProps } from '../../models/params/baseComponentProps';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleGridColumnsSelector } from './columns/gridColumnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedGridRowModelsSelector } from './rows/gridRowsSelector';

export const useGridBaseComponentProps = (apiRef: ApiRef | undefined) => {
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedGridRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const [state] = useGridState(apiRef!);

  const baseComponentProps: BaseComponentProps | undefined = React.useMemo(
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
