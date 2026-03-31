'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import ownerDocument from '@mui/utils/ownerDocument';
import capitalize from '@mui/utils/capitalize';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { useRtl } from '@mui/system/RtlProvider';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useStore } from '@mui/x-internals/store';
import { Rowspan } from '@mui/x-virtualizer';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { doesSupportPreventScroll } from '../../utils/doesSupportPreventScroll';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { GridCellModes, } from '../../models';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridFocusCellSelector, gridTabIndexCellSelector, } from '../../hooks/features/focus/gridFocusStateSelector';
import { GridPinnedColumnPosition } from '../../hooks/features/columns/gridColumnsInterfaces';
import { PinnedColumnPosition } from '../../internals/constants';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { gridEditCellStateSelector } from '../../hooks/features/editing/gridEditingSelectors';
import { attachPinnedStyle } from '../../internals/utils';
import { useGridConfiguration } from '../../hooks/utils/useGridConfiguration';
export const gridPinnedColumnPositionLookup = {
    [PinnedColumnPosition.LEFT]: GridPinnedColumnPosition.LEFT,
    [PinnedColumnPosition.RIGHT]: GridPinnedColumnPosition.RIGHT,
    [PinnedColumnPosition.NONE]: undefined,
    [PinnedColumnPosition.VIRTUAL]: undefined,
};
const useUtilityClasses = (ownerState) => {
    const { align, showLeftBorder, showRightBorder, pinnedPosition, isEditable, isSelected, isSelectionMode, classes, } = ownerState;
    const slots = {
        root: [
            'cell',
            `cell--text${capitalize(align)}`,
            isSelected && 'selected',
            isEditable && 'cell--editable',
            showLeftBorder && 'cell--withLeftBorder',
            showRightBorder && 'cell--withRightBorder',
            pinnedPosition === PinnedColumnPosition.LEFT && 'cell--pinnedLeft',
            pinnedPosition === PinnedColumnPosition.RIGHT && 'cell--pinnedRight',
            isSelectionMode && !isEditable && 'cell--selectionMode',
        ],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
let warnedOnce = false;
// TODO(v7): Removing the wrapper will break the docs performance visualization demo.
const GridCell = forwardRef(function GridCell(props, ref) {
    const { column, row, rowId, rowNode, align, children: childrenProp, colIndex, width, className, style: styleProp, colSpan, disableDragEvents, isNotVisible, pinnedOffset, pinnedPosition, showRightBorder, showLeftBorder, onClick, onDoubleClick, onMouseDown, onMouseUp, onMouseOver, onKeyDown, onKeyUp, onDragEnter, onDragOver, ...other } = props;
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const isRtl = useRtl();
    const field = column.field;
    const editCellState = useGridSelector(apiRef, gridEditCellStateSelector, {
        rowId,
        field,
    });
    const config = useGridConfiguration();
    const cellAggregationResult = config.hooks.useCellAggregationResult(rowId, field);
    const cellMode = editCellState ? GridCellModes.Edit : GridCellModes.View;
    const { value: forcedValue, formattedValue: forcedFormattedValue } = cellAggregationResult || {};
    const cellParams = apiRef.current.getCellParamsForRow(rowId, field, row, {
        colDef: column,
        cellMode,
        rowNode: rowNode,
        tabIndex: useGridSelector(apiRef, () => {
            const cellTabIndex = gridTabIndexCellSelector(apiRef);
            return cellTabIndex && cellTabIndex.field === field && cellTabIndex.id === rowId ? 0 : -1;
        }),
        hasFocus: useGridSelector(apiRef, () => {
            const focus = gridFocusCellSelector(apiRef);
            return focus?.id === rowId && focus.field === field;
        }),
        value: forcedValue,
        formattedValue: forcedFormattedValue,
    });
    cellParams.api = apiRef.current;
    // Subscribe to changes of the `isCellEditable` API result to ensure cells re-render.
    // We don't use the result.
    // Subscription will trigger a new call of `getCellParamsForRow` above which will recompute the correct value of `isEditable`.
    // This is to ensure both of the following cases work:
    // - https://github.com/mui/mui-x/issues/19732
    // - https://github.com/mui/mui-x/issues/20143
    useGridSelector(apiRef, () => apiRef.current.isCellEditable(cellParams));
    const isSelected = useGridSelector(apiRef, () => apiRef.current.unstable_applyPipeProcessors('isCellSelected', false, {
        id: rowId,
        field,
    }));
    const store = apiRef.current.virtualizer.store;
    const hiddenCells = useStore(store, Rowspan.selectors.hiddenCells);
    const spannedCells = useStore(store, Rowspan.selectors.spannedCells);
    const { hasFocus, isEditable = false, value } = cellParams;
    const tabIndex = (cellMode === 'view' || !isEditable) && column.type !== 'actions' ? cellParams.tabIndex : -1;
    const { classes: rootClasses, getCellClassName } = rootProps;
    // There is a hidden grid state access in `applyPipeProcessor('cellClassName', ...)`
    const pipesClassName = useGridSelector(apiRef, () => apiRef.current
        .unstable_applyPipeProcessors('cellClassName', [], {
        id: rowId,
        field,
    })
        .filter(Boolean)
        .join(' '));
    const classNames = [pipesClassName];
    if (column.cellClassName) {
        classNames.push(typeof column.cellClassName === 'function'
            ? column.cellClassName(cellParams)
            : column.cellClassName);
    }
    if (column.display === 'flex') {
        classNames.push(gridClasses['cell--flex']);
    }
    if (getCellClassName) {
        classNames.push(getCellClassName(cellParams));
    }
    const valueToRender = cellParams.formattedValue ?? value;
    const cellRef = React.useRef(null);
    const handleRef = useForkRef(ref, cellRef);
    const isSelectionMode = rootProps.cellSelection ?? false;
    const ownerState = {
        align,
        showLeftBorder,
        showRightBorder,
        isEditable,
        classes: rootProps.classes,
        pinnedPosition,
        isSelected,
        isSelectionMode,
    };
    const classes = useUtilityClasses(ownerState);
    const publishMouseUp = React.useCallback((eventName) => (event) => {
        const params = apiRef.current.getCellParams(rowId, field || '');
        apiRef.current.publishEvent(eventName, params, event);
        if (onMouseUp) {
            onMouseUp(event);
        }
    }, [apiRef, field, onMouseUp, rowId]);
    const publishMouseDown = React.useCallback((eventName) => (event) => {
        const params = apiRef.current.getCellParams(rowId, field || '');
        apiRef.current.publishEvent(eventName, params, event);
        if (onMouseDown) {
            onMouseDown(event);
        }
    }, [apiRef, field, onMouseDown, rowId]);
    const publish = React.useCallback((eventName, propHandler) => (event) => {
        // The row might have been deleted during the click
        if (!apiRef.current.getRow(rowId)) {
            return;
        }
        const params = apiRef.current.getCellParams(rowId, field || '');
        apiRef.current.publishEvent(eventName, params, event);
        if (propHandler) {
            propHandler(event);
        }
    }, [apiRef, field, rowId]);
    const isCellRowSpanned = hiddenCells[rowId]?.[colIndex] ?? false;
    const rowSpan = spannedCells[rowId]?.[colIndex] ?? 1;
    const style = React.useMemo(() => {
        if (isNotVisible) {
            return {
                padding: 0,
                opacity: 0,
                width: 0,
                height: 0,
                border: 0,
            };
        }
        const cellStyle = attachPinnedStyle({
            '--width': `${width}px`,
            ...styleProp,
        }, isRtl, pinnedPosition, pinnedOffset);
        const isLeftPinned = pinnedPosition === PinnedColumnPosition.LEFT;
        const isRightPinned = pinnedPosition === PinnedColumnPosition.RIGHT;
        if (rowSpan > 1) {
            cellStyle.height = `calc(var(--height) * ${rowSpan})`;
            cellStyle.zIndex = 10;
            if (isLeftPinned || isRightPinned) {
                cellStyle.zIndex = 40;
            }
        }
        return cellStyle;
    }, [width, isNotVisible, styleProp, pinnedOffset, pinnedPosition, isRtl, rowSpan]);
    useEnhancedEffect(() => {
        if (!hasFocus || cellMode === GridCellModes.Edit) {
            return;
        }
        const doc = ownerDocument(apiRef.current.rootElementRef.current);
        if (cellRef.current && !cellRef.current.contains(doc.activeElement)) {
            const focusableElement = cellRef.current.querySelector('[tabindex="0"]');
            const elementToFocus = focusableElement || cellRef.current;
            if (doesSupportPreventScroll()) {
                elementToFocus.focus({ preventScroll: true });
            }
            else {
                const scrollPosition = apiRef.current.getScrollPosition();
                elementToFocus.focus();
                apiRef.current.scroll(scrollPosition);
            }
        }
    }, [hasFocus, cellMode, apiRef]);
    if (isCellRowSpanned) {
        return (_jsx("div", { "data-colindex": colIndex, role: "presentation", style: { width: 'var(--width)', ...style } }));
    }
    let handleFocus = other.onFocus;
    if (process.env.NODE_ENV === 'test' &&
        rootProps.experimentalFeatures?.warnIfFocusStateIsNotSynced) {
        handleFocus = (event) => {
            const focusedCell = gridFocusCellSelector(apiRef);
            if (focusedCell?.id === rowId && focusedCell.field === field) {
                if (typeof other.onFocus === 'function') {
                    other.onFocus(event);
                }
                return;
            }
            if (!warnedOnce) {
                console.warn([
                    `MUI X: The cell with id=${rowId} and field=${field} received focus.`,
                    `According to the state, the focus should be at id=${focusedCell?.id}, field=${focusedCell?.field}.`,
                    "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.",
                    'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.',
                ].join('\n'));
                warnedOnce = true;
            }
        };
    }
    let children;
    let title;
    if (editCellState === null && column.renderCell) {
        children = column.renderCell(cellParams);
    }
    if (editCellState !== null && column.renderEditCell) {
        const updatedRow = apiRef.current.getRowWithUpdatedValues(rowId, column.field);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { changeReason, unstable_updateValueOnRender, ...editCellStateRest } = editCellState;
        const formattedValue = column.valueFormatter
            ? column.valueFormatter(editCellState.value, updatedRow, column, apiRef)
            : cellParams.formattedValue;
        const params = {
            ...cellParams,
            row: updatedRow,
            formattedValue,
            ...editCellStateRest,
        };
        children = column.renderEditCell(params);
        classNames.push(gridClasses['cell--editing']);
        classNames.push(rootClasses?.['cell--editing']);
    }
    if (children === undefined) {
        const valueString = valueToRender?.toString();
        children = valueString;
        title = valueString;
    }
    const draggableEventHandlers = disableDragEvents
        ? null
        : {
            onDragEnter: publish('cellDragEnter', onDragEnter),
            onDragOver: publish('cellDragOver', onDragOver),
        };
    return (_jsx("div", { className: clsx(classes.root, classNames, className), role: "gridcell", "data-field": field, "data-colindex": colIndex, "aria-colindex": colIndex + 1, "aria-colspan": colSpan, "aria-rowspan": rowSpan, style: style, title: title, tabIndex: tabIndex, onClick: publish('cellClick', onClick), onDoubleClick: publish('cellDoubleClick', onDoubleClick), onMouseOver: publish('cellMouseOver', onMouseOver), onMouseDown: publishMouseDown('cellMouseDown'), onMouseUp: publishMouseUp('cellMouseUp'), onKeyDown: publish('cellKeyDown', onKeyDown), onKeyUp: publish('cellKeyUp', onKeyUp), ...draggableEventHandlers, ...other, onFocus: handleFocus, ref: handleRef, children: children }));
});
GridCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    align: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
    colIndex: PropTypes.number.isRequired,
    colSpan: PropTypes.number,
    column: PropTypes.object.isRequired,
    disableDragEvents: PropTypes.bool,
    isNotVisible: PropTypes.bool.isRequired,
    pinnedOffset: PropTypes.number,
    pinnedPosition: PropTypes.oneOf([0, 1, 2, 3]).isRequired,
    row: PropTypes.object.isRequired,
    rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    rowNode: PropTypes.object.isRequired,
    showLeftBorder: PropTypes.bool.isRequired,
    showRightBorder: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
};
const MemoizedGridCell = fastMemo(GridCell);
export { MemoizedGridCell as GridCell };
