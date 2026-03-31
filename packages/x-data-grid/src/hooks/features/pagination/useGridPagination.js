import { throwIfPageSizeExceedsTheLimit, getDefaultGridPaginationModel, } from './gridPaginationUtils';
import { useGridPaginationModel } from './useGridPaginationModel';
import { useGridRowCount } from './useGridRowCount';
import { useGridPaginationMeta } from './useGridPaginationMeta';
export const paginationStateInitializer = (state, props) => {
    const paginationModel = {
        ...getDefaultGridPaginationModel(props.autoPageSize),
        ...(props.paginationModel ?? props.initialState?.pagination?.paginationModel),
    };
    throwIfPageSizeExceedsTheLimit(paginationModel.pageSize, props.signature);
    const rowCount = props.rowCount ??
        props.initialState?.pagination?.rowCount ??
        (props.paginationMode === 'client' ? state.rows?.totalRowCount : undefined);
    const meta = props.paginationMeta ?? props.initialState?.pagination?.meta ?? {};
    return {
        ...state,
        pagination: {
            ...state.pagination,
            paginationModel,
            rowCount,
            meta,
            enabled: props.pagination === true,
            paginationMode: props.paginationMode,
        },
    };
};
/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (apiRef, props) => {
    useGridPaginationMeta(apiRef, props);
    useGridPaginationModel(apiRef, props);
    useGridRowCount(apiRef, props);
};
