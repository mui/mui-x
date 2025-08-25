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
exports.useGridPaginationMeta = void 0;
var React = require("react");
var utils_1 = require("../../utils");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var gridPaginationSelector_1 = require("./gridPaginationSelector");
var useGridPaginationMeta = function (apiRef, props) {
    var _a, _b;
    var logger = (0, utils_1.useGridLogger)(apiRef, 'useGridPaginationMeta');
    var paginationMeta = (0, utils_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginationMetaSelector);
    apiRef.current.registerControlState({
        stateId: 'paginationMeta',
        propModel: props.paginationMeta,
        propOnChange: props.onPaginationMetaChange,
        stateSelector: gridPaginationSelector_1.gridPaginationMetaSelector,
        changeEvent: 'paginationMetaChange',
    });
    /**
     * API METHODS
     */
    var setPaginationMeta = React.useCallback(function (newPaginationMeta) {
        if (paginationMeta === newPaginationMeta) {
            return;
        }
        logger.debug("Setting 'paginationMeta' to", newPaginationMeta);
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { meta: newPaginationMeta }) })); });
    }, [apiRef, logger, paginationMeta]);
    var paginationMetaApi = {
        setPaginationMeta: setPaginationMeta,
    };
    (0, utils_1.useGridApiMethod)(apiRef, paginationMetaApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b;
        var exportedPaginationMeta = (0, gridPaginationSelector_1.gridPaginationMetaSelector)(apiRef);
        var shouldExportRowCount = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the `paginationMeta` is controlled
            props.paginationMeta != null ||
            // Always export if the `paginationMeta` has been initialized
            ((_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.meta) != null;
        if (!shouldExportRowCount) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { pagination: __assign(__assign({}, prevState.pagination), { meta: exportedPaginationMeta }) });
    }, [apiRef, props.paginationMeta, (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.meta]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a;
        var restoredPaginationMeta = ((_a = context.stateToRestore.pagination) === null || _a === void 0 ? void 0 : _a.meta)
            ? context.stateToRestore.pagination.meta
            : (0, gridPaginationSelector_1.gridPaginationMetaSelector)(apiRef);
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { meta: restoredPaginationMeta }) })); });
        return params;
    }, [apiRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    /**
     * EFFECTS
     */
    React.useEffect(function () {
        if (props.paginationMeta) {
            apiRef.current.setPaginationMeta(props.paginationMeta);
        }
    }, [apiRef, props.paginationMeta]);
};
exports.useGridPaginationMeta = useGridPaginationMeta;
