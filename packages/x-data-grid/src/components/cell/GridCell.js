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
exports.GridCell = exports.gridPinnedColumnPositionLookup = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var capitalize_1 = require("@mui/utils/capitalize");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var store_1 = require("@mui/x-internals/store");
var x_virtualizer_1 = require("@mui/x-virtualizer");
var doesSupportPreventScroll_1 = require("../../utils/doesSupportPreventScroll");
var gridClasses_1 = require("../../constants/gridClasses");
var models_1 = require("../../models");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridFocusStateSelector_1 = require("../../hooks/features/focus/gridFocusStateSelector");
var gridColumnsInterfaces_1 = require("../../hooks/features/columns/gridColumnsInterfaces");
var constants_1 = require("../../internals/constants");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var gridEditingSelectors_1 = require("../../hooks/features/editing/gridEditingSelectors");
var utils_1 = require("../../internals/utils");
var useGridConfiguration_1 = require("../../hooks/utils/useGridConfiguration");
exports.gridPinnedColumnPositionLookup = (_a = {},
    _a[constants_1.PinnedColumnPosition.LEFT] = gridColumnsInterfaces_1.GridPinnedColumnPosition.LEFT,
    _a[constants_1.PinnedColumnPosition.RIGHT] = gridColumnsInterfaces_1.GridPinnedColumnPosition.RIGHT,
    _a[constants_1.PinnedColumnPosition.NONE] = undefined,
    _a[constants_1.PinnedColumnPosition.VIRTUAL] = undefined,
    _a);
