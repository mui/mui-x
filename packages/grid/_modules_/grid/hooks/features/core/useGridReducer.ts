import * as React from "react";
import {ApiRef} from "../../../models/api";
import {useGridApi} from "./useGridApi";

export const useGridReducer = <State, Action>(apiRef: ApiRef, stateId, reducer: React.Reducer<State, Action>, initialState: State) =>  {
	const api = useGridApi(apiRef);

	const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(reducer, initialState );

	const updateState = React.useCallback(()=> {
		const newState = {...api.state};
		newState[stateId] = {...state};
		api.state = newState;
	}, [api, state, stateId]);

	React.useEffect(()=> {
		updateState();
	}, [updateState]);

	return {state, dispatch, gridApi: api };
}
