"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFooter = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridSelector_1 = require("../hooks/utils/useGridSelector");
var gridRowsSelector_1 = require("../hooks/features/rows/gridRowsSelector");
var gridRowSelectionSelector_1 = require("../hooks/features/rowSelection/gridRowSelectionSelector");
var gridFilterSelector_1 = require("../hooks/features/filter/gridFilterSelector");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridSelectedRowCount_1 = require("./GridSelectedRowCount");
var GridFooterContainer_1 = require("./containers/GridFooterContainer");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridFooter = (0, forwardRef_1.forwardRef)(function GridFooter(props, ref) {
    var _a, _b;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var totalTopLevelRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridTopLevelRowCountSelector);
    var selectedRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowSelectionSelector_1.gridRowSelectionCountSelector);
    var visibleTopLevelRowCount = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridFilteredTopLevelRowCountSelector);
    var selectedRowCountElement = !rootProps.hideFooterSelectedRowCount && selectedRowCount > 0 ? (<GridSelectedRowCount_1.GridSelectedRowCount selectedRowCount={selectedRowCount}/>) : (<div />);
    var rowCountElement = !rootProps.hideFooterRowCount && !rootProps.pagination ? (<rootProps.slots.footerRowCount {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.footerRowCount} rowCount={totalTopLevelRowCount} visibleRowCount={visibleTopLevelRowCount}/>) : null;
    var paginationElement = rootProps.pagination &&
        !rootProps.hideFooterPagination &&
        rootProps.slots.pagination && (<rootProps.slots.pagination {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.pagination}/>);
    return (<GridFooterContainer_1.GridFooterContainer {...props} ref={ref}>
        {selectedRowCountElement}
        {rowCountElement}
        {paginationElement}
      </GridFooterContainer_1.GridFooterContainer>);
});
exports.GridFooter = GridFooter;
GridFooter.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
