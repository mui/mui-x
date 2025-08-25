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
exports.useGridPaginationModel = exports.getDerivedPaginationModel = void 0;
var React = require("react");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var density_1 = require("../density");
var utils_1 = require("../../utils");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var gridPaginationSelector_1 = require("./gridPaginationSelector");
var gridPaginationUtils_1 = require("./gridPaginationUtils");
var getDerivedPaginationModel = function (paginationState, signature, paginationModelProp) {
    var _a, _b;
    var paginationModel = paginationState.paginationModel;
    var rowCount = paginationState.rowCount;
    var pageSize = (_a = paginationModelProp === null || paginationModelProp === void 0 ? void 0 : paginationModelProp.pageSize) !== null && _a !== void 0 ? _a : paginationModel.pageSize;
    var page = (_b = paginationModelProp === null || paginationModelProp === void 0 ? void 0 : paginationModelProp.page) !== null && _b !== void 0 ? _b : paginationModel.page;
    var pageCount = (0, gridPaginationUtils_1.getPageCount)(rowCount, pageSize, page);
    if (paginationModelProp &&
        ((paginationModelProp === null || paginationModelProp === void 0 ? void 0 : paginationModelProp.page) !== paginationModel.page ||
            (paginationModelProp === null || paginationModelProp === void 0 ? void 0 : paginationModelProp.pageSize) !== paginationModel.pageSize)) {
        paginationModel = paginationModelProp;
    }
    var validPage = pageSize === -1 ? 0 : (0, gridPaginationUtils_1.getValidPage)(paginationModel.page, pageCount);
    if (validPage !== paginationModel.page) {
        paginationModel = __assign(__assign({}, paginationModel), { page: validPage });
    }
    (0, gridPaginationUtils_1.throwIfPageSizeExceedsTheLimit)(paginationModel.pageSize, signature);
    return paginationModel;
};
exports.getDerivedPaginationModel = getDerivedPaginationModel;
/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
var useGridPaginationModel = function (apiRef, props) {
    var _a, _b;
    var logger = (0, utils_1.useGridLogger)(apiRef, 'useGridPaginationModel');
    var densityFactor = (0, utils_1.useGridSelector)(apiRef, density_1.gridDensityFactorSelector);
    var previousFilterModel = React.useRef((0, gridFilterSelector_1.gridFilterModelSelector)(apiRef));
    var rowHeight = Math.floor(props.rowHeight * densityFactor);
    apiRef.current.registerControlState({
        stateId: 'paginationModel',
        propModel: props.paginationModel,
        propOnChange: props.onPaginationModelChange,
        stateSelector: gridPaginationSelector_1.gridPaginationModelSelector,
        changeEvent: 'paginationModelChange',
    });
    /**
     * API METHODS
     */
    var setPage = React.useCallback(function (page) {
        var currentModel = (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        if (page === currentModel.page) {
            return;
        }
        logger.debug("Setting page to ".concat(page));
        apiRef.current.setPaginationModel({ page: page, pageSize: currentModel.pageSize });
    }, [apiRef, logger]);
    var setPageSize = React.useCallback(function (pageSize) {
        var currentModel = (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        if (pageSize === currentModel.pageSize) {
            return;
        }
        logger.debug("Setting page size to ".concat(pageSize));
        apiRef.current.setPaginationModel({ pageSize: pageSize, page: currentModel.page });
    }, [apiRef, logger]);
    var setPaginationModel = React.useCallback(function (paginationModel) {
        var currentModel = (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        if (paginationModel === currentModel) {
            return;
        }
        logger.debug("Setting 'paginationModel' to", paginationModel);
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { paginationModel: (0, exports.getDerivedPaginationModel)(state.pagination, props.signature, paginationModel) }) })); }, 'setPaginationModel');
    }, [apiRef, logger, props.signature]);
    var paginationModelApi = {
        setPage: setPage,
        setPageSize: setPageSize,
        setPaginationModel: setPaginationModel,
    };
    (0, utils_1.useGridApiMethod)(apiRef, paginationModelApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b;
        var paginationModel = (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        var shouldExportPaginationModel = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the `paginationModel` is controlled
            props.paginationModel != null ||
            // Always export if the `paginationModel` has been initialized
            ((_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.paginationModel) != null ||
            // Export if `page` or `pageSize` is not equal to the default value
            (paginationModel.page !== 0 &&
                paginationModel.pageSize !== (0, gridPaginationUtils_1.defaultPageSize)(props.autoPageSize));
        if (!shouldExportPaginationModel) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { pagination: __assign(__assign({}, prevState.pagination), { paginationModel: paginationModel }) });
    }, [
        apiRef,
        props.paginationModel,
        (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.paginationModel,
        props.autoPageSize,
    ]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a, _b;
        var paginationModel = ((_a = context.stateToRestore.pagination) === null || _a === void 0 ? void 0 : _a.paginationModel)
            ? __assign(__assign({}, (0, gridPaginationUtils_1.getDefaultGridPaginationModel)(props.autoPageSize)), (_b = context.stateToRestore.pagination) === null || _b === void 0 ? void 0 : _b.paginationModel) : (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { paginationModel: (0, exports.getDerivedPaginationModel)(state.pagination, props.signature, paginationModel) }) })); }, 'stateRestorePreProcessing');
        return params;
    }, [apiRef, props.autoPageSize, props.signature]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    /**
     * EVENTS
     */
    var handlePaginationModelChange = function () {
        var _a;
        var paginationModel = (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        if ((_a = apiRef.current.virtualScrollerRef) === null || _a === void 0 ? void 0 : _a.current) {
            apiRef.current.scrollToIndexes({
                rowIndex: paginationModel.page * paginationModel.pageSize,
            });
        }
    };
    var handleUpdateAutoPageSize = React.useCallback(function () {
        if (!props.autoPageSize) {
            return;
        }
        var dimensions = apiRef.current.getRootDimensions();
        var maximumPageSizeWithoutScrollBar = Math.max(1, Math.floor(dimensions.viewportInnerSize.height / rowHeight));
        apiRef.current.setPageSize(maximumPageSizeWithoutScrollBar);
    }, [apiRef, props.autoPageSize, rowHeight]);
    var handleRowCountChange = React.useCallback(function (newRowCount) {
        if (newRowCount == null) {
            return;
        }
        var paginationModel = (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        if (paginationModel.page === 0) {
            return;
        }
        var pageCount = (0, gridPaginationSelector_1.gridPageCountSelector)(apiRef);
        if (paginationModel.page > pageCount - 1) {
            apiRef.current.setPage(Math.max(0, pageCount - 1));
        }
    }, [apiRef]);
    /**
     * Goes to the first row of the grid
     */
    var navigateToStart = React.useCallback(function () {
        var paginationModel = (0, gridPaginationSelector_1.gridPaginationModelSelector)(apiRef);
        if (paginationModel.page !== 0) {
            apiRef.current.setPage(0);
        }
        // If the page was not changed it might be needed to scroll to the top
        var scrollPosition = apiRef.current.getScrollPosition();
        if (scrollPosition.top !== 0) {
            apiRef.current.scroll({ top: 0 });
        }
    }, [apiRef]);
    /**
     * Resets the page only if the active items or quick filter has changed from the last time.
     * This is to avoid resetting the page when the filter model is changed
     * because of and update of the operator from an item that does not have the value
     * or reseting when the filter panel is just opened
     */
    var handleFilterModelChange = React.useCallback(function (filterModel) {
        var currentActiveFilters = __assign(__assign({}, filterModel), { 
            // replace items with the active items
            items: (0, gridFilterSelector_1.gridFilterActiveItemsSelector)(apiRef) });
        if ((0, isDeepEqual_1.isDeepEqual)(currentActiveFilters, previousFilterModel.current)) {
            return;
        }
        previousFilterModel.current = currentActiveFilters;
        navigateToStart();
    }, [apiRef, navigateToStart]);
    (0, utils_1.useGridEvent)(apiRef, 'viewportInnerSizeChange', handleUpdateAutoPageSize);
    (0, utils_1.useGridEvent)(apiRef, 'paginationModelChange', handlePaginationModelChange);
    (0, utils_1.useGridEvent)(apiRef, 'rowCountChange', handleRowCountChange);
    (0, utils_1.useGridEvent)(apiRef, 'sortModelChange', navigateToStart);
    (0, utils_1.useGridEvent)(apiRef, 'filterModelChange', handleFilterModelChange);
    /**
     * EFFECTS
     */
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!props.pagination) {
            return;
        }
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { paginationModel: (0, exports.getDerivedPaginationModel)(state.pagination, props.signature, props.paginationModel) }) })); });
    }, [apiRef, props.paginationModel, props.signature, props.pagination]);
    React.useEffect(function () {
        apiRef.current.setState(function (state) {
            var isEnabled = props.pagination === true;
            if (state.pagination.paginationMode === props.paginationMode &&
                state.pagination.enabled === isEnabled) {
                return state;
            }
            return __assign(__assign({}, state), { pagination: __assign(__assign({}, state.pagination), { paginationMode: props.paginationMode, enabled: isEnabled }) });
        });
    }, [apiRef, props.paginationMode, props.pagination]);
    React.useEffect(handleUpdateAutoPageSize, [handleUpdateAutoPageSize]);
};
exports.useGridPaginationModel = useGridPaginationModel;
