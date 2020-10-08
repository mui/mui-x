import {ApiRef} from "../../../models/api";
import * as React from "react";
import {DEFAULT_GRID_OPTIONS, GridOptions, RowId, RowModel} from "../../../models";
import {RowsState} from "./useRowsReducer";


interface SelectedRowsState {
	selectedRows: RowId[];
}
interface HiddenRowsState {
	hiddenRows: RowId[];
}
interface PaginationState {
	pagination: any;
}
interface GridOptionsState {
	options: GridOptions;
}

export type GridState = RowsState & SelectedRowsState & HiddenRowsState & PaginationState & GridOptionsState;

const INITIAL_STATE: GridState = {
	idRowsLookup: {},
	allRows: [],
	selectedRows: [],
	hiddenRows: [],
	pagination: {},
	options: DEFAULT_GRID_OPTIONS
}

export const useGridState = (apiRef?: ApiRef): GridState => {
	if(!apiRef) {
		return INITIAL_STATE;
	}

	return apiRef.current.state;
}
