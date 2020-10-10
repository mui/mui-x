import {ApiRef, FeatureMode, FeatureModeConstant, PageChangeParams} from "../../../models";
import {PAGE_CHANGED, PAGESIZE_CHANGED} from "../../../constants";

export interface PaginationState {
	page: number;
	pageCount: number;
	pageSize: number;
	rowCount: number;
	paginationMode: FeatureMode;
}

const SET_PAGE_ACTION = 'SetPage';
const SET_PAGESIZE_ACTION = 'SetPageSize';
const SET_PAGINATION_MODE_ACTION = 'SetPaginationMode';
const SET_ROWCOUNT_ACTION = 'setRowCount';

type SetPageAction = {type: 'SetPage', payload: {page: number, apiRef: ApiRef}}
type SetPageSizeAction = {type: 'SetPageSize', payload: {pageSize: number, apiRef: ApiRef}}
type SetPaginationModeAction = {type: 'SetPaginationMode', payload: {paginationMode: FeatureMode}}
type SetRowCountAction = {type: 'setRowCount', payload: { totalRowCount: number }}

export type PaginationActions = SetPageAction | SetPageSizeAction | SetPaginationModeAction | SetRowCountAction;

// ACTION CREATORS
export function setPageActionCreator(page: any, apiRef: ApiRef):SetPageAction  {
	return {type: SET_PAGE_ACTION, payload: {page, apiRef}};
}

export function setPageSizeActionCreator(pageSize: any, apiRef: ApiRef): SetPageSizeAction {
	return {type: SET_PAGESIZE_ACTION, payload: {pageSize, apiRef}};
}

export function setPaginationModeActionCreator(paginationMode: any): SetPaginationModeAction {
	return {type: SET_PAGINATION_MODE_ACTION, payload: {paginationMode}};
}

export function setRowCountActionCreator(payload: {totalRowCount: number}): SetRowCountAction {
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

const setRowCountStateUpdate = (state, payload): PaginationState => {
	const {totalRowCount} = payload;
	if (state.rowCount !== totalRowCount) {
		const newPageCount = getPageCount(state.pageSize, totalRowCount);
		return {...state, pageCount: newPageCount, rowCount: totalRowCount};
	}
	return state;
}

export const INITIAL_PAGINATION_STATE: PaginationState = {page: 1, pageCount: 0, pageSize: 0, paginationMode:"client", rowCount: 0}

// REDUCER
export const paginationReducer = (
	state: PaginationState = INITIAL_PAGINATION_STATE,
	action: PaginationActions
) => {
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
			throw new Error(`Material-UI: Action not found - ${JSON.stringify(action)}`);
	}
}
