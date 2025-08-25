"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPinnedRows = GridPinnedRows;
var React = require("react");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useUtilityClasses = function () {
    var slots = {
        root: ['pinnedRows'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, {});
};
function GridPinnedRows(_a) {
    var position = _a.position, virtualScroller = _a.virtualScroller;
    var classes = useUtilityClasses();
    var apiRef = (0, internals_1.useGridPrivateApiContext)();
    var pinnedRowsData = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridPinnedRowsSelector);
    var rows = pinnedRowsData[position];
    var getRows = virtualScroller.getRows;
    var pinnedRenderContext = React.useMemo(function () { return ({
        firstRowIndex: 0,
        lastRowIndex: rows.length,
        firstColumnIndex: -1,
        lastColumnIndex: -1,
    }); }, [rows]);
    if (rows.length === 0) {
        return null;
    }
    var pinnedRows = getRows({
        position: position,
        rows: rows,
        renderContext: pinnedRenderContext,
    }, (0, x_data_grid_1.gridRowTreeSelector)(apiRef));
    return (<div className={(0, clsx_1.default)(classes.root, x_data_grid_1.gridClasses["pinnedRows--".concat(position)])} role="presentation">
      {pinnedRows}
    </div>);
}
