import {ApiRef, FeatureModeConstant, PageChangeParams} from "../../../models";
import {PAGE_CHANGED, PAGESIZE_CHANGED} from "../../../constants";

export type PaginationState = PageChangeParams;
const SET_PAGE_ACTION = 'SetPage';
const SET_PAGESIZE_ACTION = 'SetPageSize';
const SET_PAGINATION_MODE_ACTION = 'SetPaginationMode';
const SET_ROWCOUNT_ACTION = 'setRowCount';

// ACTION CREATORS
export function setPageActionCreator(page: any, apiRef: ApiRef) {
	return {type: SET_PAGE_ACTION, payload: {page, apiRef}};
}

export function setPageSizeActionCreator(pageSize: any, apiRef: ApiRef) {
	return {type: SET_PAGESIZE_ACTION, payload: {pageSize, apiRef}};
}

export function setPaginationModeActionCreator(paginationMode: any) {
	return {type: SET_PAGINATION_MODE_ACTION, payload: {paginationMode}};
}

export function setRowCountActionCreator(payload: { rowCount: number, totalRowCount?: number, apiRef: ApiRef }) {
	return {type: SET_ROWCOUNT_ACTION, payload};
}

// HELPERS
export const getPageCount = (pageSize: number | undefined, rowsCount: number) => {
	return pageSize && rowsCount > 0 ? Math.ceil(rowsCount / pageSize!) : 1;
};
// STATE UPDATE PURE FUNCTIONS
const setPageStateUpdate = (
	state: PaginationState,
	payload: any): PaginationState => {
	// eslint-disable-next-line prefer-const
	let {page, apiRef} = payload;
	let hasPageChanged = false;
	if (state.rowCount > 0) {
		page = state.pageCount >= page ? page : state.pageCount;
		//TODO replace with dispatch action
		apiRef.current.renderPage(
			state.paginationMode === FeatureModeConstant.client ? page : 1,
		);
		hasPageChanged = true;
	}
	const params: PageChangeParams = {
		...state,
		page,
	};
	if (hasPageChanged && state.page !== page) {
		//TODO replace with dispatch action
		apiRef.current.publishEvent(PAGE_CHANGED, params);
		// prevPageRef.current = page;
	}
	if (state.page !== page) {
		const newSte = {...state, page};
		return newSte;
	}
	return state;
}
const setPageSizeStateUpdate =
	(state: PaginationState,
	 payload: any): PaginationState => {
		// eslint-disable-next-line prefer-const
		let {pageSize, apiRef} = payload;
		if (state.pageSize === pageSize) {
			return state;
		}

		const oldPageSize = state.pageSize;
		const newPageCount = getPageCount(pageSize, state.rowCount);
		const firstRowIdx = (state.page - 1) * oldPageSize;
		let newPage = Math.floor(firstRowIdx / pageSize) + 1;
		newPage = newPage > newPageCount ? newPageCount : newPage;
		newPage = newPage < 1 ? 1 : newPage;
		// logger.info(
		//   `PageSize change to ${pageSize}, setting page to ${newPage}, total page count is ${newPageCount}`,
		// );
		let newState: PaginationState = {
			...state,
			page: newPage,
			pageCount: newPageCount,
			pageSize,
		};
		apiRef.current.publishEvent(PAGESIZE_CHANGED, newState as PageChangeParams);

		// updateState(newState);
		newState = setPageStateUpdate(newState, {page: newPage, apiRef});
		return newState;
	}
const setRowCountStateUpdate = (state, payload) => {
	const {totalRowCount, rowCount } = payload;
	// const newVisibleRowCount = apiRef.current.getRowsCount(true);
	const newRowCount = totalRowCount == null ?  rowCount : totalRowCount;

	if (newRowCount !== state.rowCount) {
		// logger.info(`Options or rows change, recalculating pageCount and rowCount`);
		const newPageCount = getPageCount(state.pageSize, newRowCount);

		const newState = {...state, pageCount: newPageCount, rowCount: newRowCount};
		return newState;
	}
	return state;
}

// REDUCER
export function paginationReducer(
	state: PaginationState = {page: 1, pageCount: 0, pageSize: 0, paginationMode:"client", rowCount: 0},
	action: { type: string; payload?: Partial<PaginationState> },
) {
	switch (action.type) {
		case SET_PAGE_ACTION:
			return setPageStateUpdate(state, action.payload);
		case SET_PAGESIZE_ACTION:
			return setPageSizeStateUpdate(state, action.payload);
		case SET_PAGINATION_MODE_ACTION:
			return {...state, ...{paginationMode: action.payload!.paginationMode!}};
		case SET_ROWCOUNT_ACTION:
			return setRowCountStateUpdate(state, action.payload);
		default:
			throw new Error(`Material-UI: Action ${action.type} not found.`);
	}
}
