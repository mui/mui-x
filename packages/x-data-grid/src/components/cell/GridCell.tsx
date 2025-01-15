import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
  unstable_ownerDocument as ownerDocument,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { useRtl } from '@mui/system/RtlProvider';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { doesSupportPreventScroll } from '../../utils/doesSupportPreventScroll';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import {
  GridCellEventLookup,
  GridEvents,
  GridCellModes,
  GridRowId,
  GridEditCellProps,
  GridActionsColDef,
} from '../../models';
import {
  GridRenderEditCellParams,
  FocusElement,
  GridCellParams,
} from '../../models/params/gridCellParams';
import { GridColDef, GridAlignment } from '../../models/colDef/gridColDef';
import { GridTreeNodeWithRender } from '../../models/gridRows';
import { useGridSelector, objectShallowCompare } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridFocusCellSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridPinnedColumnPosition } from '../../hooks/features/columns/gridColumnsInterfaces';
import { PinnedColumnPosition } from '../../internals/constants';
import {
  gridRowSpanningHiddenCellsSelector,
  gridRowSpanningSpannedCellsSelector,
} from '../../hooks/features/rows/gridRowSpanningSelectors';
import { attachPinnedStyle } from '../../internals/utils';

export const gridPinnedColumnPositionLookup = {
  [PinnedColumnPosition.LEFT]: GridPinnedColumnPosition.LEFT,
  [PinnedColumnPosition.RIGHT]: GridPinnedColumnPosition.RIGHT,
  [PinnedColumnPosition.NONE]: undefined,
  [PinnedColumnPosition.VIRTUAL]: undefined,
};

