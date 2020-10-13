import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { useRafUpdate } from '../../utils/useRafUpdate';
import { GridState } from './gridState';
import { useGridApi } from './useGridApi';

export const useGridState = (
  apiRef: ApiRef,
): [GridState, (stateUpdaterFn: (oldState: GridState) => GridState) => void, () => void] => {
  const api = useGridApi(apiRef);
  const [, forceUpdate] = React.useState();
  const [rafUpdate] = useRafUpdate(() => forceUpdate((p: any) => !p));

  const setGridState = React.useCallback(
    (stateUpdaterFn: (oldState: GridState) => GridState) => {
      api.state = stateUpdaterFn(api.state);
    },
    [api],
  );

  return [api.state, setGridState, rafUpdate];
};
