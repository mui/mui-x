"use strict";
/* eslint-disable @typescript-eslint/no-use-before-define */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnsManagement = GridColumnsManagement;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var debounce_1 = require("@mui/utils/debounce");
var styles_1 = require("@mui/material/styles");
var InputBase_1 = require("@mui/material/InputBase");
var cssVariables_1 = require("../../constants/cssVariables");
var gridColumnsSelector_1 = require("../../hooks/features/columns/gridColumnsSelector");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var utils_1 = require("./utils");
var assert_1 = require("../../utils/assert");
var GridShadowScrollArea_1 = require("../GridShadowScrollArea");
var gridPivotingSelectors_1 = require("../../hooks/features/pivoting/gridPivotingSelectors");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['columnsManagement'],
        header: ['columnsManagementHeader'],
        searchInput: ['columnsManagementSearchInput'],
        footer: ['columnsManagementFooter'],
        row: ['columnsManagementRow'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var collator = new Intl.Collator();
function GridColumnsManagement(props) {
    var _a, _b, _c, _d;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var searchInputRef = React.useRef(null);
    var initialColumnVisibilityModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridInitialColumnVisibilityModelSelector);
    var columnVisibilityModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridColumnVisibilityModelSelector);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _e = React.useState(''), searchValue = _e[0], setSearchValue = _e[1];
    var classes = useUtilityClasses(rootProps);
    var columnDefinitions = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridColumnDefinitionsSelector);
    var pivotActive = (0, useGridSelector_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotActiveSelector);
    var pivotInitialColumns = (0, useGridSelector_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotInitialColumnsSelector);
    var columns = React.useMemo(function () { return (pivotActive ? Array.from(pivotInitialColumns.values()) : columnDefinitions); }, [pivotActive, pivotInitialColumns, columnDefinitions]);
    var sort = props.sort, _f = props.searchPredicate, searchPredicate = _f === void 0 ? utils_1.defaultSearchPredicate : _f, _g = props.autoFocusSearchField, autoFocusSearchField = _g === void 0 ? true : _g, _h = props.disableShowHideToggle, disableShowHideToggle = _h === void 0 ? false : _h, _j = props.disableResetButton, disableResetButton = _j === void 0 ? false : _j, _k = props.toggleAllMode, toggleAllMode = _k === void 0 ? 'all' : _k, getTogglableColumns = props.getTogglableColumns, searchInputProps = props.searchInputProps, _l = props.searchDebounceMs, searchDebounceMs = _l === void 0 ? rootProps.columnFilterDebounceMs : _l;
    var debouncedFilter = React.useMemo(function () {
        return (0, debounce_1.default)(function (value) {
            setSearchValue(value);
        }, searchDebounceMs !== null && searchDebounceMs !== void 0 ? searchDebounceMs : 150);
    }, [searchDebounceMs]);
    var isResetDisabled = React.useMemo(function () { return (0, utils_1.checkColumnVisibilityModelsSame)(columnVisibilityModel, initialColumnVisibilityModel); }, [columnVisibilityModel, initialColumnVisibilityModel]);
    var sortedColumns = React.useMemo(function () {
        switch (sort) {
            case 'asc':
                return __spreadArray([], columns, true).sort(function (a, b) {
                    return collator.compare(a.headerName || a.field, b.headerName || b.field);
                });
            case 'desc':
                return __spreadArray([], columns, true).sort(function (a, b) { return -collator.compare(a.headerName || a.field, b.headerName || b.field); });
            default:
                return columns;
        }
    }, [columns, sort]);
    var toggleColumn = function (event) {
        var field = event.target.name;
        apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
    };
    var currentColumns = React.useMemo(function () {
        var togglableColumns = getTogglableColumns ? getTogglableColumns(sortedColumns) : null;
        var togglableSortedColumns = togglableColumns
            ? sortedColumns.filter(function (_a) {
                var field = _a.field;
                return togglableColumns.includes(field);
            })
            : sortedColumns;
        if (!searchValue) {
            return togglableSortedColumns;
        }
        return togglableSortedColumns.filter(function (column) {
            return searchPredicate(column, searchValue.toLowerCase());
        });
    }, [sortedColumns, searchValue, searchPredicate, getTogglableColumns]);
    var toggleAllColumns = React.useCallback(function (isVisible) {
        var currentModel = (0, gridColumnsSelector_1.gridColumnVisibilityModelSelector)(apiRef);
        var newModel = __assign({}, currentModel);
        var togglableColumns = getTogglableColumns ? getTogglableColumns(columns) : null;
        (toggleAllMode === 'filteredOnly' ? currentColumns : columns).forEach(function (col) {
            if (col.hideable && (togglableColumns == null || togglableColumns.includes(col.field))) {
                if (isVisible) {
                    // delete the key from the model instead of setting it to `true`
                    delete newModel[col.field];
                }
                else {
                    newModel[col.field] = false;
                }
            }
        });
        return apiRef.current.setColumnVisibilityModel(newModel);
    }, [apiRef, columns, getTogglableColumns, toggleAllMode, currentColumns]);
    var handleSearchValueChange = React.useCallback(function (event) {
        debouncedFilter(event.target.value);
    }, [debouncedFilter]);
    var hideableColumns = React.useMemo(function () { return currentColumns.filter(function (col) { return col.hideable; }); }, [currentColumns]);
    var allHideableColumnsVisible = React.useMemo(function () {
        return hideableColumns.every(function (column) {
            return columnVisibilityModel[column.field] == null ||
                columnVisibilityModel[column.field] !== false;
        });
    }, [columnVisibilityModel, hideableColumns]);
    var allHideableColumnsHidden = React.useMemo(function () { return hideableColumns.every(function (column) { return columnVisibilityModel[column.field] === false; }); }, [columnVisibilityModel, hideableColumns]);
    var firstSwitchRef = React.useRef(null);
    React.useEffect(function () {
        var _a;
        if (autoFocusSearchField) {
            (_a = searchInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        else if (firstSwitchRef.current && typeof firstSwitchRef.current.focus === 'function') {
            firstSwitchRef.current.focus();
        }
    }, [autoFocusSearchField]);
    var firstHideableColumnFound = false;
    var isFirstHideableColumn = function (column) {
        if (firstHideableColumnFound === false && column.hideable !== false) {
            firstHideableColumnFound = true;
            return true;
        }
        return false;
    };
    var handleSearchReset = React.useCallback(function () {
        setSearchValue('');
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
            searchInputRef.current.focus();
        }
    }, []);
    return (<React.Fragment>
      <GridColumnsManagementHeader className={classes.header} ownerState={rootProps}>
        <SearchInput as={rootProps.slots.baseTextField} ownerState={rootProps} placeholder={apiRef.current.getLocaleText('columnsManagementSearchTitle')} inputRef={searchInputRef} className={classes.searchInput} onChange={handleSearchValueChange} size="small" type="search" slotProps={{
            input: {
                startAdornment: <rootProps.slots.quickFilterIcon fontSize="small"/>,
                endAdornment: (<rootProps.slots.baseIconButton size="small" aria-label={apiRef.current.getLocaleText('columnsManagementDeleteIconLabel')} style={searchValue
                        ? {
                            visibility: 'visible',
                        }
                        : {
                            visibility: 'hidden',
                        }} tabIndex={-1} onClick={handleSearchReset} edge="end" {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton}>
                  <rootProps.slots.quickFilterClearIcon fontSize="small"/>
                </rootProps.slots.baseIconButton>),
            },
            htmlInput: {
                'aria-label': apiRef.current.getLocaleText('columnsManagementSearchTitle'),
            },
        }} autoComplete="off" fullWidth {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseTextField} {...searchInputProps}/>
      </GridColumnsManagementHeader>
      <GridColumnsManagementScrollArea ownerState={rootProps}>
        <GridColumnsManagementBody className={classes.root} ownerState={rootProps}>
          {currentColumns.map(function (column) {
            var _a;
            return (<GridColumnsManagementRow as={rootProps.slots.baseCheckbox} key={column.field} className={classes.row} disabled={column.hideable === false || pivotActive} checked={columnVisibilityModel[column.field] !== false} onChange={toggleColumn} name={column.field} inputRef={isFirstHideableColumn(column) ? firstSwitchRef : undefined} label={column.headerName || column.field} density="compact" fullWidth {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseCheckbox}/>);
        })}
          {currentColumns.length === 0 && (<GridColumnsManagementEmptyText ownerState={rootProps}>
              {apiRef.current.getLocaleText('columnsManagementNoColumns')}
            </GridColumnsManagementEmptyText>)}
        </GridColumnsManagementBody>
      </GridColumnsManagementScrollArea>
      {!disableShowHideToggle || !disableResetButton ? (<GridColumnsManagementFooter ownerState={rootProps} className={classes.footer}>
          {!disableShowHideToggle ? (<rootProps.slots.baseCheckbox disabled={hideableColumns.length === 0 || pivotActive} checked={allHideableColumnsVisible} indeterminate={!allHideableColumnsVisible && !allHideableColumnsHidden} onChange={function () { return toggleAllColumns(!allHideableColumnsVisible); }} name={apiRef.current.getLocaleText('columnsManagementShowHideAllText')} label={apiRef.current.getLocaleText('columnsManagementShowHideAllText')} density="compact" {...(_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseCheckbox}/>) : (<span />)}

          {!disableResetButton ? (<rootProps.slots.baseButton onClick={function () { return apiRef.current.setColumnVisibilityModel(initialColumnVisibilityModel); }} disabled={isResetDisabled || pivotActive} {...(_d = rootProps.slotProps) === null || _d === void 0 ? void 0 : _d.baseButton}>
              {apiRef.current.getLocaleText('columnsManagementReset')}
            </rootProps.slots.baseButton>) : null}
        </GridColumnsManagementFooter>) : null}
    </React.Fragment>);
}
GridColumnsManagement.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * If `true`, the column search field will be focused automatically.
     * If `false`, the first column switch input will be focused automatically.
     * This helps to avoid input keyboard panel to popup automatically on touch devices.
     * @default true
     */
    autoFocusSearchField: prop_types_1.default.bool,
    /**
     * If `true`, the `Reset` button will not be disabled
     * @default false
     */
    disableResetButton: prop_types_1.default.bool,
    /**
     * If `true`, the `Show/Hide all` toggle checkbox will not be displayed.
     * @default false
     */
    disableShowHideToggle: prop_types_1.default.bool,
    /**
     * Returns the list of togglable columns.
     * If used, only those columns will be displayed in the panel
     * which are passed as the return value of the function.
     * @param {GridColDef[]} columns The `ColDef` list of all columns.
     * @returns {GridColDef['field'][]} The list of togglable columns' field names.
     */
    getTogglableColumns: prop_types_1.default.func,
    /**
     * The milliseconds delay to wait after a keystroke before triggering filtering in the columns menu.
     * @default 150
     */
    searchDebounceMs: prop_types_1.default.number,
    searchInputProps: prop_types_1.default.object,
    searchPredicate: prop_types_1.default.func,
    sort: prop_types_1.default.oneOf(['asc', 'desc']),
    /**
     * Changes the behavior of the `Show/Hide All` toggle when the search field is used:
     * - `all`: Will toggle all columns.
     * - `filteredOnly`: Will only toggle columns that match the search criteria.
     * @default 'all'
     */
    toggleAllMode: prop_types_1.default.oneOf(['all', 'filteredOnly']),
};
var GridColumnsManagementBody = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagement',
})({
    display: 'flex',
    flexDirection: 'column',
    padding: cssVariables_1.vars.spacing(0.5, 1.5),
});
var GridColumnsManagementScrollArea = (0, styles_1.styled)(GridShadowScrollArea_1.GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementScrollArea',
})({
    maxHeight: 300,
});
var GridColumnsManagementHeader = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementHeader',
})({
    padding: cssVariables_1.vars.spacing(1.5, 2),
    borderBottom: "1px solid ".concat(cssVariables_1.vars.colors.border.base),
});
var SearchInput = (0, styles_1.styled)((assert_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementSearchInput',
})((_a = {},
    _a["& .".concat(InputBase_1.inputBaseClasses.input, "::-webkit-search-decoration,\n      & .").concat(InputBase_1.inputBaseClasses.input, "::-webkit-search-cancel-button,\n      & .").concat(InputBase_1.inputBaseClasses.input, "::-webkit-search-results-button,\n      & .").concat(InputBase_1.inputBaseClasses.input, "::-webkit-search-results-decoration")] = {
        /* clears the 'X' icon from Chrome */
        display: 'none',
    },
    _a));
var GridColumnsManagementFooter = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementFooter',
})({
    padding: cssVariables_1.vars.spacing(1, 1, 1, 1.5),
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: "1px solid ".concat(cssVariables_1.vars.colors.border.base),
});
var GridColumnsManagementEmptyText = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementEmptyText',
})({
    padding: cssVariables_1.vars.spacing(1, 0),
    alignSelf: 'center',
    font: cssVariables_1.vars.typography.font.body,
});
var GridColumnsManagementRow = (0, styles_1.styled)((assert_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementRow',
})();
