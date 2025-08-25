"use strict";
'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeaderCheckbox = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var utils_1 = require("../../hooks/features/rowSelection/utils");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var gridFocusStateSelector_1 = require("../../hooks/features/focus/gridFocusStateSelector");
var gridRowSelectionSelector_1 = require("../../hooks/features/rowSelection/gridRowSelectionSelector");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridFilterSelector_1 = require("../../hooks/features/filter/gridFilterSelector");
var gridPaginationSelector_1 = require("../../hooks/features/pagination/gridPaginationSelector");
var gridRowSelectionManager_1 = require("../../models/gridRowSelectionManager");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['checkboxInput'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridHeaderCheckbox = (0, forwardRef_1.forwardRef)(function GridHeaderCheckbox(props, ref) {
    var _a;
    var field = props.field, colDef = props.colDef, other = __rest(props, ["field", "colDef"]);
    var _b = React.useState(false), forceUpdate = _b[1];
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = { classes: rootProps.classes };
    var classes = useUtilityClasses(ownerState);
    var tabIndexState = (0, useGridSelector_1.useGridSelector)(apiRef, gridFocusStateSelector_1.gridTabIndexColumnHeaderSelector);
    var selection = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowSelectionSelector_1.gridRowSelectionStateSelector);
    var visibleRowIds = (0, useGridSelector_1.useGridSelector)(apiRef, gridFilterSelector_1.gridExpandedSortedRowIdsSelector);
    var paginatedVisibleRowIds = (0, useGridSelector_1.useGridSelector)(apiRef, gridPaginationSelector_1.gridPaginatedVisibleSortedGridRowIdsSelector);
    var filteredSelection = React.useMemo(function () {
        var isRowSelectable = rootProps.isRowSelectable;
        if (typeof isRowSelectable !== 'function') {
            return selection;
        }
        if (selection.type === 'exclude') {
            return selection;
        }
        // selection.type === 'include'
        var selectionModel = { type: 'include', ids: new Set() };
        for (var _i = 0, _a = selection.ids; _i < _a.length; _i++) {
            var id = _a[_i];
            if (rootProps.keepNonExistentRowsSelected) {
                selectionModel.ids.add(id);
            }
            // The row might have been deleted
            if (!apiRef.current.getRow(id)) {
                continue;
            }
            if (isRowSelectable(apiRef.current.getRowParams(id))) {
                selectionModel.ids.add(id);
            }
        }
        return selectionModel;
    }, [apiRef, rootProps.isRowSelectable, rootProps.keepNonExistentRowsSelected, selection]);
    // All the rows that could be selected / unselected by toggling this checkbox
    var selectionCandidates = React.useMemo(function () {
        var rowIds = !rootProps.pagination ||
            !rootProps.checkboxSelectionVisibleOnly ||
            rootProps.paginationMode === 'server'
            ? visibleRowIds
            : paginatedVisibleRowIds;
        // Convert to a Set to make O(1) checking if a row exists or not
        var candidates = new Set();
        for (var i = 0; i < rowIds.length; i += 1) {
            var id = rowIds[i];
            if (!apiRef.current.getRow(id)) {
                // The row could have been removed
                continue;
            }
            if (apiRef.current.isRowSelectable(id)) {
                candidates.add(id);
            }
        }
        return candidates;
    }, [
        apiRef,
        rootProps.pagination,
        rootProps.paginationMode,
        rootProps.checkboxSelectionVisibleOnly,
        paginatedVisibleRowIds,
        visibleRowIds,
    ]);
    // Amount of rows selected and that are visible in the current page
    var currentSelectionSize = React.useMemo(function () {
        var selectionManager = (0, gridRowSelectionManager_1.createRowSelectionManager)(filteredSelection);
        var size = 0;
        for (var _i = 0, selectionCandidates_1 = selectionCandidates; _i < selectionCandidates_1.length; _i++) {
            var id = selectionCandidates_1[_i];
            if (selectionManager.has(id)) {
                size += 1;
            }
        }
        return size;
    }, [filteredSelection, selectionCandidates]);
    var isIndeterminate = React.useMemo(function () {
        if (filteredSelection.ids.size === 0) {
            return false;
        }
        var selectionManager = (0, gridRowSelectionManager_1.createRowSelectionManager)(filteredSelection);
        for (var _i = 0, selectionCandidates_2 = selectionCandidates; _i < selectionCandidates_2.length; _i++) {
            var rowId = selectionCandidates_2[_i];
            if (!selectionManager.has(rowId)) {
                return true;
            }
        }
        return false;
    }, [filteredSelection, selectionCandidates]);
    var isChecked = currentSelectionSize > 0;
    var handleChange = function (event) {
        var params = {
            value: event.target.checked,
        };
        apiRef.current.publishEvent('headerSelectionCheckboxChange', params);
    };
    var tabIndex = tabIndexState !== null && tabIndexState.field === props.field ? 0 : -1;
    React.useLayoutEffect(function () {
        var element = apiRef.current.getColumnHeaderElement(props.field);
        if (tabIndex === 0 && element) {
            element.tabIndex = -1;
        }
    }, [tabIndex, apiRef, props.field]);
    var handleKeyDown = React.useCallback(function (event) {
        if (event.key === ' ') {
            // imperative toggle the checkbox because Space is disable by some preventDefault
            apiRef.current.publishEvent('headerSelectionCheckboxChange', {
                value: !isChecked,
            });
        }
    }, [apiRef, isChecked]);
    var handleSelectionChange = React.useCallback(function () {
        forceUpdate(function (p) { return !p; });
    }, []);
    React.useEffect(function () {
        return apiRef.current.subscribeEvent('rowSelectionChange', handleSelectionChange);
    }, [apiRef, handleSelectionChange]);
    var label = apiRef.current.getLocaleText(isChecked && !isIndeterminate
        ? 'checkboxSelectionUnselectAllRows'
        : 'checkboxSelectionSelectAllRows');
    return (<rootProps.slots.baseCheckbox indeterminate={isIndeterminate} checked={isChecked && !isIndeterminate} onChange={handleChange} className={classes.root} slotProps={{
            htmlInput: { 'aria-label': label, name: 'select_all_rows' },
        }} tabIndex={tabIndex} onKeyDown={handleKeyDown} disabled={!(0, utils_1.isMultipleRowSelectionEnabled)(rootProps)} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseCheckbox} {...other} ref={ref}/>);
});
exports.GridHeaderCheckbox = GridHeaderCheckbox;
GridHeaderCheckbox.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The column of the current header component.
     */
    colDef: prop_types_1.default.object.isRequired,
    /**
     * The column field of the column that triggered the event
     */
    field: prop_types_1.default.string.isRequired,
};
