"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridCellAggregationResultSelector = exports.gridAggregationLookupSelector = exports.gridAggregationModelSelector = exports.gridAggregationStateSelector = void 0;
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_1 = require("@mui/x-data-grid");
exports.gridAggregationStateSelector = (0, internals_1.createRootSelector)(function (state) { return state.aggregation; });
/**
 * Get the aggregation model, containing the aggregation function of each column.
 * If a column is not in the model, it is not aggregated.
 * @category Aggregation
 */
exports.gridAggregationModelSelector = (0, internals_1.createSelector)(exports.gridAggregationStateSelector, function (aggregationState) { return aggregationState.model; });
/**
 * Get the aggregation results as a lookup.
 * @category Aggregation
 */
exports.gridAggregationLookupSelector = (0, internals_1.createSelector)(exports.gridAggregationStateSelector, function (aggregationState) { return aggregationState.lookup; });
exports.gridCellAggregationResultSelector = (0, internals_1.createSelector)(x_data_grid_1.gridRowTreeSelector, exports.gridAggregationLookupSelector, function (rowTree, aggregationLookup, _a) {
    var _b, _c;
    var id = _a.id, field = _a.field;
    var cellAggregationPosition = null;
    var rowNode = rowTree[id];
    if (!rowNode) {
        return null;
    }
    if (rowNode.type === 'group') {
        cellAggregationPosition = 'inline';
    }
    else if (id.toString().startsWith('auto-generated-group-footer-')) {
        cellAggregationPosition = 'footer';
    }
    if (cellAggregationPosition == null) {
        return null;
    }
    // TODO: Add custom root id
    var groupId = cellAggregationPosition === 'inline' ? id : ((_b = rowNode.parent) !== null && _b !== void 0 ? _b : '');
    var aggregationResult = (_c = aggregationLookup === null || aggregationLookup === void 0 ? void 0 : aggregationLookup[groupId]) === null || _c === void 0 ? void 0 : _c[field];
    if (!aggregationResult || aggregationResult.position !== cellAggregationPosition) {
        return null;
    }
    return aggregationResult;
});
