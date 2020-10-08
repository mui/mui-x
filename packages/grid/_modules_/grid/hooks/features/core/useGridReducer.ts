import {ApiRef} from "../../../models/api";
import * as React from "react";
import {useGridState} from "./useGridState";

export const useGridSelector = (apiRef: ApiRef | undefined, selector: (state: any)=> any) => {
	const state = useGridState(apiRef)

	// TODO: introduce reselect instead of memoizing here
	const selectorResult = React.useMemo(()=> {
		return selector(state);
	}, [selector, state]);

	return selectorResult;
}

export const useGridReducer = <T>(apiRef: ApiRef, stateId, reducer, initialState) =>  {
	if(!apiRef.current.state) {
		apiRef.current.state = {};
	}
	//TODO fix types with generics
	const [state, dispatch] = React.useReducer(reducer, initialState);

	const updateState = React.useCallback(()=> {
		const newState = {...apiRef.current.state};
		newState[stateId] = state;
		apiRef.current.state = newState;
	}, [apiRef, state, stateId]);

	React.useEffect(()=> {
		updateState();
	}, [updateState]);

	return [state as T, dispatch, apiRef.current.state ];
}
