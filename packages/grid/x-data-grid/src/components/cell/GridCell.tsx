/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
  unstable_ownerDocument as ownerDocument,
  unstable_capitalize as capitalize,
} from '@mui/utils';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import {
  GridCellEventLookup,
  GridEvents,
  GridCellModes,
  GridRowId,
} from '../../models';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { GridColDef, GridAlignment } from '../../models/colDef/gridColDef';
import { GridTreeNodeWithRender } from '../../models/gridRows';
import { useGridSelector, shallowCompare } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridFocusCellSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { gridEditRowsStateSelector } from '../../hooks/features/editing/gridEditingSelectors';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { FocusElement } from '../../models/params/gridCellParams';

export interface GridCellProps {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  column: GridColDef;
  rowId: GridRowId;
  height: number | 'auto';
  showRightBorder?: boolean;
  width: number;
  colSpan?: number;
  disableDragEvents?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onDragEnter?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  [x: string]: any;
}

// Based on https://stackoverflow.com/a/59518678
let cachedSupportsPreventScroll: boolean;
function doesSupportPreventScroll(): boolean {
  if (cachedSupportsPreventScroll === undefined) {
    document.createElement('div').focus({
      get preventScroll() {
        cachedSupportsPreventScroll = true;
        return false;
      },
    });
  }
  return cachedSupportsPreventScroll;
}

type OwnerState = Pick<GridCellProps, 'align' | 'showRightBorder'> & {
  isEditable?: boolean,
  isSelected?: boolean,
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { align, showRightBorder, isEditable, isSelected, classes } = ownerState;

  const slots = {
    root: [
      'cell',
      `cell--text${capitalize(align)}`,
      isEditable && 'cell--editable',
      isSelected && 'selected',
      showRightBorder && 'cell--withRightBorder',
      'withBorderColor',
    ],
    content: ['cellContent'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

let warnedOnce = false;

const GridCell = React.forwardRef<HTMLDivElement, GridCellProps>((props, ref) => {
  const {
    align,
    colIndex,
    column,
    height,
    rowId,
    width,
    className,
    showRightBorder,
    extendRowFullWidth,
    row,
    colSpan,
    disableDragEvents,
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

  const field = column.field;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, cellRef);
  const focusElementRef = React.useRef<FocusElement>(null);
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);

  const {
    classes: rootClasses,
    getCellClassName,
  } = rootProps;

  const isSelected = useGridSelector(apiRef, () =>
    apiRef.current.unstable_applyPipeProcessors('isCellSelected', false, {
      id: rowId,
      field: field,
    })
  );

  const cellParams = useGridSelector(apiRef, () => {
    // This is required because `.getCellParams` tries to get the `state.rows.tree` entry
    // associated with `rowId`/`fieldId`, but this selector runs after the state has been
    // updated, while `rowId`/`fieldId` reference an entry in the old state.
    try {
      return apiRef.current.getCellParams<any, any, any, GridTreeNodeWithRender>(
        rowId,
        field,
      );
    } catch (e) {
      if ((e as Error).message.startsWith('No row with id')) {
        return null as any;
      }
      throw e;
    }
  }, shallowCompare);

  const classNames = apiRef.current.unstable_applyPipeProcessors('cellClassName', [], {
    id: rowId,
    field: field,
  });

  if (column.cellClassName) {
    classNames.push(
      clsx(
        typeof column.cellClassName === 'function'
          ? column.cellClassName(cellParams)
          : column.cellClassName,
      ),
    );
  }

  if (getCellClassName) {
    classNames.push(getCellClassName(cellParams));
  }

  const editCellState = editRowsState[rowId]?.[column.field] ?? null;
  const managesOwnFocus = column.type === 'actions';

  const cellMode = cellParams.cellMode;
  const hasFocus = cellParams.hasFocus;
  const isEditable = cellParams.isEditable;
  const valueToRender = cellParams.formattedValue == null ? cellParams.value : cellParams.formattedValue;

  const ownerState = { align, showRightBorder, isEditable, classes: rootProps.classes, isSelected };
  const classes = useUtilityClasses(ownerState);


  let children: React.ReactNode;
  {
    if (editCellState == null && column.renderCell) {
      children = column.renderCell({ ...cellParams, api: apiRef.current });
      classNames.push(
        clsx(gridClasses['cell--withRenderer'], rootClasses?.['cell--withRenderer']),
      );
    }

    if (editCellState != null && column.renderEditCell) {
      const updatedRow = apiRef.current.getRowWithUpdatedValues(rowId, column.field);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { changeReason, unstable_updateValueOnRender, ...editCellStateRest } = editCellState;

      const params: GridRenderEditCellParams = {
        ...cellParams,
        row: updatedRow,
        ...editCellStateRest,
        api: apiRef.current,
      };

      children = column.renderEditCell(params);
      classNames.push(clsx(gridClasses['cell--editing'], rootClasses?.['cell--editing']));
    }

    if (children === undefined) {
      const valueString = valueToRender?.toString();
      children = (
        <div className={classes.content} title={valueString}>
          {valueString}
        </div>
      );
    }

    if (React.isValidElement(children) && managesOwnFocus) {
      children = React.cloneElement<any>(children, { focusElementRef });
    }
  }

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

  const style = {
    minWidth: width,
    maxWidth: width,
    minHeight: height,
    maxHeight: height === 'auto' ? 'none' : height, // max-height doesn't support "auto"
  };

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
            `MUI: The cell with id=${rowId} and field=${field} received focus.`,
            `According to the state, the focus should be at id=${focusedCell?.id}, field=${focusedCell?.field}.`,
            "Not syncing the state may cause unwanted behaviors since the `cellFocusIn` event won't be fired.",
            'Call `fireEvent.mouseUp` before the `fireEvent.click` to sync the focus with the state.',
          ].join('\n'),
        );

        warnedOnce = true;
      }
    };
  }

  const draggableEventHandlers = disableDragEvents
    ? null
    : {
        onDragEnter: publish('cellDragEnter', onDragEnter),
        onDragOver: publish('cellDragOver', onDragOver),
      };

  return (
    <div
      ref={handleRef}
      className={clsx(className, classes.root, ...classNames)}
      role="cell"
      data-field={field}
      data-colindex={colIndex}
      aria-colindex={colIndex + 1}
      aria-colspan={colSpan}
      style={style}
      tabIndex={(cellMode === 'view' || !isEditable) && !managesOwnFocus ? cellParams.tabIndex : -1}
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

const MemoizedCell = React.memo(GridCell);

GridCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  align: PropTypes.oneOf(['center', 'left', 'right']),
  cellMode: PropTypes.oneOf(['edit', 'view']),
  children: PropTypes.node,
  className: PropTypes.string,
  colIndex: PropTypes.number,
  colSpan: PropTypes.number,
  disableDragEvents: PropTypes.bool,
  field: PropTypes.string,
  formattedValue: PropTypes.any,
  hasFocus: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]),
  isEditable: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showRightBorder: PropTypes.bool,
  tabIndex: PropTypes.oneOf([-1, 0]),
  value: PropTypes.any,
  width: PropTypes.number,
} as any;

export { MemoizedCell as GridCell };
