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
exports.useGridRowReorder = exports.rowReorderStateInitializer = void 0;
var React = require("react");
var useTimeout_1 = require("@mui/utils/useTimeout");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var gridRowReorderColDef_1 = require("./gridRowReorderColDef");
var EMPTY_REORDER_STATE = {
    previousTargetId: null,
    dragDirection: null,
    previousDropPosition: null,
};
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        rowDragging: ['row--dragging'],
        rowDropAbove: ['row--dropAbove'],
        rowDropBelow: ['row--dropBelow'],
        rowBeingDragged: ['row--beingDragged'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
var rowReorderStateInitializer = function (state) { return (__assign(__assign({}, state), { rowReorder: {
        isActive: false,
    } })); };
exports.rowReorderStateInitializer = rowReorderStateInitializer;
/**
 * Hook for row reordering (Pro package)
 * @requires useGridRows (method)
 */
var useGridRowReorder = function (apiRef, props) {
    var logger = (0, x_data_grid_1.useGridLogger)(apiRef, 'useGridRowReorder');
    var sortModel = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridSortModelSelector);
    var dragRowNode = React.useRef(null);
    var originRowIndex = React.useRef(null);
    var removeDnDStylesTimeout = React.useRef(undefined);
    var previousDropIndicatorRef = React.useRef(null);
    var ownerState = { classes: props.classes };
    var classes = useUtilityClasses(ownerState);
    var _a = React.useState(''), dragRowId = _a[0], setDragRowId = _a[1];
    var sortedRowIndexLookup = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridExpandedSortedRowIndexLookupSelector);
    var timeoutRowId = React.useRef('');
    var timeout = (0, useTimeout_1.default)();
    var previousReorderState = React.useRef(EMPTY_REORDER_STATE);
    var dropTarget = React.useRef({
        targetRowId: null,
        targetRowIndex: null,
        dropPosition: null,
    });
    React.useEffect(function () {
        return function () {
            clearTimeout(removeDnDStylesTimeout.current);
        };
    }, []);
    // TODO: remove sortModel check once row reorder is sorting compatible
    // remove treeData check once row reorder is treeData compatible
    var isRowReorderDisabled = React.useMemo(function () {
        return !props.rowReordering || !!sortModel.length || props.treeData;
    }, [props.rowReordering, sortModel, props.treeData]);
    var applyDropIndicator = React.useCallback(function (targetRowId, position) {
        var _a, _b;
        // Remove existing drop indicator from previous target
        if (previousDropIndicatorRef.current) {
            previousDropIndicatorRef.current.classList.remove(classes.rowDropAbove, classes.rowDropBelow);
            previousDropIndicatorRef.current = null;
        }
        // Apply new drop indicator
        if (targetRowId !== undefined && position !== null) {
            var targetRow = (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.querySelector("[data-id=\"".concat(targetRowId, "\"]"));
            if (targetRow) {
                targetRow.classList.add(position === 'above' ? classes.rowDropAbove : classes.rowDropBelow);
                previousDropIndicatorRef.current = targetRow;
            }
        }
    }, [apiRef, classes]);
    var applyDraggedState = React.useCallback(function (rowId, isDragged) {
        var _a, _b;
        if (rowId) {
            var draggedRow = (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.querySelector("[data-id=\"".concat(rowId, "\"]"));
            if (draggedRow) {
                if (isDragged) {
                    draggedRow.classList.add(classes.rowBeingDragged);
                }
                else {
                    draggedRow.classList.remove(classes.rowBeingDragged);
                }
            }
        }
    }, [apiRef, classes.rowBeingDragged]);
    var applyRowAnimation = React.useCallback(function (callback) {
        var _a;
        var rootElement = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current;
        if (!rootElement) {
            return;
        }
        var visibleRows = rootElement.querySelectorAll('[data-id]');
        if (!visibleRows.length) {
            return;
        }
        var rowsArray = Array.from(visibleRows);
        var initialPositions = new Map();
        rowsArray.forEach(function (row) {
            var rowId = row.getAttribute('data-id');
            if (rowId) {
                initialPositions.set(rowId, row.getBoundingClientRect());
            }
        });
        callback();
        // Use `requestAnimationFrame` to ensure DOM has updated
        requestAnimationFrame(function () {
            var newRows = rootElement.querySelectorAll('[data-id]');
            var animations = [];
            newRows.forEach(function (row) {
                var rowId = row.getAttribute('data-id');
                if (!rowId) {
                    return;
                }
                var prevRect = initialPositions.get(rowId);
                if (!prevRect) {
                    return;
                }
                var currentRect = row.getBoundingClientRect();
                var deltaY = prevRect.top - currentRect.top;
                if (Math.abs(deltaY) > 1) {
                    var animation = row.animate([{ transform: "translateY(".concat(deltaY, "px)") }, { transform: 'translateY(0)' }], {
                        duration: 200,
                        easing: 'ease-in-out',
                        fill: 'forwards',
                    });
                    animations.push(animation);
                }
            });
            if (animations.length > 0) {
                Promise.allSettled(animations.map(function (a) { return a.finished; })).then(function () { });
            }
        });
    }, [apiRef]);
    var handleDragStart = React.useCallback(function (params, event) {
        // Call the gridEditRowsStateSelector directly to avoid infnite loop
        var editRowsState = (0, internals_1.gridEditRowsStateSelector)(apiRef);
        event.dataTransfer.effectAllowed = 'copy';
        if (isRowReorderDisabled || Object.keys(editRowsState).length !== 0) {
            return;
        }
        if (timeoutRowId.current) {
            timeout.clear();
            timeoutRowId.current = '';
        }
        logger.debug("Start dragging row ".concat(params.id));
        // Prevent drag events propagation.
        // For more information check here https://github.com/mui/mui-x/issues/2680.
        event.stopPropagation();
        apiRef.current.setRowDragActive(true);
        dragRowNode.current = event.currentTarget;
        // Apply cell-level dragging class to the drag handle
        dragRowNode.current.classList.add(classes.rowDragging);
        setDragRowId(params.id);
        // Apply the dragged state to the entire row
        applyDraggedState(params.id, true);
        removeDnDStylesTimeout.current = setTimeout(function () {
            dragRowNode.current.classList.remove(classes.rowDragging);
        });
        originRowIndex.current = sortedRowIndexLookup[params.id];
        apiRef.current.setCellFocus(params.id, gridRowReorderColDef_1.GRID_REORDER_COL_DEF.field);
    }, [
        apiRef,
        isRowReorderDisabled,
        logger,
        classes.rowDragging,
        applyDraggedState,
        sortedRowIndexLookup,
        timeout,
    ]);
    var handleDragOver = React.useCallback(function (params, event) {
        if (dragRowId === '') {
            return;
        }
        var targetNode = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, params.id);
        var sourceNode = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, dragRowId);
        if (!sourceNode ||
            !targetNode ||
            targetNode.type === 'footer' ||
            targetNode.type === 'pinnedRow' ||
            !event.target) {
            return;
        }
        // Find the relative 'y' mouse position based on the event.target
        var targetRect = event.target.getBoundingClientRect();
        var relativeY = Math.floor(event.clientY - targetRect.top);
        var midPoint = Math.floor(targetRect.height / 2);
        logger.debug("Dragging over row ".concat(params.id));
        event.preventDefault();
        // Prevent drag events propagation.
        // For more information check here https://github.com/mui/mui-x/issues/2680.
        event.stopPropagation();
        if (timeoutRowId.current && timeoutRowId.current !== params.id) {
            timeout.clear();
            timeoutRowId.current = '';
        }
        if (targetNode.type === 'group' &&
            targetNode.depth < sourceNode.depth &&
            !targetNode.childrenExpanded &&
            !timeoutRowId.current) {
            timeout.start(500, function () {
                var rowNode = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, params.id);
                // TODO: Handle `dataSource` case with https://github.com/mui/mui-x/issues/18947
                apiRef.current.setRowChildrenExpansion(params.id, !rowNode.childrenExpanded);
            });
            timeoutRowId.current = params.id;
            return;
        }
        var targetRowIndex = sortedRowIndexLookup[params.id];
        var sourceRowIndex = sortedRowIndexLookup[dragRowId];
        // Determine drop position based on relativeY position within the row
        var dropPosition = relativeY < midPoint ? 'above' : 'below';
        var currentReorderState = {
            dragDirection: targetRowIndex < sourceRowIndex ? 'up' : 'down',
            previousTargetId: params.id,
            previousDropPosition: dropPosition,
        };
        // Update visual indicator when dragging over a different row or position
        if (previousReorderState.current.previousTargetId !== params.id ||
            previousReorderState.current.previousDropPosition !== dropPosition) {
            var isSameNode = targetRowIndex === sourceRowIndex;
            // Check if this is an adjacent position
            var isAdjacentPosition = (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
                (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1);
            var validatedIndex = apiRef.current.unstable_applyPipeProcessors('getRowReorderTargetIndex', -1, {
                sourceRowId: dragRowId,
                targetRowId: params.id,
                dropPosition: dropPosition,
                dragDirection: currentReorderState.dragDirection,
            });
            // Show drop indicator for valid drops OR adjacent positions OR same node
            if (validatedIndex !== -1 || isAdjacentPosition || isSameNode) {
                dropTarget.current = {
                    targetRowId: params.id,
                    targetRowIndex: targetRowIndex,
                    dropPosition: dropPosition,
                };
                applyDropIndicator(params.id, dropPosition);
            }
            else {
                // Clear indicators for invalid drops
                dropTarget.current = {
                    targetRowId: null,
                    targetRowIndex: null,
                    dropPosition: null,
                };
                applyDropIndicator(null, null);
            }
            previousReorderState.current = currentReorderState;
        }
        // Render the native 'copy' cursor for additional visual feedback
        if (dropTarget.current.targetRowId === null) {
            event.dataTransfer.dropEffect = 'none';
        }
        else {
            event.dataTransfer.dropEffect = 'copy';
        }
    }, [dragRowId, apiRef, logger, timeout, sortedRowIndexLookup, applyDropIndicator]);
    var handleDragEnd = React.useCallback(function (_, event) {
        // Call the gridEditRowsStateSelector directly to avoid infnite loop
        var editRowsState = (0, internals_1.gridEditRowsStateSelector)(apiRef);
        if (dragRowId === '' || isRowReorderDisabled || Object.keys(editRowsState).length !== 0) {
            return;
        }
        if (timeoutRowId.current) {
            timeout.clear();
            timeoutRowId.current = '';
        }
        logger.debug('End dragging row');
        event.preventDefault();
        // Prevent drag events propagation.
        // For more information check here https://github.com/mui/mui-x/issues/2680.
        event.stopPropagation();
        clearTimeout(removeDnDStylesTimeout.current);
        dragRowNode.current = null;
        var dragDirection = previousReorderState.current.dragDirection;
        previousReorderState.current = EMPTY_REORDER_STATE;
        // Clear visual indicators and dragged state
        applyDropIndicator(null, null);
        applyDraggedState(dragRowId, false);
        apiRef.current.setRowDragActive(false);
        // Check if the row was dropped outside the grid.
        if (!event.dataTransfer || event.dataTransfer.dropEffect === 'none') {
            // Reset drop target state
            dropTarget.current = {
                targetRowId: null,
                targetRowIndex: null,
                dropPosition: null,
            };
            originRowIndex.current = null;
            setDragRowId('');
            return;
        }
        if (dropTarget.current.targetRowIndex !== null && dropTarget.current.targetRowId !== null) {
            var sourceRowIndex_1 = originRowIndex.current;
            var targetRowIndex = dropTarget.current.targetRowIndex;
            var validatedIndex_1 = apiRef.current.unstable_applyPipeProcessors('getRowReorderTargetIndex', targetRowIndex, {
                sourceRowId: dragRowId,
                targetRowId: dropTarget.current.targetRowId,
                dropPosition: dropTarget.current.dropPosition,
                dragDirection: dragDirection,
            });
            if (validatedIndex_1 !== -1) {
                applyRowAnimation(function () {
                    apiRef.current.setRowIndex(dragRowId, validatedIndex_1);
                    // Emit the rowOrderChange event only once when the reordering stops.
                    var rowOrderChangeParams = {
                        row: apiRef.current.getRow(dragRowId),
                        targetIndex: validatedIndex_1,
                        oldIndex: sourceRowIndex_1,
                    };
                    apiRef.current.publishEvent('rowOrderChange', rowOrderChangeParams);
                });
            }
        }
        // Reset drop target state
        dropTarget.current = {
            targetRowId: null,
            targetRowIndex: null,
            dropPosition: null,
        };
        setDragRowId('');
    }, [
        apiRef,
        dragRowId,
        isRowReorderDisabled,
        logger,
        applyDropIndicator,
        applyDraggedState,
        timeout,
        applyRowAnimation,
    ]);
    var getRowReorderTargetIndex = React.useCallback(function (initialValue, _a) {
        var sourceRowId = _a.sourceRowId, targetRowId = _a.targetRowId, dropPosition = _a.dropPosition, dragDirection = _a.dragDirection;
        if ((0, x_data_grid_1.gridRowMaximumTreeDepthSelector)(apiRef) > 1) {
            return initialValue;
        }
        var targetRowIndex = sortedRowIndexLookup[targetRowId];
        var sourceRowIndex = sortedRowIndexLookup[sourceRowId];
        // Check if this drop would result in no actual movement
        var isAdjacentNode = (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) || // dragging to immediately below (above next row)
            (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1); // dragging to immediately above (below previous row)
        if (isAdjacentNode || sourceRowIndex === targetRowIndex) {
            // Return -1 to prevent actual movement (indicators handled separately)
            return -1;
        }
        var finalTargetIndex;
        if (dragDirection === 'up') {
            finalTargetIndex = dropPosition === 'above' ? targetRowIndex : targetRowIndex + 1;
        }
        else {
            finalTargetIndex = dropPosition === 'above' ? targetRowIndex - 1 : targetRowIndex;
        }
        return finalTargetIndex;
    }, [apiRef, sortedRowIndexLookup]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'getRowReorderTargetIndex', getRowReorderTargetIndex);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'rowDragStart', handleDragStart);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'rowDragOver', handleDragOver);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'rowDragEnd', handleDragEnd);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'cellDragOver', handleDragOver);
    (0, x_data_grid_1.useGridEventPriority)(apiRef, 'rowOrderChange', props.onRowOrderChange);
    var setRowDragActive = React.useCallback(function (isActive) {
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { rowReorder: __assign(__assign({}, state.rowReorder), { isActive: isActive }) })); });
    }, [apiRef]);
    (0, x_data_grid_1.useGridApiMethod)(apiRef, {
        setRowDragActive: setRowDragActive,
    }, 'private');
};
exports.useGridRowReorder = useGridRowReorder;
