"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRowReorderCell = void 0;
exports.GridRowReorderCell = GridRowReorderCell;
var React = require("react");
var prop_types_1 = require("prop-types");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var isDraggable = ownerState.isDraggable, classes = ownerState.classes;
    var slots = {
        root: ['rowReorderCell', isDraggable && 'rowReorderCell--draggable'],
        placeholder: ['rowReorderCellPlaceholder'],
        icon: ['rowReorderIcon'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
var RowReorderIcon = (0, system_1.styled)('svg', {
    name: 'MuiDataGrid',
    slot: 'RowReorderIcon',
})({
    color: internals_1.vars.colors.foreground.muted,
});
function GridRowReorderCell(params) {
    var apiRef = (0, x_data_grid_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var sortModel = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridSortModelSelector);
    var treeDepth = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridRowMaximumTreeDepthSelector);
    var editRowsState = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridEditRowsStateSelector);
    // eslint-disable-next-line no-underscore-dangle
    var cellValue = params.row.__reorder__ || params.id;
    var cellRef = React.useRef(null);
    var listenerNodeRef = React.useRef(null);
    // TODO: remove sortModel and treeDepth checks once row reorder is compatible
    var isDraggable = React.useMemo(function () {
        return !!rootProps.rowReordering &&
            !sortModel.length &&
            treeDepth === 1 &&
            Object.keys(editRowsState).length === 0;
    }, [rootProps.rowReordering, sortModel, treeDepth, editRowsState]);
    var ownerState = { isDraggable: isDraggable, classes: rootProps.classes };
    var classes = useUtilityClasses(ownerState);
    var publish = React.useCallback(function (eventName, propHandler) {
        return function (event) {
            // Ignore portal
            if ((0, internals_1.isEventTargetInPortal)(event)) {
                return;
            }
            // The row might have been deleted
            if (!apiRef.current.getRow(params.id)) {
                return;
            }
            apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(params.id), event);
            if (propHandler) {
                propHandler(event);
            }
        };
    }, [apiRef, params.id]);
    var handleMouseDown = React.useCallback(function () {
        var _a, _b;
        // Prevent text selection as it will block all the drag events. More context: https://github.com/mui/mui-x/issues/16303
        (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.classList.add(x_data_grid_1.gridClasses['root--disableUserSelection']);
    }, [apiRef]);
    var handleMouseUp = React.useCallback(function () {
        var _a, _b;
        (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.classList.remove(x_data_grid_1.gridClasses['root--disableUserSelection']);
    }, [apiRef]);
    var handleDragEnd = React.useCallback(function (event) {
        handleMouseUp();
        if (apiRef.current.getRow(params.id)) {
            apiRef.current.publishEvent('rowDragEnd', apiRef.current.getRowParams(params.id), event);
        }
        listenerNodeRef.current.removeEventListener('dragend', handleDragEnd);
        listenerNodeRef.current = null;
    }, [apiRef, params.id, handleMouseUp]);
    var handleDragStart = React.useCallback(function (event) {
        if (!cellRef.current) {
            return;
        }
        publish('rowDragStart')(event);
        cellRef.current.addEventListener('dragend', handleDragEnd);
        // cache the node to remove the listener when the drag ends
        listenerNodeRef.current = cellRef.current;
    }, [publish, handleDragEnd]);
    var draggableEventHandlers = isDraggable
        ? {
            onDragStart: handleDragStart,
            onDragOver: publish('rowDragOver'),
            onMouseDown: handleMouseDown,
            onMouseUp: handleMouseUp,
        }
        : null;
    if (params.rowNode.type === 'footer') {
        return null;
    }
    return (<div ref={cellRef} className={classes.root} draggable={isDraggable} {...draggableEventHandlers}>
      <RowReorderIcon as={rootProps.slots.rowReorderIcon} ownerState={ownerState} className={classes.icon} fontSize="small"/>
      <div className={classes.placeholder}>{cellValue}</div>
    </div>);
}
GridRowReorderCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * GridApi that let you manipulate the grid.
     */
    api: prop_types_1.default.object.isRequired,
    /**
     * The mode of the cell.
     */
    cellMode: prop_types_1.default.oneOf(['edit', 'view']).isRequired,
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: prop_types_1.default.object.isRequired,
    /**
     * The column field of the cell that triggered the event.
     */
    field: prop_types_1.default.string.isRequired,
    /**
     * A ref allowing to set imperative focus.
     * It can be passed to the element that should receive focus.
     * @ignore - do not document.
     */
    focusElementRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                focus: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
    /**
     * The cell value formatted with the column valueFormatter.
     */
    formattedValue: prop_types_1.default.any,
    /**
     * If true, the cell is the active element.
     */
    hasFocus: prop_types_1.default.bool.isRequired,
    /**
     * The grid row id.
     */
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    /**
     * If true, the cell is editable.
     */
    isEditable: prop_types_1.default.bool,
    /**
     * The row model of the row that the current cell belongs to.
     */
    row: prop_types_1.default.any.isRequired,
    /**
     * The node of the row that the current cell belongs to.
     */
    rowNode: prop_types_1.default.object.isRequired,
    /**
     * the tabIndex value.
     */
    tabIndex: prop_types_1.default.oneOf([-1, 0]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: prop_types_1.default.any,
};
var renderRowReorderCell = function (params) {
    if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
        return null;
    }
    return <GridRowReorderCell {...params}/>;
};
exports.renderRowReorderCell = renderRowReorderCell;
