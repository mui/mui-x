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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeaderFilterCell = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var capitalize_1 = require("@mui/utils/capitalize");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var InputBase_1 = require("@mui/material/InputBase");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridHeaderFilterMenuContainer_1 = require("./GridHeaderFilterMenuContainer");
var GridHeaderFilterClearButton_1 = require("./GridHeaderFilterClearButton");
var StyledInputComponent = (0, styles_1.styled)(x_data_grid_1.GridFilterInputValue, {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaderFilterInput',
})((_a = {
        flex: 1,
        marginRight: internals_1.vars.spacing(0.5),
        marginBottom: internals_1.vars.spacing(-0.25),
        '& input[type="number"], & input[type="date"], & input[type="datetime-local"]': {
            '&[value=""]:not(:focus)': {
                color: 'transparent',
            },
        }
    },
    _a["& .".concat(InputBase_1.inputBaseClasses.input)] = {
        fontSize: '14px',
    },
    _a[".".concat(x_data_grid_1.gridClasses['root--densityCompact'], " & .").concat(InputBase_1.inputBaseClasses.input)] = {
        paddingTop: internals_1.vars.spacing(0.5),
        paddingBottom: internals_1.vars.spacing(0.5),
        height: 23,
    },
    _a));
var OperatorLabel = (0, styles_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaderFilterOperatorLabel',
})({
    flex: 1,
    marginRight: internals_1.vars.spacing(0.5),
    color: internals_1.vars.colors.foreground.muted,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
});
var useUtilityClasses = function (ownerState) {
    var colDef = ownerState.colDef, classes = ownerState.classes, showRightBorder = ownerState.showRightBorder, showLeftBorder = ownerState.showLeftBorder, pinnedPosition = ownerState.pinnedPosition;
    var slots = {
        root: [
            'columnHeader',
            'columnHeader--filter',
            colDef.headerAlign === 'left' && 'columnHeader--alignLeft',
            colDef.headerAlign === 'center' && 'columnHeader--alignCenter',
            colDef.headerAlign === 'right' && 'columnHeader--alignRight',
            'withBorderColor',
            showRightBorder && 'columnHeader--withRightBorder',
            showLeftBorder && 'columnHeader--withLeftBorder',
            pinnedPosition === internals_1.PinnedColumnPosition.LEFT && 'columnHeader--pinnedLeft',
            pinnedPosition === internals_1.PinnedColumnPosition.RIGHT && 'columnHeader--pinnedRight',
        ],
        input: ['columnHeaderFilterInput'],
        operatorLabel: ['columnHeaderFilterOperatorLabel'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
var DEFAULT_INPUT_COMPONENTS = {
    string: x_data_grid_1.GridFilterInputValue,
    number: x_data_grid_1.GridFilterInputValue,
    date: x_data_grid_1.GridFilterInputDate,
    dateTime: x_data_grid_1.GridFilterInputDate,
    boolean: x_data_grid_1.GridFilterInputBoolean,
    singleSelect: x_data_grid_1.GridFilterInputSingleSelect,
    actions: null,
    custom: null,
};
var GridHeaderFilterCell = (0, forwardRef_1.forwardRef)(function (props, ref) {
    var _a, _b, _c;
    var colIndex = props.colIndex, height = props.height, hasFocus = props.hasFocus, width = props.width, headerClassName = props.headerClassName, colDef = props.colDef, item = props.item, headerFilterMenuRef = props.headerFilterMenuRef, InputComponentProps = props.InputComponentProps, _d = props.showClearIcon, showClearIcon = _d === void 0 ? false : _d, pinnedPosition = props.pinnedPosition, pinnedOffset = props.pinnedOffset, styleProp = props.style, showLeftBorder = props.showLeftBorder, showRightBorder = props.showRightBorder, other = __rest(props, ["colIndex", "height", "hasFocus", "width", "headerClassName", "colDef", "item", "headerFilterMenuRef", "InputComponentProps", "showClearIcon", "pinnedPosition", "pinnedOffset", "style", "showLeftBorder", "showRightBorder"]);
    var apiRef = (0, internals_1.useGridPrivateApiContext)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var columnFields = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridVisibleColumnFieldsSelector);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var cellRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, cellRef);
    var inputRef = React.useRef(null);
    var buttonRef = React.useRef(null);
    var editingField = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridHeaderFilteringEditFieldSelector);
    var isEditing = editingField === colDef.field;
    var menuOpenField = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridHeaderFilteringMenuSelector);
    var isMenuOpen = menuOpenField === colDef.field;
    // TODO: Support for `isAnyOf` operator
    var filterOperators = React.useMemo(function () {
        if (!colDef.filterOperators) {
            return [];
        }
        return colDef.filterOperators.filter(function (operator) { return operator.value !== 'isAnyOf'; });
    }, [colDef.filterOperators]);
    var filterModel = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridFilterModelSelector);
    var filterableColumnsLookup = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridFilterableColumnLookupSelector);
    var isFilterReadOnly = React.useMemo(function () {
        if (!(filterModel === null || filterModel === void 0 ? void 0 : filterModel.items.length)) {
            return false;
        }
        var filterModelItem = filterModel.items.find(function (it) { return it.field === colDef.field; });
        return filterModelItem ? !filterableColumnsLookup[filterModelItem.field] : false;
    }, [colDef.field, filterModel, filterableColumnsLookup]);
    var currentOperator = React.useMemo(function () { var _a; return (_a = filterOperators.find(function (operator) { return operator.value === item.operator; })) !== null && _a !== void 0 ? _a : filterOperators[0]; }, [item.operator, filterOperators]);
    var InputComponent = colDef.filterable || isFilterReadOnly
        ? ((_a = currentOperator.InputComponent) !== null && _a !== void 0 ? _a : DEFAULT_INPUT_COMPONENTS[colDef.type])
        : null;
    var clearFilterItem = React.useCallback(function () {
        apiRef.current.deleteFilterItem(item);
    }, [apiRef, item]);
    var headerFilterComponent;
    if (colDef.renderHeaderFilter) {
        headerFilterComponent = colDef.renderHeaderFilter(__assign(__assign({}, props), { inputRef: inputRef }));
    }
    React.useLayoutEffect(function () {
        if (hasFocus && !isMenuOpen) {
            var focusableElement = cellRef.current.querySelector('[tabindex="0"]');
            if (isEditing && InputComponent) {
                focusableElement = inputRef.current;
            }
            var elementToFocus = focusableElement || cellRef.current;
            elementToFocus === null || elementToFocus === void 0 ? void 0 : elementToFocus.focus();
            if (apiRef.current.columnHeadersContainerRef.current) {
                apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
            }
        }
    }, [InputComponent, apiRef, hasFocus, isEditing, isMenuOpen]);
    var onKeyDown = React.useCallback(function (event) {
        var _a;
        if (isMenuOpen || (0, internals_1.isNavigationKey)(event.key) || isFilterReadOnly) {
            return;
        }
        switch (event.key) {
            case 'Escape':
                if (isEditing) {
                    apiRef.current.stopHeaderFilterEditMode();
                }
                break;
            case 'Enter':
                if (isEditing) {
                    if (!event.defaultPrevented) {
                        apiRef.current.stopHeaderFilterEditMode();
                        break;
                    }
                }
                if (event.metaKey || event.ctrlKey) {
                    headerFilterMenuRef.current = buttonRef.current;
                    apiRef.current.showHeaderFilterMenu(colDef.field);
                    break;
                }
                apiRef.current.startHeaderFilterEditMode(colDef.field);
                break;
            case 'Tab': {
                if (isEditing) {
                    var fieldToFocus = (_a = columnFields[colIndex + (event.shiftKey ? -1 : 1)]) !== null && _a !== void 0 ? _a : null;
                    if (fieldToFocus) {
                        apiRef.current.startHeaderFilterEditMode(fieldToFocus);
                        apiRef.current.setColumnHeaderFilterFocus(fieldToFocus, event);
                    }
                }
                break;
            }
            default:
                if (isEditing || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
                    break;
                }
                apiRef.current.startHeaderFilterEditMode(colDef.field);
                break;
        }
    }, [
        apiRef,
        colDef.field,
        colIndex,
        columnFields,
        headerFilterMenuRef,
        isEditing,
        isFilterReadOnly,
        isMenuOpen,
    ]);
    var publish = React.useCallback(function (eventName, propHandler) {
        return function (event) {
            apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(colDef.field), event);
            if (propHandler) {
                propHandler(event);
            }
        };
    }, [apiRef, colDef.field]);
    var onMouseDown = React.useCallback(function (event) {
        var _a, _b;
        if (!hasFocus) {
            if ((_b = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, event.target)) {
                inputRef.current.focus();
            }
            apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
        }
    }, [apiRef, colDef.field, hasFocus]);
    var mouseEventsHandlers = React.useMemo(function () { return ({
        onKeyDown: publish('headerFilterKeyDown', onKeyDown),
        onClick: publish('headerFilterClick'),
        onMouseDown: publish('headerFilterMouseDown', onMouseDown),
        onBlur: publish('headerFilterBlur'),
    }); }, [onMouseDown, onKeyDown, publish]);
    var ownerState = __assign(__assign({}, rootProps), { pinnedPosition: pinnedPosition, colDef: colDef, showLeftBorder: showLeftBorder, showRightBorder: showRightBorder });
    var classes = useUtilityClasses(ownerState);
    var label = (_b = currentOperator.headerLabel) !== null && _b !== void 0 ? _b : apiRef.current.getLocaleText("headerFilterOperator".concat((0, capitalize_1.default)(item.operator)));
    var isNoInputOperator = currentOperator.requiresFilterValue === false;
    var isApplied = (item === null || item === void 0 ? void 0 : item.value) !== undefined || isNoInputOperator;
    var isFilterActive = isApplied || hasFocus;
    var headerFilterMenu = (<GridHeaderFilterMenuContainer_1.GridHeaderFilterMenuContainer operators={filterOperators} item={item} field={colDef.field} disabled={isFilterReadOnly} applyFilterChanges={apiRef.current.upsertFilterItem} headerFilterMenuRef={headerFilterMenuRef} buttonRef={buttonRef} showClearItem={!showClearIcon && isApplied} clearFilterItem={clearFilterItem}/>);
    var clearButton = showClearIcon && isApplied ? (<GridHeaderFilterClearButton_1.GridHeaderFilterClearButton onClick={clearFilterItem} disabled={isFilterReadOnly}/>) : null;
    return (<div className={(0, clsx_1.default)(classes.root, headerClassName)} style={(0, internals_1.attachPinnedStyle)(__assign({ height: height, width: width }, styleProp), isRtl, pinnedPosition, pinnedOffset)} role="columnheader" aria-colindex={colIndex + 1} aria-label={headerFilterComponent == null ? ((_c = colDef.headerName) !== null && _c !== void 0 ? _c : colDef.field) : undefined} {...other} {...mouseEventsHandlers} ref={handleRef}>
      {headerFilterComponent}
      {headerFilterComponent === undefined ? (<React.Fragment>
          {isNoInputOperator ? (<React.Fragment>
              <OperatorLabel className={classes.operatorLabel}>{label}</OperatorLabel>
              {clearButton}
              {headerFilterMenu}
            </React.Fragment>) : null}
          {InputComponent && !isNoInputOperator ? (<StyledInputComponent as={InputComponent} className={classes.input} apiRef={apiRef} item={item} inputRef={inputRef} applyValue={apiRef.current.upsertFilterItem} onFocus={function () { return apiRef.current.startHeaderFilterEditMode(colDef.field); }} onBlur={function (event) {
                    var _a;
                    apiRef.current.stopHeaderFilterEditMode();
                    // Blurring an input element should reset focus state only if `relatedTarget` is not the header filter cell
                    if (!((_a = event.relatedTarget) === null || _a === void 0 ? void 0 : _a.className.includes('columnHeader'))) {
                        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { focus: {
                                cell: null,
                                columnHeader: null,
                                columnHeaderFilter: null,
                                columnGroupHeader: null,
                            } })); });
                    }
                }} isFilterActive={isFilterActive} headerFilterMenu={headerFilterMenu} clearButton={clearButton} disabled={isFilterReadOnly || isNoInputOperator} tabIndex={-1} slotProps={{
                    root: {
                        size: 'small',
                        label: (0, capitalize_1.default)(label),
                        placeholder: '',
                    },
                }} {...(isNoInputOperator ? { value: '' } : {})} {...currentOperator === null || currentOperator === void 0 ? void 0 : currentOperator.InputComponentProps} {...InputComponentProps}/>) : null}
        </React.Fragment>) : null}
    </div>);
});
GridHeaderFilterCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    colIndex: prop_types_1.default.number.isRequired,
    hasFocus: prop_types_1.default.bool,
    /**
     * Class name added to the column header cell.
     */
    headerClassName: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    headerFilterMenuRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }).isRequired,
    height: prop_types_1.default.number.isRequired,
    InputComponentProps: prop_types_1.default.shape({
        apiRef: prop_types_1.default.shape({
            current: prop_types_1.default.object.isRequired,
        }),
        applyValue: prop_types_1.default.func,
        className: prop_types_1.default.string,
        clearButton: prop_types_1.default.node,
        disabled: prop_types_1.default.bool,
        focusElementRef: prop_types_1.default.oneOfType([
            prop_types_1.default.func,
            prop_types_1.default.shape({
                current: prop_types_1.default.any.isRequired,
            }),
        ]),
        headerFilterMenu: prop_types_1.default.node,
        inputRef: prop_types_1.default.oneOfType([
            prop_types_1.default.func,
            prop_types_1.default.shape({
                current: function (props, propName) {
                    if (props[propName] == null) {
                        return null;
                    }
                    if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
                        return new Error("Expected prop '".concat(propName, "' to be of type Element"));
                    }
                    return null;
                },
            }),
        ]),
        isFilterActive: prop_types_1.default.bool,
        item: prop_types_1.default.shape({
            field: prop_types_1.default.string.isRequired,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            operator: prop_types_1.default.string.isRequired,
            value: prop_types_1.default.any,
        }),
        onBlur: prop_types_1.default.func,
        onFocus: prop_types_1.default.func,
        slotProps: prop_types_1.default.object,
        tabIndex: prop_types_1.default.number,
    }),
    item: prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        operator: prop_types_1.default.string.isRequired,
        value: prop_types_1.default.any,
    }).isRequired,
    pinnedOffset: prop_types_1.default.number,
    pinnedPosition: prop_types_1.default.oneOf([0, 1, 2, 3]),
    showClearIcon: prop_types_1.default.bool,
    showLeftBorder: prop_types_1.default.bool.isRequired,
    showRightBorder: prop_types_1.default.bool.isRequired,
    sortIndex: prop_types_1.default.number,
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.oneOf([-1, 0]).isRequired,
    width: prop_types_1.default.number.isRequired,
};
var Memoized = (0, fastMemo_1.fastMemo)(GridHeaderFilterCell);
exports.GridHeaderFilterCell = Memoized;
