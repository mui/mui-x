'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { ClassValue } from 'clsx';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import ownerDocument from '@mui/utils/ownerDocument';
import capitalize from '@mui/utils/capitalize';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { useRtl } from '@mui/system/RtlProvider';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useStore } from '@base-ui/utils/store';
import { Rowspan } from '@mui/x-virtualizer';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { focusElement } from '../../utils/focusElement';
import { PRE_MOUNTED_EDITOR_SELECTOR, isImeKeyDown } from '../../utils/cellEditor';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { GridCellModes } from '../../models';
import type { GridCellEventLookup, GridEvents, GridRowId, GridEditCellProps } from '../../models';
import type { GridRenderEditCellParams, GridCellParams } from '../../models/params/gridCellParams';
import type { GridAlignment, GridStateColDef } from '../../models/colDef/gridColDef';
import type { GridRowModel, GridTreeNode, GridTreeNodeWithRender } from '../../models/gridRows';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import {
  gridFocusCellSelector,
  gridTabIndexCellSelector,
} from '../../hooks/features/focus/gridFocusStateSelector';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { PinnedColumnPosition } from '../../internals/constants';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { usePinnedScrollOffset } from '../../hooks/utils/usePinnedScrollOffset';
import { gridEditCellStateSelector } from '../../hooks/features/editing/gridEditingSelectors';
import { attachPinnedStyle } from '../../internals/utils';
import { useGridConfiguration } from '../../hooks/utils/useGridConfiguration';
import { getDefaultCellValue } from '../../hooks/features/editing/utils';
import { renderEditInputCell } from './GridEditInputCell';

export type GridCellProps = React.HTMLAttributes<HTMLDivElement> & {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  column: GridStateColDef;
  row: GridRowModel;
  rowId: GridRowId;
  rowNode: GridTreeNode;
  width: number;
  colSpan?: number;
  disableDragEvents?: boolean;
  isNotVisible: boolean;
  pinnedOffset?: number;
  pinnedPosition: PinnedColumnPosition;
  showRightBorder: boolean;
  showLeftBorder: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onDragEnter?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<Element>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [x: `data-${string}`]: string;
};

type OwnerState = Pick<GridCellProps, 'align' | 'pinnedPosition'> & {
  showLeftBorder: boolean;
  showRightBorder: boolean;
  isEditable: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
  classes: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const {
    align,
    showLeftBorder,
    showRightBorder,
    pinnedPosition,
    isEditable,
    isSelected,
    isSelectionMode,
    classes,
  } = ownerState;

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

// The cell can render only the default edit component of string columns before edit mode starts.
function canPreMountEditor(column: GridStateColDef) {
  return column.type === 'string' && column.renderEditCell === renderEditInputCell;
}

// Prevents autofill, spell check, and password manager icons on the editor before edit mode starts.
// The editor gets the focus each time that the user moves the focus to an editable cell.
const PRE_MOUNTED_EDITOR_INPUT_PROPS = {
  autoComplete: 'off',
  spellCheck: false,
  'data-lpignore': 'true',
  'data-1p-ignore': '',
  'data-bwignore': '',
  'data-form-type': 'other',
};

// Enter in a text input submits the parent form. Enter in a cell has no default action.
// Keep the behavior of the cell. Do not prevent the Enter that confirms an IME composition.
function handlePreMountedEditorKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
  if (event.key === 'Enter' && !isImeKeyDown(event)) {
    event.preventDefault();
  }
}

function isCoarsePointer() {
  // On touch devices, an editable element with focus opens the virtual keyboard.
  return typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches;
}

// TODO(v7): Removing the wrapper will break the docs performance visualization demo.

