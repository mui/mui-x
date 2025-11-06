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
exports.useGridHeaderFiltering = exports.headerFilteringStateInitializer = void 0;
var React = require("react");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var utils_1 = require("../../utils");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var headerFilteringStateInitializer = function (state, props) {
    var _a;
    return (__assign(__assign({}, state), { headerFiltering: { enabled: (_a = props.headerFilters) !== null && _a !== void 0 ? _a : false, editing: null, menuOpen: null } }));
};
exports.headerFilteringStateInitializer = headerFilteringStateInitializer;
var useGridHeaderFiltering = function (apiRef, props) {
    var logger = (0, utils_1.useGridLogger)(apiRef, 'useGridHeaderFiltering');
    var setHeaderFilterState = React.useCallback(function (headerFilterState) {
        apiRef.current.setState(function (state) {
            var _a, _b, _c;
            // Safety check to avoid MIT users from using it
            // This hook should ultimately be moved to the Pro package
            if (props.signature === 'DataGrid') {
                return state;
            }
            return __assign(__assign({}, state), { headerFiltering: {
                    enabled: (_a = props.headerFilters) !== null && _a !== void 0 ? _a : false,
                    editing: (_b = headerFilterState.editing) !== null && _b !== void 0 ? _b : null,
                    menuOpen: (_c = headerFilterState.menuOpen) !== null && _c !== void 0 ? _c : null,
                } });
        });
    }, [apiRef, props.signature, props.headerFilters]);
    var startHeaderFilterEditMode = React.useCallback(function (field) {
        logger.debug("Starting edit mode on header filter for field: ".concat(field));
        apiRef.current.setHeaderFilterState({ editing: field });
    }, [apiRef, logger]);
    var stopHeaderFilterEditMode = React.useCallback(function () {
        logger.debug("Stopping edit mode on header filter");
        apiRef.current.setHeaderFilterState({ editing: null });
    }, [apiRef, logger]);
    var showHeaderFilterMenu = React.useCallback(function (field) {
        logger.debug("Opening header filter menu for field: ".concat(field));
        apiRef.current.setHeaderFilterState({ menuOpen: field });
    }, [apiRef, logger]);
    var hideHeaderFilterMenu = React.useCallback(function () {
        logger.debug("Hiding header filter menu for active field");
        var fieldToFocus = apiRef.current.state.headerFiltering.menuOpen;
        if (fieldToFocus) {
            var columnLookup = (0, gridColumnsSelector_1.gridColumnLookupSelector)(apiRef);
            var columnVisibilityModel_1 = (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef);
            var orderedFields = (0, gridColumnsSelector_1.gridColumnFieldsSelector)(apiRef);
            // If the column was removed from the grid, we need to find the closest visible field
            if (!columnLookup[fieldToFocus]) {
                fieldToFocus = orderedFields[0];
            }
            // If the field to focus is hidden, we need to find the closest visible field
            if (columnVisibilityModel_1[fieldToFocus] === false) {
                // contains visible column fields + the field that was just hidden
                var visibleOrderedFields = orderedFields.filter(function (field) {
                    if (field === fieldToFocus) {
                        return true;
                    }
                    return columnVisibilityModel_1[field] !== false;
                });
                var fieldIndex = visibleOrderedFields.indexOf(fieldToFocus);
                fieldToFocus = visibleOrderedFields[fieldIndex + 1] || visibleOrderedFields[fieldIndex - 1];
            }
            apiRef.current.setHeaderFilterState({ menuOpen: null });
            apiRef.current.setColumnHeaderFilterFocus(fieldToFocus);
        }
    }, [apiRef, logger]);
    var headerFilterPrivateApi = {
        setHeaderFilterState: setHeaderFilterState,
    };
    var headerFilterApi = {
        startHeaderFilterEditMode: startHeaderFilterEditMode,
        stopHeaderFilterEditMode: stopHeaderFilterEditMode,
        showHeaderFilterMenu: showHeaderFilterMenu,
        hideHeaderFilterMenu: hideHeaderFilterMenu,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, headerFilterApi, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, headerFilterPrivateApi, 'private');
    /*
     * EFFECTS
     */
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        var _a;
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else {
            apiRef.current.setHeaderFilterState({ enabled: (_a = props.headerFilters) !== null && _a !== void 0 ? _a : false });
        }
    }, [apiRef, props.headerFilters]);
};
exports.useGridHeaderFiltering = useGridHeaderFiltering;
