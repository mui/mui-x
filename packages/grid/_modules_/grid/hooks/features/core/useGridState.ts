import { ApiRef } from "../../../models/api";
import { GridState, useGridApi } from "./useGridApi";
import * as React from "react";

export const useGridState = (apiRef: ApiRef): [GridState, (state: Partial<GridState>)=> void, React.Dispatch<any>] => {
	const api = useGridApi(apiRef);
	const [, forceUpdate] = React.useState();

	const updateState = React.useCallback((state: Partial<GridState>)=> {
		const newState = {...api.state, ...state};
		api.state = newState;
	}, [api]);

	return [api.state, updateState, forceUpdate];
}
