"use strict";
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
exports.useGridColumnMenu = exports.columnMenuStateInitializer = void 0;
var React = require("react");
var utils_1 = require("../../utils");
var columnMenuSelector_1 = require("./columnMenuSelector");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var columnMenuStateInitializer = function (state) { return (__assign(__assign({}, state), { columnMenu: { open: false } })); };
exports.columnMenuStateInitializer = columnMenuStateInitializer;
/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
var useGridColumnMenu = function (apiRef) {
    var logger = (0, utils_1.useGridLogger)(apiRef, 'useGridColumnMenu');
    /**
     * API METHODS
     */
    var showColumnMenu = React.useCallback(function (field) {
        var columnMenuState = (0, columnMenuSelector_1.gridColumnMenuSelector)(apiRef);
        var newState = { open: true, field: field };
        var shouldUpdate = newState.open !== columnMenuState.open || newState.field !== columnMenuState.field;
        if (shouldUpdate) {
            apiRef.current.setState(function (state) {
                if (state.columnMenu.open && state.columnMenu.field === field) {
                    return state;
                }
                logger.debug('Opening Column Menu');
                return __assign(__assign({}, state), { columnMenu: { open: true, field: field } });
            });
            apiRef.current.hidePreferences();
        }
    }, [apiRef, logger]);
    var hideColumnMenu = React.useCallback(function () {
        var columnMenuState = (0, columnMenuSelector_1.gridColumnMenuSelector)(apiRef);
        if (columnMenuState.field) {
            var columnLookup = (0, gridColumnsSelector_1.gridColumnLookupSelector)(apiRef);
            var columnVisibilityModel_1 = (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef);
            var orderedFields = (0, gridColumnsSelector_1.gridColumnFieldsSelector)(apiRef);
            var fieldToFocus_1 = columnMenuState.field;
            // If the column was removed from the grid, we need to find the closest visible field
            if (!columnLookup[fieldToFocus_1]) {
                fieldToFocus_1 = orderedFields[0];
            }
            // If the field to focus is hidden, we need to find the closest visible field
            if (columnVisibilityModel_1[fieldToFocus_1] === false) {
                // contains visible column fields + the field that was just hidden
                var visibleOrderedFields = orderedFields.filter(function (field) {
                    if (field === fieldToFocus_1) {
                        return true;
                    }
                    return columnVisibilityModel_1[field] !== false;
                });
                var fieldIndex = visibleOrderedFields.indexOf(fieldToFocus_1);
                fieldToFocus_1 = visibleOrderedFields[fieldIndex + 1] || visibleOrderedFields[fieldIndex - 1];
            }
            apiRef.current.setColumnHeaderFocus(fieldToFocus_1);
        }
        var newState = { open: false, field: undefined };
        var shouldUpdate = newState.open !== columnMenuState.open || newState.field !== columnMenuState.field;
        if (shouldUpdate) {
            apiRef.current.setState(function (state) {
                logger.debug('Hiding Column Menu');
                return __assign(__assign({}, state), { columnMenu: newState });
            });
        }
    }, [apiRef, logger]);
    var toggleColumnMenu = React.useCallback(function (field) {
        logger.debug('Toggle Column Menu');
        var columnMenu = (0, columnMenuSelector_1.gridColumnMenuSelector)(apiRef);
        if (!columnMenu.open || columnMenu.field !== field) {
            showColumnMenu(field);
        }
        else {
            hideColumnMenu();
        }
    }, [apiRef, logger, showColumnMenu, hideColumnMenu]);
    var columnMenuApi = {
        showColumnMenu: showColumnMenu,
        hideColumnMenu: hideColumnMenu,
        toggleColumnMenu: toggleColumnMenu,
    };
    (0, utils_1.useGridApiMethod)(apiRef, columnMenuApi, 'public');
    (0, utils_1.useGridEvent)(apiRef, 'columnResizeStart', hideColumnMenu);
    (0, utils_1.useGridEvent)(apiRef, 'virtualScrollerWheel', apiRef.current.hideColumnMenu);
    (0, utils_1.useGridEvent)(apiRef, 'virtualScrollerTouchMove', apiRef.current.hideColumnMenu);
};
exports.useGridColumnMenu = useGridColumnMenu;
