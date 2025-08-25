"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPagination = GridPagination;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var prop_types_1 = require("prop-types");
var assert_1 = require("../utils/assert");
var useGridSelector_1 = require("../hooks/utils/useGridSelector");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var gridPaginationSelector_1 = require("../hooks/features/pagination/gridPaginationSelector");
var GridPaginationRoot = (0, styles_1.styled)((assert_1.NotRendered))({
    maxHeight: 'calc(100% + 1px)', // border width
    flexGrow: 1,
});
function GridPagination() {
    var _a, _b, _c;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var paginationModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginationModelSelector);
    var rowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginationRowCountSelector);
    var pageCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPageCountSelector);
    var paginationMode = rootProps.paginationMode, loading = rootProps.loading;
    var disabled = rowCount === -1 && paginationMode === 'server' && loading;
    var lastPage = React.useMemo(function () { return Math.max(0, pageCount - 1); }, [pageCount]);
    var computedPage = React.useMemo(function () {
        if (rowCount === -1) {
            return paginationModel.page;
        }
        return paginationModel.page <= lastPage ? paginationModel.page : lastPage;
    }, [lastPage, paginationModel.page, rowCount]);
    var handlePageSizeChange = React.useCallback(function (pageSize) {
        apiRef.current.setPageSize(pageSize);
    }, [apiRef]);
    var handlePageChange = React.useCallback(function (_, page) {
        apiRef.current.setPage(page);
    }, [apiRef]);
    var isPageSizeIncludedInPageSizeOptions = function (pageSize) {
        for (var i = 0; i < rootProps.pageSizeOptions.length; i += 1) {
            var option = rootProps.pageSizeOptions[i];
            if (typeof option === 'number') {
                if (option === pageSize) {
                    return true;
                }
            }
            else if (option.value === pageSize) {
                return true;
            }
        }
        return false;
    };
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var warnedOnceMissingInPageSizeOptions = React.useRef(false);
        var pageSize = (_b = (_a = rootProps.paginationModel) === null || _a === void 0 ? void 0 : _a.pageSize) !== null && _b !== void 0 ? _b : paginationModel.pageSize;
        if (!warnedOnceMissingInPageSizeOptions.current &&
            !rootProps.autoPageSize &&
            !isPageSizeIncludedInPageSizeOptions(pageSize)) {
            console.warn([
                "MUI X: The page size `".concat(paginationModel.pageSize, "` is not present in the `pageSizeOptions`."),
                "Add it to show the pagination select.",
            ].join('\n'));
            warnedOnceMissingInPageSizeOptions.current = true;
        }
    }
    var pageSizeOptions = isPageSizeIncludedInPageSizeOptions(paginationModel.pageSize)
        ? rootProps.pageSizeOptions
        : [];
    return (<GridPaginationRoot as={rootProps.slots.basePagination} count={rowCount} page={computedPage} rowsPerPageOptions={pageSizeOptions} rowsPerPage={paginationModel.pageSize} onPageChange={handlePageChange} onRowsPerPageChange={handlePageSizeChange} disabled={disabled} {...(_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.basePagination}/>);
}
GridPagination.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    component: prop_types_1.default.elementType,
};
