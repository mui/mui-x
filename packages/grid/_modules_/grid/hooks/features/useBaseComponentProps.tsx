import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { BaseComponentProps } from '../../models/params/baseComponentProps';
import { optionsSelector } from '../utils/optionsSelector';
import { visibleColumnsSelector } from './columns/columnsSelector';
import { useGridSelector } from './core/useGridSelector';
import { useGridState } from './core/useGridState';
import { unorderedRowModelsSelector } from './rows/rowsSelector';

export const useBaseComponentProps = (apiRef: ApiRef | undefined) => {
  const options = useGridSelector(apiRef, optionsSelector);
  const rows = useGridSelector(apiRef, unorderedRowModelsSelector);
  const columns = useGridSelector(apiRef, visibleColumnsSelector);
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
