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
exports.useGridColumnReorder = exports.columnReorderStateInitializer = void 0;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var x_data_grid_1 = require("@mui/x-data-grid");
var columnReorderSelector_1 = require("./columnReorderSelector");
var CURSOR_MOVE_DIRECTION_LEFT = 'left';
var CURSOR_MOVE_DIRECTION_RIGHT = 'right';
var getCursorMoveDirectionX = function (currentCoordinates, nextCoordinates) {
    return currentCoordinates.x <= nextCoordinates.x
        ? CURSOR_MOVE_DIRECTION_RIGHT
        : CURSOR_MOVE_DIRECTION_LEFT;
};
var hasCursorPositionChanged = function (currentCoordinates, nextCoordinates) {
    return currentCoordinates.x !== nextCoordinates.x || currentCoordinates.y !== nextCoordinates.y;
};
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        columnHeaderDragging: ['columnHeader--dragging'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
var columnReorderStateInitializer = function (state) { return (__assign(__assign({}, state), { columnReorder: { dragCol: '' } })); };
exports.columnReorderStateInitializer = columnReorderStateInitializer;
/**
 * @requires useGridColumns (method)
 */
var useGridColumnReorder = function (apiRef, props) {
    var logger = (0, x_data_grid_1.useGridLogger)(apiRef, 'useGridColumnReorder');
    var dragColNode = React.useRef(null);
    var cursorPosition = React.useRef({
        x: 0,
        y: 0,
    });
    var originColumnIndex = React.useRef(null);
    var forbiddenIndexes = React.useRef({});
    var removeDnDStylesTimeout = React.useRef(undefined);
    var ownerState = { classes: props.classes };
    var classes = useUtilityClasses(ownerState);
    var isRtl = (0, RtlProvider_1.useRtl)();
    React.useEffect(function () {
        return function () {
            clearTimeout(removeDnDStylesTimeout.current);
        };
    }, []);
    var handleDragEnd = React.useCallback(function (params, event) {
        var dragColField = (0, columnReorderSelector_1.gridColumnReorderDragColSelector)(apiRef);
        if (props.disableColumnReorder || !dragColField) {
            return;
        }
        logger.debug('End dragging col');
        event.preventDefault();
        // Prevent drag events propagation.
        // For more information check here https://github.com/mui/mui-x/issues/2680.
        event.stopPropagation();
        clearTimeout(removeDnDStylesTimeout.current);
        // For more information check here https://github.com/mui/mui-x/issues/14678
        if (dragColNode.current.classList.contains(classes.columnHeaderDragging)) {
            dragColNode.current.classList.remove(classes.columnHeaderDragging);
        }
        dragColNode.current = null;
        // Check if the column was dropped outside the grid.
        if (event.dataTransfer.dropEffect === 'none' && !props.keepColumnPositionIfDraggedOutside) {
            // Accessing params.field may contain the wrong field as header elements are reused
            apiRef.current.setColumnIndex(dragColField, originColumnIndex.current);
            originColumnIndex.current = null;
        }
        else {
            // Emit the columnOrderChange event only once when the reordering stops.
            var columnOrderChangeParams = {
                column: apiRef.current.getColumn(dragColField),
                targetIndex: apiRef.current.getColumnIndexRelativeToVisibleColumns(dragColField),
                oldIndex: originColumnIndex.current,
            };
            apiRef.current.publishEvent('columnOrderChange', columnOrderChangeParams);
        }
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { columnReorder: __assign(__assign({}, state.columnReorder), { dragCol: '' }) })); });
    }, [
        apiRef,
        props.disableColumnReorder,
        props.keepColumnPositionIfDraggedOutside,
        logger,
        classes.columnHeaderDragging,
    ]);
    var handleDragStart = React.useCallback(function (params, event) {
        if (props.disableColumnReorder || params.colDef.disableReorder) {
            return;
        }
        logger.debug("Start dragging col ".concat(params.field));
        // Prevent drag events propagation.
        // For more information check here https://github.com/mui/mui-x/issues/2680.
        event.stopPropagation();
        dragColNode.current = event.currentTarget;
        dragColNode.current.classList.add(classes.columnHeaderDragging);
        var handleDragEndEvent = function (dragEndEvent) {
            dragColNode.current.removeEventListener('dragend', handleDragEndEvent);
            apiRef.current.publishEvent('columnHeaderDragEndNative', params, dragEndEvent);
        };
        dragColNode.current.addEventListener('dragend', handleDragEndEvent);
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
        }
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { columnReorder: __assign(__assign({}, state.columnReorder), { dragCol: params.field }) })); });
        removeDnDStylesTimeout.current = setTimeout(function () {
            dragColNode.current.classList.remove(classes.columnHeaderDragging);
        });
        originColumnIndex.current = apiRef.current.getColumnIndex(params.field, false);
        var draggingColumnGroupPath = apiRef.current.getColumnGroupPath(params.field);
        var columnIndex = originColumnIndex.current;
        var allColumns = apiRef.current.getAllColumns();
        var groupsLookup = apiRef.current.getAllGroupDetails();
        var getGroupPathFromColumnIndex = function (colIndex) {
            var field = allColumns[colIndex].field;
            return apiRef.current.getColumnGroupPath(field);
        };
        // The limitingGroupId is the id of the group from which the dragged column should not escape
        var limitingGroupId = null;
        draggingColumnGroupPath.forEach(function (groupId) {
            var _a;
            if (!((_a = groupsLookup[groupId]) === null || _a === void 0 ? void 0 : _a.freeReordering)) {
                // Only consider group that are made of more than one column
                if (columnIndex > 0 && getGroupPathFromColumnIndex(columnIndex - 1).includes(groupId)) {
                    limitingGroupId = groupId;
                }
                else if (columnIndex + 1 < allColumns.length &&
                    getGroupPathFromColumnIndex(columnIndex + 1).includes(groupId)) {
                    limitingGroupId = groupId;
                }
            }
        });
        forbiddenIndexes.current = {};
        var _loop_1 = function (indexToForbid) {
            var leftIndex = indexToForbid <= columnIndex ? indexToForbid - 1 : indexToForbid;
            var rightIndex = indexToForbid < columnIndex ? indexToForbid : indexToForbid + 1;
            if (limitingGroupId !== null) {
                // verify this indexToForbid will be linked to the limiting group. Otherwise forbid it
                var allowIndex = false;
                if (leftIndex >= 0 && getGroupPathFromColumnIndex(leftIndex).includes(limitingGroupId)) {
                    allowIndex = true;
                }
                else if (rightIndex < allColumns.length &&
                    getGroupPathFromColumnIndex(rightIndex).includes(limitingGroupId)) {
                    allowIndex = true;
                }
                if (!allowIndex) {
                    forbiddenIndexes.current[indexToForbid] = true;
                }
            }
            // Verify we are not splitting another group
            if (leftIndex >= 0 && rightIndex < allColumns.length) {
                getGroupPathFromColumnIndex(rightIndex).forEach(function (groupId) {
                    var _a;
                    if (getGroupPathFromColumnIndex(leftIndex).includes(groupId)) {
                        if (!draggingColumnGroupPath.includes(groupId)) {
                            // moving here split the group groupId in two distincts chunks
                            if (!((_a = groupsLookup[groupId]) === null || _a === void 0 ? void 0 : _a.freeReordering)) {
                                forbiddenIndexes.current[indexToForbid] = true;
                            }
                        }
                    }
                });
            }
        };
        for (var indexToForbid = 0; indexToForbid < allColumns.length; indexToForbid += 1) {
            _loop_1(indexToForbid);
        }
    }, [props.disableColumnReorder, classes.columnHeaderDragging, logger, apiRef]);
    var handleDragEnter = React.useCallback(function (params, event) {
        event.preventDefault();
        // Prevent drag events propagation.
        // For more information check here https://github.com/mui/mui-x/issues/2680.
        event.stopPropagation();
    }, []);
    var handleDragOver = React.useCallback(function (params, event) {
        var dragColField = (0, columnReorderSelector_1.gridColumnReorderDragColSelector)(apiRef);
        if (!dragColField) {
            return;
        }
        logger.debug("Dragging over col ".concat(params.field));
        event.preventDefault();
        // Prevent drag events propagation.
        // For more information check here https://github.com/mui/mui-x/issues/2680.
        event.stopPropagation();
        var coordinates = { x: event.clientX, y: event.clientY };
        if (params.field !== dragColField &&
            hasCursorPositionChanged(cursorPosition.current, coordinates)) {
            var targetColIndex = apiRef.current.getColumnIndex(params.field, false);
            var targetColVisibleIndex = apiRef.current.getColumnIndex(params.field, true);
            var targetCol = apiRef.current.getColumn(params.field);
            var dragColIndex = apiRef.current.getColumnIndex(dragColField, false);
            var visibleColumns = apiRef.current.getVisibleColumns();
            var allColumns = apiRef.current.getAllColumns();
            var cursorMoveDirectionX = getCursorMoveDirectionX(cursorPosition.current, coordinates);
            var hasMovedLeft = cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_LEFT &&
                (isRtl ? dragColIndex < targetColIndex : targetColIndex < dragColIndex);
            var hasMovedRight = cursorMoveDirectionX === CURSOR_MOVE_DIRECTION_RIGHT &&
                (isRtl ? targetColIndex < dragColIndex : dragColIndex < targetColIndex);
            if (hasMovedLeft || hasMovedRight) {
                var canBeReordered = void 0;
                var indexOffsetInHiddenColumns = 0;
                if (!targetCol.disableReorder) {
                    canBeReordered = true;
                }
                else if (hasMovedLeft) {
                    canBeReordered =
                        targetColVisibleIndex > 0 &&
                            !visibleColumns[targetColVisibleIndex - 1].disableReorder;
                }
                else {
                    canBeReordered =
                        targetColVisibleIndex < visibleColumns.length - 1 &&
                            !visibleColumns[targetColVisibleIndex + 1].disableReorder;
                }
                if (forbiddenIndexes.current[targetColIndex]) {
                    var nextVisibleColumnField = void 0;
                    var indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
                    if (hasMovedLeft) {
                        nextVisibleColumnField =
                            targetColVisibleIndex > 0 ? visibleColumns[targetColVisibleIndex - 1].field : null;
                        while (indexWithOffset > 0 &&
                            allColumns[indexWithOffset].field !== nextVisibleColumnField &&
                            forbiddenIndexes.current[indexWithOffset]) {
                            indexOffsetInHiddenColumns -= 1;
                            indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
                        }
                    }
                    else {
                        nextVisibleColumnField =
                            targetColVisibleIndex + 1 < visibleColumns.length
                                ? visibleColumns[targetColVisibleIndex + 1].field
                                : null;
                        while (indexWithOffset < allColumns.length - 1 &&
                            allColumns[indexWithOffset].field !== nextVisibleColumnField &&
                            forbiddenIndexes.current[indexWithOffset]) {
                            indexOffsetInHiddenColumns += 1;
                            indexWithOffset = targetColIndex + indexOffsetInHiddenColumns;
                        }
                    }
                    if (forbiddenIndexes.current[indexWithOffset] ||
                        allColumns[indexWithOffset].field === nextVisibleColumnField) {
                        // If we ended up on a visible column, or a forbidden one, we cannot do the reorder
                        canBeReordered = false;
                    }
                }
                var canBeReorderedProcessed = apiRef.current.unstable_applyPipeProcessors('canBeReordered', canBeReordered, { targetIndex: targetColVisibleIndex });
                if (canBeReorderedProcessed) {
                    apiRef.current.setColumnIndex(dragColField, targetColIndex + indexOffsetInHiddenColumns);
                }
            }
            cursorPosition.current = coordinates;
        }
    }, [apiRef, logger, isRtl]);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'columnHeaderDragStart', handleDragStart);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'columnHeaderDragEnter', handleDragEnter);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'columnHeaderDragOver', handleDragOver);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'columnHeaderDragEndNative', handleDragEnd);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'cellDragEnter', handleDragEnter);
    (0, x_data_grid_1.useGridEvent)(apiRef, 'cellDragOver', handleDragOver);
    (0, x_data_grid_1.useGridEventPriority)(apiRef, 'columnOrderChange', props.onColumnOrderChange);
};
exports.useGridColumnReorder = useGridColumnReorder;
