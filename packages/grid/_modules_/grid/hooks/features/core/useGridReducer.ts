import { useEffect, useRef } from 'react';
import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { useGridApi } from './useGridApi';
import { useGridState } from './useGridState';

export const useGridReducer = <State, Action>(
  apiRef: ApiRef,
  stateId,
  reducer: React.Reducer<State, Action>,
  initialState: State,
) => {
  const api = useGridApi(apiRef);
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const gridDispatch = React.useCallback(
    (action: Action) => {
      if (gridState[stateId] === undefined) {
        gridState[stateId] = initialState;
      }
      const newLocalState = reducer(api.state[stateId], action);
      setGridState((oldState) => {
        const updatingState: any = {};
        updatingState[stateId] = { ...newLocalState };

        oldState = { ...oldState, ...updatingState };
        return oldState;
      });
      forceUpdate();
    },
    [api, forceUpdate, gridState, initialState, reducer, setGridState, stateId],
  );

  const dispatchRef = useRef(gridDispatch);

  useEffect(() => {
    dispatchRef.current = gridDispatch;
  }, [gridDispatch]);

  const dispatch = React.useCallback((args) => dispatchRef.current(args), []);

  return { gridState, dispatch, gridApi: api };
};
