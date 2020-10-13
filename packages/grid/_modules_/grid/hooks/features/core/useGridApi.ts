import * as React from "react";
import { ApiRef } from '../../../models/api/apiRef';
import { GridApi } from '../../../models/api/gridApi';
import { getInitialState } from './gridState';

export const useGridApi = (apiRef: ApiRef): GridApi => {
	React.useState(()=> {
		apiRef.current.state = getInitialState();
		return apiRef.current.state;
	});

	return apiRef.current;
}
