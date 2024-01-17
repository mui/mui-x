import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
  unstable_ownerDocument as ownerDocument,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import type { GridApiCommunity } from '../../internals';
import { fastMemo } from '../../utils/fastMemo';
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
import { MissingRowIdError } from '../../hooks/features/rows/useGridParamsApi';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export enum PinnedPosition {
  NONE,
  LEFT,
  RIGHT,
}

export type GridCellProps = {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  column: GridColDef;
  rowId: GridRowId;
  height: number | 'auto';
  width: number;
  colSpan?: number;
  disableDragEvents?: boolean;
  isNotVisible: boolean;
  editCellState: GridEditCellProps<any> | null;
  pinnedOffset: number;
  pinnedPosition: PinnedPosition;
  sectionIndex: number;
  sectionLength: number;
  gridHasScrollX: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onDragEnter?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  [x: string]: any; // TODO v7: remove this - it breaks type safety
};

type CellParamsWithAPI = GridCellParams<any, any, any, GridTreeNodeWithRender> & {
  api: GridApiCommunity;
};
const EMPTY_CELL_PARAMS: CellParamsWithAPI = {
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
      pinnedPosition === PinnedPosition.LEFT && 'cell--pinnedLeft',
      pinnedPosition === PinnedPosition.RIGHT && 'cell--pinnedRight',
      isSelectionMode && !isEditable && 'cell--selectionMode',
    ],
    content: ['cellContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

let warnedOnce = false;

// TODO(v7): Removing the wrapper will break the docs performance visualization demo.

const GridCell = React.forwardRef<HTMLDivElement, GridCellProps>((props, ref) => {
  const {
    column,
    rowId,
    editCellState,
    align,
    children: childrenProp,
    colIndex,
    height,
    width,
    className,
    style: styleProp,
    gridHasScrollX,
    colSpan,
    disableDragEvents,
    isNotVisible,
    pinnedOffset,
    pinnedPosition,
    sectionIndex,
    sectionLength,
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

  const field = column.field;

  const cellParamsWithAPI = useGridSelector(
    apiRef,
    () => {
      // This is required because `.getCellParams` tries to get the `state.rows.tree` entry
      // associated with `rowId`/`fieldId`, but this selector runs after the state has been
      // updated, while `rowId`/`fieldId` reference an entry in the old state.
      try {
        const cellParams = apiRef.current.getCellParams<any, any, any, GridTreeNodeWithRender>(
          rowId,
          field,
        );

        const result = cellParams as CellParamsWithAPI;
        result.api = apiRef.current;
        return result;
      } catch (e) {
        if (e instanceof MissingRowIdError) {
          return EMPTY_CELL_PARAMS;
        }
        throw e;
      }
    },
    objectShallowCompare,
  );

  const isSelected = useGridSelector(apiRef, () =>
    apiRef.current.unstable_applyPipeProcessors('isCellSelected', false, {
      id: rowId,
      field,
    }),
  );

  const { cellMode, hasFocus, isEditable = false, value, formattedValue } = cellParamsWithAPI;

  const canManageOwnFocus =
    column.type === 'actions' &&
    (column as GridActionsColDef)
      .getActions?.(apiRef.current.getRowParams(rowId))
      .some((action) => !action.props.disabled);
  const tabIndex =
    (cellMode === 'view' || !isEditable) && !canManageOwnFocus ? cellParamsWithAPI.tabIndex : -1;

  const { classes: rootClasses, getCellClassName } = rootProps;

  const classNames = apiRef.current.unstable_applyPipeProcessors('cellClassName', [], {
    id: rowId,
    field,
  }) as (string | undefined)[];

  if (column.cellClassName) {
    classNames.push(
      typeof column.cellClassName === 'function'
        ? column.cellClassName(cellParamsWithAPI)
        : column.cellClassName,
    );
  }

  if (getCellClassName) {
    classNames.push(getCellClassName(cellParamsWithAPI));
  }

  const valueToRender = formattedValue == null ? value : formattedValue;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, cellRef);
  const focusElementRef = React.useRef<FocusElement>(null);
  // @ts-expect-error To access `cellSelection` flag as it's a `premium` feature
  const isSelectionMode = rootProps.cellSelection ?? false;

  const isSectionLastCell = sectionIndex === sectionLength - 1;

  const showLeftBorder = pinnedPosition === PinnedPosition.RIGHT && sectionIndex === 0;

  const showRightBorder =
    (rootProps.showCellVerticalBorder &&
      (pinnedPosition !== PinnedPosition.LEFT ? !isSectionLastCell : true)) ||
    (pinnedPosition === PinnedPosition.LEFT && isSectionLastCell);

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

  const style = React.useMemo(() => {
    if (isNotVisible) {
      return {
        padding: 0,
        opacity: 0,
        width: 0,
        border: 0,
      };
    }
    const cellStyle = {
      '--width': `${width}px`,
      '--height': typeof height === 'number' ? `${height}px` : height,
      ...styleProp,
    } as React.CSSProperties;

    if (pinnedPosition === PinnedPosition.LEFT) {
      cellStyle.left = pinnedOffset;
    }

    if (pinnedPosition === PinnedPosition.RIGHT) {
      cellStyle.right = pinnedOffset;
    }

    return cellStyle;
  }, [width, height, isNotVisible, styleProp, pinnedOffset, pinnedPosition]);

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

  if (cellParamsWithAPI === EMPTY_CELL_PARAMS) {
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
  if (editCellState == null && column.renderCell) {
    children = column.renderCell(cellParamsWithAPI);
    classNames.push(gridClasses['cell--withRenderer']);
    classNames.push(rootClasses?.['cell--withRenderer']);
  }

  if (editCellState != null && column.renderEditCell) {
    const updatedRow = apiRef.current.getRowWithUpdatedValues(rowId, column.field);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { changeReason, unstable_updateValueOnRender, ...editCellStateRest } = editCellState;

    const params: GridRenderEditCellParams = {
      ...cellParamsWithAPI,
      row: updatedRow,
      ...editCellStateRest,
    };

    children = column.renderEditCell(params);
    classNames.push(gridClasses['cell--editing']);
    classNames.push(rootClasses?.['cell--editing']);
  }

  if (children === undefined) {
    const valueString = valueToRender?.toString();
    children = (
      <div className={classes.content} title={valueString} role="presentation">
        {valueString}
      </div>
    );
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

  const ariaV7 = rootProps.experimentalFeatures?.ariaV7;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={handleRef}
      className={clsx(className, classNames, classes.root)}
      role={ariaV7 ? 'gridcell' : 'cell'}
      data-field={field}
      data-colindex={colIndex}
      aria-colindex={colIndex + 1}
      aria-colspan={colSpan}
      style={style}
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
    >
      {children}
    </div>
  );
});

GridCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.oneOf(['center', 'left', 'right']).isRequired,
  className: PropTypes.string,
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
  gridHasScrollX: PropTypes.bool.isRequired,
  height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  isNotVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  pinnedOffset: PropTypes.number.isRequired,
  pinnedPosition: PropTypes.oneOf([0, 1, 2]).isRequired,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  sectionLength: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
} as any;

const MemoizedGridCell = fastMemo(GridCell);

export { MemoizedGridCell as GridCell };
