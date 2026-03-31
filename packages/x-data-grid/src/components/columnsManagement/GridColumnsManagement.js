/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import debounce from '@mui/utils/debounce';
import { styled } from '@mui/material/styles';
import { inputBaseClasses } from '@mui/material/InputBase';
import { vars } from '../../constants/cssVariables';
import { gridColumnDefinitionsSelector, gridColumnVisibilityModelSelector, gridInitialColumnVisibilityModelSelector, } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { checkColumnVisibilityModelsSame, defaultSearchPredicate } from './utils';
import { NotRendered } from '../../utils/assert';
import { GridShadowScrollArea } from '../GridShadowScrollArea';
import { gridPivotActiveSelector, gridPivotInitialColumnsSelector, } from '../../hooks/features/pivoting/gridPivotingSelectors';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['columnsManagement'],
        header: ['columnsManagementHeader'],
        searchInput: ['columnsManagementSearchInput'],
        footer: ['columnsManagementFooter'],
        row: ['columnsManagementRow'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const collator = new Intl.Collator();
function GridColumnsManagement(props) {
    const apiRef = useGridApiContext();
    const searchInputRef = React.useRef(null);
    const initialColumnVisibilityModel = useGridSelector(apiRef, gridInitialColumnVisibilityModelSelector);
    const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
    const rootProps = useGridRootProps();
    const [searchValue, setSearchValue] = React.useState('');
    const classes = useUtilityClasses(rootProps);
    const columnDefinitions = useGridSelector(apiRef, gridColumnDefinitionsSelector);
    const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
    const pivotInitialColumns = useGridSelector(apiRef, gridPivotInitialColumnsSelector);
    const columns = React.useMemo(() => (pivotActive ? Array.from(pivotInitialColumns.values()) : columnDefinitions), [pivotActive, pivotInitialColumns, columnDefinitions]);
    const { sort, searchPredicate = defaultSearchPredicate, autoFocusSearchField = true, disableShowHideToggle = false, disableResetButton = false, toggleAllMode = 'all', getTogglableColumns, searchInputProps, searchDebounceMs = rootProps.columnFilterDebounceMs, } = props;
    const debouncedFilter = React.useMemo(() => debounce((value) => {
        setSearchValue(value);
    }, searchDebounceMs ?? 150), [searchDebounceMs]);
    const isResetDisabled = React.useMemo(() => checkColumnVisibilityModelsSame(columnVisibilityModel, initialColumnVisibilityModel), [columnVisibilityModel, initialColumnVisibilityModel]);
    const sortedColumns = React.useMemo(() => {
        switch (sort) {
            case 'asc':
                return [...columns].sort((a, b) => collator.compare(a.headerName || a.field, b.headerName || b.field));
            case 'desc':
                return [...columns].sort((a, b) => -collator.compare(a.headerName || a.field, b.headerName || b.field));
            default:
                return columns;
        }
    }, [columns, sort]);
    const toggleColumn = (event) => {
        const { name: field } = event.target;
        apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
    };
    const currentColumns = React.useMemo(() => {
        const togglableColumns = getTogglableColumns ? getTogglableColumns(sortedColumns) : null;
        const togglableSortedColumns = togglableColumns
            ? sortedColumns.filter(({ field }) => togglableColumns.includes(field))
            : sortedColumns;
        if (!searchValue) {
            return togglableSortedColumns;
        }
        return togglableSortedColumns.filter((column) => searchPredicate(column, searchValue.toLowerCase()));
    }, [sortedColumns, searchValue, searchPredicate, getTogglableColumns]);
    const toggleAllColumns = React.useCallback((isVisible) => {
        const currentModel = gridColumnVisibilityModelSelector(apiRef);
        const newModel = { ...currentModel };
        const togglableColumns = getTogglableColumns ? getTogglableColumns(columns) : null;
        (toggleAllMode === 'filteredOnly' ? currentColumns : columns).forEach((col) => {
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
    const handleSearchValueChange = React.useCallback((event) => {
        debouncedFilter(event.target.value);
    }, [debouncedFilter]);
    const hideableColumns = React.useMemo(() => currentColumns.filter((col) => col.hideable), [currentColumns]);
    const allHideableColumnsVisible = React.useMemo(() => hideableColumns.every((column) => columnVisibilityModel[column.field] == null ||
        columnVisibilityModel[column.field] !== false), [columnVisibilityModel, hideableColumns]);
    const allHideableColumnsHidden = React.useMemo(() => hideableColumns.every((column) => columnVisibilityModel[column.field] === false), [columnVisibilityModel, hideableColumns]);
    const firstSwitchRef = React.useRef(null);
    React.useEffect(() => {
        if (autoFocusSearchField) {
            searchInputRef.current?.focus();
        }
        else if (firstSwitchRef.current && typeof firstSwitchRef.current.focus === 'function') {
            firstSwitchRef.current.focus();
        }
    }, [autoFocusSearchField]);
    let firstHideableColumnFound = false;
    const isFirstHideableColumn = (column) => {
        if (firstHideableColumnFound === false && column.hideable !== false) {
            firstHideableColumnFound = true;
            return true;
        }
        return false;
    };
    const handleSearchReset = React.useCallback(() => {
        setSearchValue('');
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
            searchInputRef.current.focus();
        }
    }, []);
    return (_jsxs(React.Fragment, { children: [_jsx(GridColumnsManagementHeader, { className: classes.header, ownerState: rootProps, children: _jsx(SearchInput, { as: rootProps.slots.baseTextField, ownerState: rootProps, placeholder: apiRef.current.getLocaleText('columnsManagementSearchTitle'), inputRef: searchInputRef, className: classes.searchInput, onChange: handleSearchValueChange, size: "small", type: "search", slotProps: {
                        input: {
                            startAdornment: _jsx(rootProps.slots.quickFilterIcon, { fontSize: "small" }),
                            endAdornment: (_jsx(rootProps.slots.baseIconButton, { size: "small", "aria-label": apiRef.current.getLocaleText('columnsManagementDeleteIconLabel'), style: searchValue
                                    ? {
                                        visibility: 'visible',
                                    }
                                    : {
                                        visibility: 'hidden',
                                    }, tabIndex: -1, onClick: handleSearchReset, edge: "end", ...rootProps.slotProps?.baseIconButton, children: _jsx(rootProps.slots.quickFilterClearIcon, { fontSize: "small" }) })),
                        },
                        htmlInput: {
                            'aria-label': apiRef.current.getLocaleText('columnsManagementSearchTitle'),
                        },
                    }, autoComplete: "off", fullWidth: true, ...rootProps.slotProps?.baseTextField, ...searchInputProps }) }), _jsx(GridColumnsManagementScrollArea, { ownerState: rootProps, children: _jsxs(GridColumnsManagementBody, { className: classes.root, ownerState: rootProps, children: [currentColumns.map((column) => (_jsx(GridColumnsManagementRow, { as: rootProps.slots.baseCheckbox, className: classes.row, disabled: column.hideable === false || pivotActive, checked: columnVisibilityModel[column.field] !== false, onChange: toggleColumn, name: column.field, inputRef: isFirstHideableColumn(column) ? firstSwitchRef : undefined, label: column.headerName || column.field, density: "compact", fullWidth: true, ...rootProps.slotProps?.baseCheckbox }, column.field))), currentColumns.length === 0 && (_jsx(GridColumnsManagementEmptyText, { ownerState: rootProps, children: apiRef.current.getLocaleText('columnsManagementNoColumns') }))] }) }), !disableShowHideToggle || !disableResetButton ? (_jsxs(GridColumnsManagementFooter, { ownerState: rootProps, className: classes.footer, children: [!disableShowHideToggle ? (_jsx(rootProps.slots.baseCheckbox, { disabled: hideableColumns.length === 0 || pivotActive, checked: allHideableColumnsVisible, indeterminate: !allHideableColumnsVisible && !allHideableColumnsHidden, onChange: () => toggleAllColumns(!allHideableColumnsVisible), name: apiRef.current.getLocaleText('columnsManagementShowHideAllText'), label: apiRef.current.getLocaleText('columnsManagementShowHideAllText'), density: "compact", ...rootProps.slotProps?.baseCheckbox })) : (_jsx("span", {})), !disableResetButton ? (_jsx(rootProps.slots.baseButton, { onClick: () => apiRef.current.setColumnVisibilityModel(initialColumnVisibilityModel), disabled: isResetDisabled || pivotActive, ...rootProps.slotProps?.baseButton, children: apiRef.current.getLocaleText('columnsManagementReset') })) : null] })) : null] }));
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
    autoFocusSearchField: PropTypes.bool,
    /**
     * If `true`, the `Reset` button will not be disabled
     * @default false
     */
    disableResetButton: PropTypes.bool,
    /**
     * If `true`, the `Show/Hide all` toggle checkbox will not be displayed.
     * @default false
     */
    disableShowHideToggle: PropTypes.bool,
    /**
     * Returns the list of togglable columns.
     * If used, only those columns will be displayed in the panel
     * which are passed as the return value of the function.
     * @param {GridColDef[]} columns The `ColDef` list of all columns.
     * @returns {GridColDef['field'][]} The list of togglable columns' field names.
     */
    getTogglableColumns: PropTypes.func,
    /**
     * The milliseconds delay to wait after a keystroke before triggering filtering in the columns menu.
     * @default 150
     */
    searchDebounceMs: PropTypes.number,
    searchInputProps: PropTypes.object,
    searchPredicate: PropTypes.func,
    sort: PropTypes.oneOf(['asc', 'desc']),
    /**
     * Changes the behavior of the `Show/Hide All` toggle when the search field is used:
     * - `all`: Will toggle all columns.
     * - `filteredOnly`: Will only toggle columns that match the search criteria.
     * @default 'all'
     */
    toggleAllMode: PropTypes.oneOf(['all', 'filteredOnly']),
};
const GridColumnsManagementBody = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagement',
})({
    display: 'flex',
    flexDirection: 'column',
    padding: vars.spacing(0.5, 1.5),
});
const GridColumnsManagementScrollArea = styled(GridShadowScrollArea, {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementScrollArea',
})({
    maxHeight: 300,
});
const GridColumnsManagementHeader = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementHeader',
})({
    padding: vars.spacing(1.5, 2),
    borderBottom: `1px solid ${vars.colors.border.base}`,
});
const SearchInput = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementSearchInput',
})({
    [`& .${inputBaseClasses.input}::-webkit-search-decoration,
      & .${inputBaseClasses.input}::-webkit-search-cancel-button,
      & .${inputBaseClasses.input}::-webkit-search-results-button,
      & .${inputBaseClasses.input}::-webkit-search-results-decoration`]: {
        /* clears the 'X' icon from Chrome */
        display: 'none',
    },
});
const GridColumnsManagementFooter = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementFooter',
})({
    padding: vars.spacing(1, 1, 1, 1.5),
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `1px solid ${vars.colors.border.base}`,
});
const GridColumnsManagementEmptyText = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementEmptyText',
})({
    padding: vars.spacing(1, 0),
    alignSelf: 'center',
    font: vars.typography.font.body,
});
const GridColumnsManagementRow = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ColumnsManagementRow',
})({});
export { GridColumnsManagement };