export type GridCellProps = React.HTMLAttributes<HTMLDivElement> & {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  column: GridColDef;
  rowId: GridRowId;
  width: number;
  colSpan?: number;
  disableDragEvents?: boolean;
  isNotVisible: boolean;
  editCellState: GridEditCellProps<any> | null;
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

const EMPTY_CELL_PARAMS: GridCellParams<any, any, any, GridTreeNodeWithRender> = {
  id: -1,
  field: '__unset__',
  row: {},
  rowNode: {
    id: -1,
    depth: 0,
    type: 'leaf',
    parent: -1,
    groupingKey: null,
  },
  colDef: {
    type: 'string',
    field: '__unset__',
    computedWidth: 0,
  },
  cellMode: GridCellModes.View,
  hasFocus: false,
  tabIndex: -1,
  value: null,
  formattedValue: '__unset__',
  isEditable: false,
  api: {} as any,
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

// TODO(v7): Removing the wrapper will break the docs performance visualization demo.

const GridCell = forwardRef<HTMLDivElement, GridCellProps>(function GridCell(props, ref) {
  const {
    column,
    rowId,
    editCellState,
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

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const isRtl = useRtl();

  const field = column.field;

  const cellParams = useGridSelector(
    apiRef,
    () => {
      // This is required because `.getCellParams` tries to get the `state.rows.tree` entry
      // associated with `rowId`/`fieldId`, but this selector runs after the state has been
      // updated, while `rowId`/`fieldId` reference an entry in the old state.
      const row = apiRef.current.getRow(rowId);
      if (!row) {
        return EMPTY_CELL_PARAMS;
      }

      const result = apiRef.current.getCellParams<any, any, any, GridTreeNodeWithRender>(
        rowId,
        field,
      );
      result.api = apiRef.current;
      return result;
    },
    undefined,
    objectShallowCompare,
  );

  const isSelected = useGridSelector(apiRef, () =>
    apiRef.current.unstable_applyPipeProcessors('isCellSelected', false, {
      id: rowId,
      field,
    }),
  );

  const hiddenCells = useGridSelector(apiRef, gridRowSpanningHiddenCellsSelector);
  const spannedCells = useGridSelector(apiRef, gridRowSpanningSpannedCellsSelector);

  const { cellMode, hasFocus, isEditable = false, value } = cellParams;

  const canManageOwnFocus =
    column.type === 'actions' &&
    (column as GridActionsColDef)
      .getActions?.(apiRef.current.getRowParams(rowId))
      .some((action) => !action.props.disabled);
  const tabIndex =
    (cellMode === 'view' || !isEditable) && !canManageOwnFocus ? cellParams.tabIndex : -1;

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

  const classNames = [pipesClassName] as (string | undefined)[];

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
  const focusElementRef = React.useRef<FocusElement>(null);
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

  const publishMouseUp = React.useCallback(
    (eventName: GridEvents) => (event: React.MouseEvent<HTMLDivElement>) => {
      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName as any, params as any, event);

      if (onMouseUp) {
        onMouseUp(event);
      }
    },
    [apiRef, field, onMouseUp, rowId],
  );

  const publishMouseDown = React.useCallback(
    (eventName: GridEvents) => (event: React.MouseEvent<HTMLDivElement>) => {
      const params = apiRef.current.getCellParams(rowId, field || '');
      apiRef.current.publishEvent(eventName as any, params as any, event);

      if (onMouseDown) {
        onMouseDown(event);
      }
    },
    [apiRef, field, onMouseDown, rowId],
  );

  const publish = React.useCallback(
    (eventName: keyof GridCellEventLookup, propHandler: any) =>
      (event: React.SyntheticEvent<HTMLDivElement>) => {
        // The row might have been deleted during the click
        if (!apiRef.current.getRow(rowId)) {
          return;
        }

        const params = apiRef.current.getCellParams(rowId!, field || '');
        apiRef.current.publishEvent(eventName, params, event as any);

        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, field, rowId],
  );

  const isCellRowSpanned = hiddenCells[rowId]?.[field] ?? false;
  const rowSpan = spannedCells[rowId]?.[field] ?? 1;

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
      pinnedOffset,
    );

    const isLeftPinned = pinnedPosition === PinnedColumnPosition.LEFT;
    const isRightPinned = pinnedPosition === PinnedColumnPosition.RIGHT;

    if (rowSpan > 1) {
      cellStyle.height = `calc(var(--height) * ${rowSpan})`;
      cellStyle.zIndex = 5;

      if (isLeftPinned || isRightPinned) {
        cellStyle.zIndex = 6;
      }
    }

    return cellStyle;
  }, [width, isNotVisible, styleProp, pinnedOffset, pinnedPosition, isRtl, rowSpan]);

  React.useEffect(() => {
    if (!hasFocus || cellMode === GridCellModes.Edit) {
      return;
    }

    const doc = ownerDocument(apiRef.current.rootElementRef!.current)!;

    if (cellRef.current && !cellRef.current.contains(doc.activeElement!)) {
      const focusableElement = cellRef.current!.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusElementRef.current || focusableElement || cellRef.current;

      if (doesSupportPreventScroll()) {
        elementToFocus.focus({ preventScroll: true });
      } else {
        const scrollPosition = apiRef.current.getScrollPosition();
        elementToFocus.focus();
        apiRef.current.scroll(scrollPosition);
      }
    }
  }, [hasFocus, cellMode, apiRef]);

  if (isCellRowSpanned) {
    return (
      <div
        data-colindex={colIndex}
        role="presentation"
        style={{ width: 'var(--width)', ...style }}
      />
    );
  }

  if (cellParams === EMPTY_CELL_PARAMS) {
    return null;
  }

  let handleFocus: any = other.onFocus;

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

  if (React.isValidElement(children) && canManageOwnFocus) {
    children = React.cloneElement<any>(children, { focusElementRef });
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
      role="gridcell"
      data-field={field}
      data-colindex={colIndex}
      aria-colindex={colIndex + 1}
      aria-colspan={colSpan}
      aria-rowspan={rowSpan}
      style={style}
      title={title}
      tabIndex={tabIndex}
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
  editCellState: PropTypes.shape({
    changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),
    isProcessingProps: PropTypes.bool,
    isValidating: PropTypes.bool,
    value: PropTypes.any,
  }),
  isNotVisible: PropTypes.bool.isRequired,
  pinnedOffset: PropTypes.number,
  pinnedPosition: PropTypes.oneOf([0, 1, 2, 3]).isRequired,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  showLeftBorder: PropTypes.bool.isRequired,
  showRightBorder: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
} as any;

const MemoizedGridCell = fastMemo(GridCell);

export { MemoizedGridCell as GridCell };