const GridCell = forwardRef<HTMLDivElement, GridCellProps>(function GridCell(props, ref) {
  const {
    column,
    row,
    rowId,
    rowNode,
    align,
    children: childrenProp,
    colIndex,
    width,
    className,
    style: styleProp,
    colSpan,
    disableDragEvents,
    isNotVisible,
    pinnedOffset,
    pinnedPosition,
    showRightBorder,
    showLeftBorder,
    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseUp,
    onMouseOver,
    onKeyDown,
    onKeyUp,
    onDragEnter,
    onDragOver,
    ...other
  } = props;

  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const isRtl = useRtl();

  const field = column.field;

  const editCellState: GridEditCellProps | null = useGridSelector(
    apiRef,
    gridEditCellStateSelector,
    {
      rowId,
      field,
    },
  );

  const config = useGridConfiguration();
  const cellAggregationResult = config.hooks.useCellAggregationResult(rowId, field);
  const cellMode: GridCellModes = editCellState ? GridCellModes.Edit : GridCellModes.View;

  const { value: forcedValue, formattedValue: forcedFormattedValue } = cellAggregationResult || {};
  const stateTabIndex = useGridSelector(apiRef, () => {
    const cellTabIndex = gridTabIndexCellSelector(apiRef);
    return cellTabIndex && cellTabIndex.field === field && cellTabIndex.id === rowId ? 0 : -1;
  });

  const cellParams: GridCellParams<any, any, any, any> = apiRef.current.getCellParamsForRow<
    any,
    any,
    any,
    GridTreeNodeWithRender
  >(rowId, field, row, {
    colDef: column,
    cellMode,
    rowNode: rowNode as GridTreeNodeWithRender,
    // A cell kept mounted outside the render context is collapsed to zero size, so it must not
    // become the grid's tab stop: tabbing in would move focus to something the user can't see.
    tabIndex: isNotVisible ? -1 : stateTabIndex,
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

  const isSelected = useGridSelector(apiRef, () =>
    apiRef.current.unstable_applyPipeProcessors('isCellSelected', false, {
      id: rowId,
      field,
    }),
  );

  const store = apiRef.current.virtualizer.store;
  const hiddenCells = useStore(store, Rowspan.selectors.hiddenCells);
  const spannedCells = useStore(store, Rowspan.selectors.spannedCells);

  const { hasFocus, isEditable = false, value } = cellParams;

  const tabIndex =
    (cellMode === 'view' || !isEditable) && column.type !== 'actions' ? cellParams.tabIndex : -1;

  const imeFastEdit = !!rootProps.experimentalFeatures?.imeFastEdit;
  // An IME only composes in an editable element that has focus before the first key.
  // So the focused cell renders its editor before edit mode starts. The cell hides the editor and focuses it.
  // A mousedown outside the grid can prevent the default behavior. Then the grid clears the focus state,
  // but the DOM focus stays in the editor. Keep the editor while it has the DOM focus.
  // Then the focus does not move to the body.
  const [editorHasDomFocus, setEditorHasDomFocus] = React.useState(false);
  const isEditorPreMounted =
    imeFastEdit &&
    cellMode === GridCellModes.View &&
    ((hasFocus && isEditable) || editorHasDomFocus) &&
    canPreMountEditor(column) &&
    !isCoarsePointer();
  // React does not call `onBlur` when it removes an element that has the focus.
  // For example, a change of the column type removes the editor.
  // Reset the state, so that the cell does not render the editor again when the column changes back.
  if (editorHasDomFocus && !isEditorPreMounted && cellMode === GridCellModes.View) {
    setEditorHasDomFocus(false);
  }

  const { classes: rootClasses, getCellClassName } = rootProps;

  // There is a hidden grid state access in `applyPipeProcessor('cellClassName', ...)`
  const pipesClassName = useGridSelector(apiRef, () =>
    apiRef.current
      .unstable_applyPipeProcessors('cellClassName', [], {
        id: rowId,
        field,
      })
      .filter(Boolean)
      .join(' '),
  );

  const classNames: ClassValue[] = [pipesClassName];

  if (column.cellClassName) {
    classNames.push(
      typeof column.cellClassName === 'function'
        ? column.cellClassName(cellParams)
        : column.cellClassName,
    );
  }

  if (column.display === 'flex') {
    classNames.push(gridClasses['cell--flex']);
  }

  if (getCellClassName) {
    classNames.push(getCellClassName(cellParams));
  }

  const valueToRender = cellParams.formattedValue ?? value;
  const cellRef = React.useRef<HTMLDivElement>(null);
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

  // Tells if the next focus event of the cell comes from a mousedown.
  const isMouseDownRef = React.useRef(false);

  const publishMouseUp = React.useCallback(
    (eventName: GridEvents) => (event: React.MouseEvent<HTMLDivElement>) => {
      isMouseDownRef.current = false;
      // The row might have been deleted during the click
      if (!apiRef.current.getRow(rowId)) {
        return;
      }

      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName, params, event);

      if (onMouseUp) {
        onMouseUp(event);
      }
    },
    [apiRef, field, onMouseUp, rowId],
  );

  const publishMouseDown = React.useCallback(
    (eventName: GridEvents) => (event: React.MouseEvent<HTMLDivElement>) => {
      isMouseDownRef.current = true;
      // The row might have been deleted during the click
      if (!apiRef.current.getRow(rowId)) {
        return;
      }

      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName, params, event);
      if (onMouseDown) {
        onMouseDown(event);
      }
    },
    [apiRef, field, onMouseDown, rowId],
  );

  const publish = React.useCallback(
    (
      eventName: keyof GridCellEventLookup,
      propHandler: React.EventHandler<any> | undefined,
    ): React.EventHandler<any> =>
      (event) => {
        // The row might have been deleted during the click
        if (!apiRef.current.getRow(rowId)) {
          return;
        }

        const params = apiRef.current.getCellParams(rowId!, field || '');
        apiRef.current.publishEvent(eventName, params, event);

        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, field, rowId],
  );

  const isCellRowSpanned = hiddenCells[rowId]?.[colIndex] ?? false;
  const rowSpan = spannedCells[rowId]?.[colIndex] ?? 1;

  const pinnedScrollOffset = usePinnedScrollOffset(apiRef, pinnedPosition);

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

    const cellStyle = attachPinnedStyle(
      {
        '--width': `${width}px`,
        ...styleProp,
      } as React.CSSProperties,
      isRtl,
      pinnedPosition,
      pinnedOffset !== undefined ? pinnedOffset + pinnedScrollOffset : undefined,
    );

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
  }, [
    width,
    isNotVisible,
    styleProp,
    pinnedOffset,
    pinnedPosition,
    pinnedScrollOffset,
    isRtl,
    rowSpan,
  ]);

  useEnhancedEffect(() => {
    if (!hasFocus || cellMode === GridCellModes.Edit) {
      return;
    }

    const doc = ownerDocument(apiRef.current.rootElementRef!.current)!;

    if (cellRef.current && !cellRef.current.contains(doc.activeElement!)) {
      // An external editor can legitimately hold DOM focus for the focused cell
      // (e.g. the Premium formula bar) — the same pipe the document click
      // handler consults decides whether pulling focus back is allowed. The
      // pseudo-event only carries the element that owns the focus.
      const canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
        event: { target: doc.activeElement } as unknown as MouseEvent,
        cell: null,
      });
      if (!canUpdateFocus) {
        return;
      }

      const focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusableElement || cellRef.current;

      focusElement(elementToFocus, apiRef);
    }
  }, [hasFocus, cellMode, apiRef]);

  // Moves the focus from the cell to the editor that the cell renders before edit mode starts.
  // Only the cell itself gives the focus to the editor. Thus the editor never takes the focus from another element.
  const focusPreMountedEditor = React.useCallback(() => {
    const doc = ownerDocument(apiRef.current.rootElementRef!.current)!;
    if (!cellRef.current || doc.activeElement !== cellRef.current) {
      return;
    }
    const input = cellRef.current.querySelector<HTMLElement>(
      `${PRE_MOUNTED_EDITOR_SELECTOR} input`,
    );
    if (input) {
      focusElement(input, apiRef);
    }
  }, [apiRef]);

  useEnhancedEffect(() => {
    if (isEditorPreMounted) {
      focusPreMountedEditor();
    }
  }, [isEditorPreMounted, focusPreMountedEditor]);

  // If React removes the editor while it has the focus, the browser moves the focus to the body.
  // For example, a change of the column type removes the editor. Give the focus back to the cell.
  useEnhancedEffect(() => {
    if (!imeFastEdit || isEditorPreMounted || !hasFocus || cellMode !== GridCellModes.View) {
      return;
    }
    const doc = ownerDocument(apiRef.current.rootElementRef!.current)!;
    if (cellRef.current && doc.activeElement === doc.body) {
      focusElement(cellRef.current, apiRef);
    }
  }, [imeFastEdit, isEditorPreMounted, hasFocus, cellMode, apiRef]);

  if (isCellRowSpanned) {
    return <div data-colindex={colIndex} role="none" style={{ width: 'var(--width)', ...style }} />;
  }

  let handleFocus = other.onFocus;

  if (
    process.env.NODE_ENV === 'test' &&
    rootProps.experimentalFeatures?.warnIfFocusStateIsNotSynced
  ) {
    handleFocus = (event: React.FocusEvent) => {
      const focusedCell = gridFocusCellSelector(apiRef);
      if (focusedCell?.id === rowId && focusedCell.field === field) {
        if (typeof other.onFocus === 'function') {
          other.onFocus(event);
        }
        return;
      }

      if (!warnedOnce) {
        console.warn(
          [
            `MUI X: The cell with id=${rowId} and field=${field} received focus.`,
            `According to the state, the focus should be at id=${focusedCell?.id}, field=${focusedCell?.field}.`,
            "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.",
            'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.',
          ].join('\n'),
        );

        warnedOnce = true;
      }
    };
  }

  if (imeFastEdit) {
    const handleFocusWithoutEditor = handleFocus;
    handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
      handleFocusWithoutEditor?.(event);
      const isFromMouseDown = isMouseDownRef.current;
      isMouseDownRef.current = false;
      if (event.target !== event.currentTarget) {
        return;
      }
      if (isEditorPreMounted) {
        // For example, a click on the cell gives the focus to the cell.
        focusPreMountedEditor();
      } else if (
        !isFromMouseDown &&
        !hasFocus &&
        cellMode === GridCellModes.View &&
        isEditable &&
        canPreMountEditor(column)
      ) {
        // The cell can get the focus without the focus state, for example with Tab.
        // Sync the focus state, so that the cell renders its editor.
        // A click does not need this step. The mouseup sets the focus state, as without the editor.
        // The same pipe as the click handler can keep the focus state on another cell.
        const canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
          event: event.nativeEvent as unknown as MouseEvent,
          cell: cellParams,
        });
        if (canUpdateFocus) {
          apiRef.current.setCellFocus(rowId, field);
        }
      }
    };
  }

  let children: React.ReactNode;
  let title: string | undefined;

  if (editCellState === null && column.renderCell) {
    children = column.renderCell(cellParams);
  }

  if (editCellState !== null && column.renderEditCell) {
    const updatedRow = apiRef.current.getRowWithUpdatedValues(rowId, column.field);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { changeReason, unstable_updateValueOnRender, ...editCellStateRest } = editCellState;

    const formattedValue = column.valueFormatter
      ? column.valueFormatter(editCellState.value as never, updatedRow, column, apiRef)
      : cellParams.formattedValue;

    const params: GridRenderEditCellParams = {
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

  if (imeFastEdit) {
    // The editor keeps the same position in view and edit mode. Thus React keeps the same element,
    // and a composition that started before edit mode continues in it.
    let editor: React.ReactNode = null;
    let editorState: 'preMounted' | 'editing' | null = null;
    if (editCellState !== null) {
      editor = children;
      children = null;
      editorState = 'editing';
    } else if (isEditorPreMounted) {
      editor = column.renderEditCell!({
        ...cellParams,
        value: getDefaultCellValue(column),
        isValidating: false,
        isProcessingProps: false,
        // The cell gives the focus to the editor, see `focusPreMountedEditor`.
        hasFocus: false,
        slotProps: {
          root: {
            slotProps: {
              htmlInput: {
                ...PRE_MOUNTED_EDITOR_INPUT_PROPS,
                // The editor replaces the cell as the tab stop.
                tabIndex: cellParams.tabIndex,
                // The input is empty. Screen readers must announce the value of the cell.
                'aria-label': valueToRender?.toString() || undefined,
              },
            },
          },
        },
      });
      editorState = 'preMounted';
    }

    // Keep the same children structure in all cells.
    // Then the view content does not remount when the cell gets the focus.
    children = [
      <React.Fragment key="view">{children}</React.Fragment>,
      editorState === null ? null : (
        <div
          key="editor"
          data-cell-editor={editorState}
          onCompositionStart={
            editorState === 'preMounted' ? publish('cellCompositionStart', undefined) : undefined
          }
          onKeyDown={editorState === 'preMounted' ? handlePreMountedEditorKeyDown : undefined}
          onFocus={() => setEditorHasDomFocus(true)}
          onBlur={() => setEditorHasDomFocus(false)}
        >
          {editor}
        </div>
      ),
    ];
  }

  const draggableEventHandlers = disableDragEvents
    ? null
    : {
        onDragEnter: publish('cellDragEnter', onDragEnter),
        onDragOver: publish('cellDragOver', onDragOver),
      };

  return (
    <div
      className={clsx(classes.root, classNames, className)}
      role={column.rowHeader ? 'rowheader' : 'gridcell'}
      data-field={field}
      data-colindex={colIndex}
      aria-colindex={colIndex + 1}
      aria-colspan={colSpan}
      aria-rowspan={rowSpan}
      style={style}
      title={title}
      tabIndex={isEditorPreMounted ? -1 : tabIndex}
      onClick={publish('cellClick', onClick)}
      onDoubleClick={publish('cellDoubleClick', onDoubleClick)}
      onMouseOver={publish('cellMouseOver', onMouseOver)}
      onMouseDown={publishMouseDown('cellMouseDown')}
      onMouseUp={publishMouseUp('cellMouseUp')}
      onKeyDown={publish('cellKeyDown', onKeyDown)}
      onKeyUp={publish('cellKeyUp', onKeyUp)}
      {...draggableEventHandlers}
      {...other}
      onFocus={handleFocus}
      ref={handleRef}
    >
      {children}
    </div>
  );
});

GridCell.propTypes /* remove-proptypes */ = {
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
} as any;

const MemoizedGridCell = fastMemo(GridCell);

export { MemoizedGridCell as GridCell };