var useUtilityClasses = function (ownerState) {
    var align = ownerState.align, showLeftBorder = ownerState.showLeftBorder, showRightBorder = ownerState.showRightBorder, pinnedPosition = ownerState.pinnedPosition, isEditable = ownerState.isEditable, isSelected = ownerState.isSelected, isSelectionMode = ownerState.isSelectionMode, classes = ownerState.classes;
    var slots = {
        root: [
            'cell',
            "cell--text".concat((0, capitalize_1.default)(align)),
            isSelected && 'selected',
            isEditable && 'cell--editable',
            showLeftBorder && 'cell--withLeftBorder',
            showRightBorder && 'cell--withRightBorder',
            pinnedPosition === constants_1.PinnedColumnPosition.LEFT && 'cell--pinnedLeft',
            pinnedPosition === constants_1.PinnedColumnPosition.RIGHT && 'cell--pinnedRight',
            isSelectionMode && !isEditable && 'cell--selectionMode',
        ],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var warnedOnce = false;
// TODO(v7): Removing the wrapper will break the docs performance visualization demo.
var GridCell = (0, forwardRef_1.forwardRef)(function GridCell(props, ref) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var column = props.column, row = props.row, rowId = props.rowId, rowNode = props.rowNode, align = props.align, childrenProp = props.children, colIndex = props.colIndex, width = props.width, className = props.className, styleProp = props.style, colSpan = props.colSpan, disableDragEvents = props.disableDragEvents, isNotVisible = props.isNotVisible, pinnedOffset = props.pinnedOffset, pinnedPosition = props.pinnedPosition, showRightBorder = props.showRightBorder, showLeftBorder = props.showLeftBorder, onClick = props.onClick, onDoubleClick = props.onDoubleClick, onMouseDown = props.onMouseDown, onMouseUp = props.onMouseUp, onMouseOver = props.onMouseOver, onKeyDown = props.onKeyDown, onKeyUp = props.onKeyUp, onDragEnter = props.onDragEnter, onDragOver = props.onDragOver, other = __rest(props, ["column", "row", "rowId", "rowNode", "align", "children", "colIndex", "width", "className", "style", "colSpan", "disableDragEvents", "isNotVisible", "pinnedOffset", "pinnedPosition", "showRightBorder", "showLeftBorder", "onClick", "onDoubleClick", "onMouseDown", "onMouseUp", "onMouseOver", "onKeyDown", "onKeyUp", "onDragEnter", "onDragOver"]);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var field = column.field;
    var editCellState = (0, useGridSelector_1.useGridSelector)(apiRef, gridEditingSelectors_1.gridEditCellStateSelector, {
        rowId: rowId,
        field: field,
    });
    var config = (0, useGridConfiguration_1.useGridConfiguration)();
    var cellAggregationResult = config.hooks.useCellAggregationResult(rowId, field);
    var cellMode = editCellState ? models_1.GridCellModes.Edit : models_1.GridCellModes.View;
    var cellParams = apiRef.current.getCellParamsForRow(rowId, field, row, {
        colDef: column,
        cellMode: cellMode,
        rowNode: rowNode,
        tabIndex: (0, useGridSelector_1.useGridSelector)(apiRef, function () {
            var cellTabIndex = (0, gridFocusStateSelector_1.gridTabIndexCellSelector)(apiRef);
            return cellTabIndex && cellTabIndex.field === field && cellTabIndex.id === rowId ? 0 : -1;
        }),
        hasFocus: (0, useGridSelector_1.useGridSelector)(apiRef, function () {
            var focus = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
            return (focus === null || focus === void 0 ? void 0 : focus.id) === rowId && focus.field === field;
        }),
    });
    cellParams.api = apiRef.current;
    if (cellAggregationResult) {
        cellParams.value = cellAggregationResult.value;
        cellParams.formattedValue = column.valueFormatter
            ? column.valueFormatter(cellParams.value, row, column, apiRef)
            : cellParams.value;
    }
    var isSelected = (0, useGridSelector_1.useGridSelector)(apiRef, function () {
        return apiRef.current.unstable_applyPipeProcessors('isCellSelected', false, {
            id: rowId,
            field: field,
        });
    });
    var store = apiRef.current.virtualizer.store;
    var hiddenCells = (0, store_1.useStore)(store, x_virtualizer_1.Rowspan.selectors.hiddenCells);
    var spannedCells = (0, store_1.useStore)(store, x_virtualizer_1.Rowspan.selectors.spannedCells);
    var hasFocus = cellParams.hasFocus, _k = cellParams.isEditable, isEditable = _k === void 0 ? false : _k, value = cellParams.value;
    var canManageOwnFocus = column.type === 'actions' &&
        ((_b = (_a = column).getActions) === null || _b === void 0 ? void 0 : _b.call(_a, apiRef.current.getRowParams(rowId)).some(function (action) { return !action.props.disabled; }));
    var tabIndex = (cellMode === 'view' || !isEditable) && !canManageOwnFocus ? cellParams.tabIndex : -1;
    var rootClasses = rootProps.classes, getCellClassName = rootProps.getCellClassName;
    // There is a hidden grid state access in `applyPipeProcessor('cellClassName', ...)`
    var pipesClassName = (0, useGridSelector_1.useGridSelector)(apiRef, function () {
        return apiRef.current
            .unstable_applyPipeProcessors('cellClassName', [], {
            id: rowId,
            field: field,
        })
            .filter(Boolean)
            .join(' ');
    });
    var classNames = [pipesClassName];
    if (column.cellClassName) {
        classNames.push(typeof column.cellClassName === 'function'
            ? column.cellClassName(cellParams)
            : column.cellClassName);
    }
    if (column.display === 'flex') {
        classNames.push(gridClasses_1.gridClasses['cell--flex']);
    }
    if (getCellClassName) {
        classNames.push(getCellClassName(cellParams));
    }
    var valueToRender = (_c = cellParams.formattedValue) !== null && _c !== void 0 ? _c : value;
    var cellRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, cellRef);
    var focusElementRef = React.useRef(null);
    var isSelectionMode = (_d = rootProps.cellSelection) !== null && _d !== void 0 ? _d : false;
    var ownerState = {
        align: align,
        showLeftBorder: showLeftBorder,
        showRightBorder: showRightBorder,
        isEditable: isEditable,
        classes: rootProps.classes,
        pinnedPosition: pinnedPosition,
        isSelected: isSelected,
        isSelectionMode: isSelectionMode,
    };
    var classes = useUtilityClasses(ownerState);
    var publishMouseUp = React.useCallback(function (eventName) { return function (event) {
        var params = apiRef.current.getCellParams(rowId, field || '');
        apiRef.current.publishEvent(eventName, params, event);
        if (onMouseUp) {
            onMouseUp(event);
        }
    }; }, [apiRef, field, onMouseUp, rowId]);
    var publishMouseDown = React.useCallback(function (eventName) { return function (event) {
        var params = apiRef.current.getCellParams(rowId, field || '');
        apiRef.current.publishEvent(eventName, params, event);
        if (onMouseDown) {
            onMouseDown(event);
        }
    }; }, [apiRef, field, onMouseDown, rowId]);
    var publish = React.useCallback(function (eventName, propHandler) {
        return function (event) {
            // The row might have been deleted during the click
            if (!apiRef.current.getRow(rowId)) {
                return;
            }
            var params = apiRef.current.getCellParams(rowId, field || '');
            apiRef.current.publishEvent(eventName, params, event);
            if (propHandler) {
                propHandler(event);
            }
        };
    }, [apiRef, field, rowId]);
    var isCellRowSpanned = (_f = (_e = hiddenCells[rowId]) === null || _e === void 0 ? void 0 : _e[colIndex]) !== null && _f !== void 0 ? _f : false;
    var rowSpan = (_h = (_g = spannedCells[rowId]) === null || _g === void 0 ? void 0 : _g[colIndex]) !== null && _h !== void 0 ? _h : 1;
    var style = React.useMemo(function () {
        if (isNotVisible) {
            return {
                padding: 0,
                opacity: 0,
                width: 0,
                height: 0,
                border: 0,
            };
        }
        var cellStyle = (0, utils_1.attachPinnedStyle)(__assign({ '--width': "".concat(width, "px") }, styleProp), isRtl, pinnedPosition, pinnedOffset);
        var isLeftPinned = pinnedPosition === constants_1.PinnedColumnPosition.LEFT;
        var isRightPinned = pinnedPosition === constants_1.PinnedColumnPosition.RIGHT;
        if (rowSpan > 1) {
            cellStyle.height = "calc(var(--height) * ".concat(rowSpan, ")");
            cellStyle.zIndex = 10;
            if (isLeftPinned || isRightPinned) {
                cellStyle.zIndex = 40;
            }
        }
        return cellStyle;
    }, [width, isNotVisible, styleProp, pinnedOffset, pinnedPosition, isRtl, rowSpan]);
    React.useEffect(function () {
        if (!hasFocus || cellMode === models_1.GridCellModes.Edit) {
            return;
        }
        var doc = (0, ownerDocument_1.default)(apiRef.current.rootElementRef.current);
        if (cellRef.current && !cellRef.current.contains(doc.activeElement)) {
            var focusableElement = cellRef.current.querySelector('[tabindex="0"]');
            var elementToFocus = focusElementRef.current || focusableElement || cellRef.current;
            if ((0, doesSupportPreventScroll_1.doesSupportPreventScroll)()) {
                elementToFocus.focus({ preventScroll: true });
            }
            else {
                var scrollPosition = apiRef.current.getScrollPosition();
                elementToFocus.focus();
                apiRef.current.scroll(scrollPosition);
            }
        }
    }, [hasFocus, cellMode, apiRef]);
    if (isCellRowSpanned) {
        return (<div data-colindex={colIndex} role="presentation" style={__assign({ width: 'var(--width)' }, style)}/>);
    }
    var handleFocus = other.onFocus;
    if (process.env.NODE_ENV === 'test' &&
        ((_j = rootProps.experimentalFeatures) === null || _j === void 0 ? void 0 : _j.warnIfFocusStateIsNotSynced)) {
        handleFocus = function (event) {
            var focusedCell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
            if ((focusedCell === null || focusedCell === void 0 ? void 0 : focusedCell.id) === rowId && focusedCell.field === field) {
                if (typeof other.onFocus === 'function') {
                    other.onFocus(event);
                }
                return;
            }
            if (!warnedOnce) {
                console.warn([
                    "MUI X: The cell with id=".concat(rowId, " and field=").concat(field, " received focus."),
                    "According to the state, the focus should be at id=".concat(focusedCell === null || focusedCell === void 0 ? void 0 : focusedCell.id, ", field=").concat(focusedCell === null || focusedCell === void 0 ? void 0 : focusedCell.field, "."),
                    "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.",
                    'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.',
                ].join('\n'));
                warnedOnce = true;
            }
        };
    }
    var children;
    var title;
    if (editCellState === null && column.renderCell) {
        children = column.renderCell(cellParams);
    }
    if (editCellState !== null && column.renderEditCell) {
        var updatedRow = apiRef.current.getRowWithUpdatedValues(rowId, column.field);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        var changeReason = editCellState.changeReason, unstable_updateValueOnRender = editCellState.unstable_updateValueOnRender, editCellStateRest = __rest(editCellState, ["changeReason", "unstable_updateValueOnRender"]);
        var formattedValue = column.valueFormatter
            ? column.valueFormatter(editCellState.value, updatedRow, column, apiRef)
            : cellParams.formattedValue;
        var params = __assign(__assign(__assign({}, cellParams), { row: updatedRow, formattedValue: formattedValue }), editCellStateRest);
        children = column.renderEditCell(params);
        classNames.push(gridClasses_1.gridClasses['cell--editing']);
        classNames.push(rootClasses === null || rootClasses === void 0 ? void 0 : rootClasses['cell--editing']);
    }
    if (children === undefined) {
        var valueString = valueToRender === null || valueToRender === void 0 ? void 0 : valueToRender.toString();
        children = valueString;
        title = valueString;
    }
    if (React.isValidElement(children) && canManageOwnFocus) {
        children = React.cloneElement(children, { focusElementRef: focusElementRef });
    }
    var draggableEventHandlers = disableDragEvents
        ? null
        : {
            onDragEnter: publish('cellDragEnter', onDragEnter),
            onDragOver: publish('cellDragOver', onDragOver),
        };
    return (<div className={(0, clsx_1.default)(classes.root, classNames, className)} role="gridcell" data-field={field} data-colindex={colIndex} aria-colindex={colIndex + 1} aria-colspan={colSpan} aria-rowspan={rowSpan} style={style} title={title} tabIndex={tabIndex} onClick={publish('cellClick', onClick)} onDoubleClick={publish('cellDoubleClick', onDoubleClick)} onMouseOver={publish('cellMouseOver', onMouseOver)} onMouseDown={publishMouseDown('cellMouseDown')} onMouseUp={publishMouseUp('cellMouseUp')} onKeyDown={publish('cellKeyDown', onKeyDown)} onKeyUp={publish('cellKeyUp', onKeyUp)} {...draggableEventHandlers} {...other} onFocus={handleFocus} ref={handleRef}>
      {children}
    </div>);
});
GridCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    align: prop_types_1.default.oneOf(['center', 'left', 'right']).isRequired,
    colIndex: prop_types_1.default.number.isRequired,
    colSpan: prop_types_1.default.number,
    column: prop_types_1.default.object.isRequired,
    disableDragEvents: prop_types_1.default.bool,
    isNotVisible: prop_types_1.default.bool.isRequired,
    pinnedOffset: prop_types_1.default.number,
    pinnedPosition: prop_types_1.default.oneOf([0, 1, 2, 3]).isRequired,
    row: prop_types_1.default.object.isRequired,
    rowId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    rowNode: prop_types_1.default.object.isRequired,
    showLeftBorder: prop_types_1.default.bool.isRequired,
    showRightBorder: prop_types_1.default.bool.isRequired,
    width: prop_types_1.default.number.isRequired,
};
var MemoizedGridCell = (0, fastMemo_1.fastMemo)(GridCell);
exports.GridCell = MemoizedGridCell;
