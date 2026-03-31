/* eslint-disable import/export, @typescript-eslint/no-redeclare */
const EMPTY_RANGE = { firstRowIndex: 0, lastRowIndex: 0 };
const EMPTY_CACHES = {
    spannedCells: {},
    hiddenCells: {},
    hiddenCellOriginMap: {},
};
const selectors = {
    state: (state) => state.rowSpanning,
    hiddenCells: (state) => state.rowSpanning.caches.hiddenCells,
    spannedCells: (state) => state.rowSpanning.caches.spannedCells,
    hiddenCellsOriginMap: (state) => state.rowSpanning.caches.hiddenCellOriginMap,
};
export const Rowspan = {
    initialize: initializeState,
    use: useRowspan,
    selectors,
};
function initializeState(params) {
    return {
        rowSpanning: params.initialState?.rowSpanning ?? {
            caches: EMPTY_CACHES,
            processedRange: EMPTY_RANGE,
        },
    };
}
function useRowspan(store, _params, _api) {
    const getHiddenCellsOrigin = () => selectors.hiddenCellsOriginMap(store.state);
    return { getHiddenCellsOrigin };
}
