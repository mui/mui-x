import { useEffect, useRef } from 'react';
import * as React from "react";
import { ApiRef } from '../../../models/api/apiRef';
import { useRafUpdate } from '../../utils/useRafUpdate';
import { useGridApi } from './useGridApi';
import { useGridState } from './useGridState';

export const useGridReducer = <State, Action>(apiRef: ApiRef, stateId, reducer: React.Reducer<State, Action>, initialState: State) =>  {
	const api = useGridApi(apiRef);

	// const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(reducer, initialState );

	// React.useEffect(()=> {
	// 	const newState = {...api.state};
	// 	newState[stateId] = {...state};
	// 	api.state = newState;
	// }, [api, state, stateId]);

	const [gridState, setGridState, forceUpdate ] = useGridState(apiRef);


	// const [rafDispatch] = useRafUpdate((action: Action) =>  dispatch(action));

	// return {state, dispatch: rafDispatch, gridApi: api };

	const gridDispatch = React.useCallback((action: Action)=> {
		if(gridState[stateId] === undefined) {
			gridState[stateId] = initialState;
		}
		const newLocalState = reducer(gridState[stateId], action);
		setGridState(oldState => {
			const updatingState: any = {};
			updatingState[stateId] = {...newLocalState};

			return {...oldState, ...updatingState};

			// oldState[stateId] = {...newLocalState};
			// return oldState;
		})
		forceUpdate();
	}, [forceUpdate, gridState, initialState, reducer, setGridState, stateId]);

	const dispatchRef = useRef(gridDispatch);

	useEffect(()=> {
		dispatchRef.current = gridDispatch;
	}, [gridDispatch]);

	const dispatch = React.useCallback((args)=> dispatchRef.current(args), []);

	return {gridState, dispatch, gridApi: api };
}
