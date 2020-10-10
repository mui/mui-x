import {ApiRef, GridApi} from "../../../models/api";
import {DEFAULT_GRID_OPTIONS, GridOptions, RowId} from "../../../models";
import {INITIAL_ROW_STATE, InternalRowsState} from "./useRowsReducer";
import {INITIAL_PAGINATION_STATE, PaginationState} from "../pagination/usePaginationReducer";

interface RowsState {
	rows: InternalRowsState;
}
interface SelectedRowsState {
	selectedRows: RowId[];
}
interface HiddenRowsState {
	hiddenRows: RowId[];
}
interface GridPaginationState {
	pagination: PaginationState;
}

interface GridOptionsState {
	options: GridOptions;
}
interface ScrollingState {
	isScrolling: boolean;
}
export type GridState = RowsState & SelectedRowsState & HiddenRowsState & GridPaginationState & GridOptionsState & ScrollingState;

const INITIAL_STATE: GridState = {
	rows: INITIAL_ROW_STATE,
	selectedRows: [],
	hiddenRows: [],
	pagination: INITIAL_PAGINATION_STATE,
	options: DEFAULT_GRID_OPTIONS,
	isScrolling: false
}

export const useGridApi = (apiRef: ApiRef): GridApi => {
	if(!apiRef.current.state) {
		apiRef.current.state = INITIAL_STATE;
	}
	return apiRef.current;
}
