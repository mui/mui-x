//TODO remove undefined
import * as React from "react";
import {ApiRef} from "../../../models/api";
import {useGridState} from "./useGridState";

export const useGridSelector = (apiRef: ApiRef | undefined, selector: (state: any) => any) => {
	const [state,,] = useGridState(apiRef!)

	return selector(state);
}
