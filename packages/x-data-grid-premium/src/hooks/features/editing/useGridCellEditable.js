"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsCellEditable = void 0;
var React = require("react");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridAggregationSelectors_1 = require("../aggregation/gridAggregationSelectors");
/**
 * Implementation of the cell editable condition hook of the Data Grid Premium
 */
var useIsCellEditable = function (apiRef, props) {
    var isCellEditableCommunity = (0, internals_1.useIsCellEditable)();
    return React.useCallback(function (params) {
        var isCellEditable = isCellEditableCommunity(params);
        // If the cell is not editable by the community hook, return false immediately
        if (!isCellEditable) {
            return false;
        }
        // If the data source is not used or aggregation is disabled or both tree data and row grouping are disabled, return the community hook result
        if (!props.dataSource ||
            props.disableAggregation ||
            (!props.treeData && props.disableRowGrouping)) {
            return isCellEditable;
        }
        // If the cell is not a part of the aggregation model, return the community hook result
        var aggregationModelFields = Object.keys((0, gridAggregationSelectors_1.gridAggregationModelSelector)(apiRef));
        if (!aggregationModelFields.includes(params.field)) {
            return isCellEditable;
        }
        // The cell is a part of the aggregation model and it is retrieved from the server-side data.
        // Allow editing only for the non-grouped rows.
        return params.rowNode.type !== 'group';
    }, [
        apiRef,
        props.dataSource,
        props.treeData,
        props.disableAggregation,
        props.disableRowGrouping,
        isCellEditableCommunity,
    ]);
};
exports.useIsCellEditable = useIsCellEditable;
