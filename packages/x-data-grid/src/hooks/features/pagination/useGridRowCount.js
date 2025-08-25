"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowCount = void 0;
var React = require("react");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var filter_1 = require("../filter");
var utils_1 = require("../../utils");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var gridPaginationSelector_1 = require("./gridPaginationSelector");
var useGridRowCount = function (apiRef, props) {
    var _a, _b;
    var logger = (0, utils_1.useGridLogger)(apiRef, 'useGridRowCount');
    var visibleTopLevelRowCount = (0, utils_1.useGridSelector)(apiRef, filter_1.gridFilteredTopLevelRowCountSelector);
    var rowCountState = (0, utils_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginationRowCountSelector);
    var paginationMeta = (0, utils_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginationMetaSelector);
    var paginationModel = (0, utils_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginationModelSelector);
    var previousPageSize = (0, useLazyRef_1.default)(function () { return (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef).pageSize; });
    apiRef.current.registerControlState({
        stateId: 'paginationRowCount',
        propModel: props.rowCount,
        propOnChange: props.onRowCountChange,
        stateSelector: gridPaginationSelector_1.gridPaginationRowCountSelector,
        changeEvent: 'rowCountChange',
    });
    /**
     * API METHODS
     */
    var setRowCount = React.useCallback(function (newRowCount) {
        if (rowCountState === newRowCount) {
            return;
        }
        logger.debug("Setting 'rowCount' to", newRowCount);
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { rowCount: newRowCount }) })); });
    }, [apiRef, logger, rowCountState]);
    var paginationRowCountApi = {
        setRowCount: setRowCount,
    };
    (0, utils_1.useGridApiMethod)(apiRef, paginationRowCountApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b;
        var exportedRowCount = (0, gridPaginationSelector_1.gridPaginationRowCountSelector)(apiRef);
        var shouldExportRowCount = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the `rowCount` is controlled
            props.rowCount != null ||
            // Always export if the `rowCount` has been initialized
            ((_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.rowCount) != null;
        if (!shouldExportRowCount) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { pagination: __assign(__assign({}, prevState.pagination), { rowCount: exportedRowCount }) });
    }, [apiRef, props.rowCount, (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.rowCount]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a;
        var restoredRowCount = ((_a = context.stateToRestore.pagination) === null || _a === void 0 ? void 0 : _a.rowCount)
            ? context.stateToRestore.pagination.rowCount
            : (0, gridPaginationSelector_1.gridPaginationRowCountSelector)(apiRef);
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { rowCount: restoredRowCount }) })); });
        return params;
    }, [apiRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    /**
     * EVENTS
     */
    var handlePaginationModelChange = React.useCallback(function (model) {
        if (props.paginationMode === 'client' || !previousPageSize.current) {
            return;
        }
        if (model.pageSize !== previousPageSize.current) {
            previousPageSize.current = model.pageSize;
            if (rowCountState === -1) {
                // Row count unknown and page size changed, reset the page
                apiRef.current.setPage(0);
            }
        }
    }, [props.paginationMode, previousPageSize, rowCountState, apiRef]);
    (0, utils_1.useGridEvent)(apiRef, 'paginationModelChange', handlePaginationModelChange);
    /**
     * EFFECTS
     */
    React.useEffect(function () {
        if (props.paginationMode === 'client') {
            apiRef.current.setRowCount(visibleTopLevelRowCount);
        }
        else if (props.rowCount != null) {
            apiRef.current.setRowCount(props.rowCount);
        }
    }, [apiRef, props.paginationMode, visibleTopLevelRowCount, props.rowCount]);
    var isLastPage = paginationMeta.hasNextPage === false;
    React.useEffect(function () {
        if (isLastPage && rowCountState === -1) {
            apiRef.current.setRowCount(paginationModel.pageSize * paginationModel.page + visibleTopLevelRowCount);
        }
    }, [apiRef, visibleTopLevelRowCount, isLastPage, rowCountState, paginationModel]);
};
exports.useGridRowCount = useGridRowCount;
