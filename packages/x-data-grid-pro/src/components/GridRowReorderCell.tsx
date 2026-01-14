'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import {
  GridRenderCellParams,
  GridRowEventLookup,
  gridSortModelSelector,
  useGridApiContext,
  useGridSelector,
  getDataGridUtilityClass,
  gridClasses,
} from '@mui/x-data-grid';
import { gridEditRowsStateSelector, isEventTargetInPortal, vars } from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../models/dataGridProProps';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

type OwnerState = {
  classes?: DataGridProProcessedProps['classes'];
  isDraggable: boolean;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { isDraggable, classes } = ownerState;

  const slots = {
    root: ['rowReorderCell', isDraggable && 'rowReorderCell--draggable'],
    placeholder: ['rowReorderCellPlaceholder'],
    icon: ['rowReorderIcon'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const RowReorderIcon = styled('svg', {
  name: 'MuiDataGrid',
  slot: 'RowReorderIcon',
})<{ ownerState: OwnerState }>({
  color: vars.colors.foreground.muted,
});

function GridRowReorderCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);
  const cellValue =
    // eslint-disable-next-line no-underscore-dangle
    params.row.__reorder__ ||
    (params.rowNode.type === 'group' ? (params.rowNode.groupingKey ?? params.id) : params.id);
  const cellRef = React.useRef<HTMLDivElement>(null);
  const listenerNodeRef = React.useRef<HTMLDivElement>(null);

  const isRowReorderable = rootProps.isRowReorderable;
  // TODO: remove sortModel check once row reorder is compatible
  const isDraggable = React.useMemo(() => {
    const baseCondition =
      !!rootProps.rowReordering && !sortModel.length && Object.keys(editRowsState).length === 0;

    if (!baseCondition) {
      return false;
    }

    if (isRowReorderable) {
      return isRowReorderable({ row: params.row, rowNode: params.rowNode });
    }

    return true;
  }, [
    rootProps.rowReordering,
    isRowReorderable,
    sortModel,
    editRowsState,
    params.row,
    params.rowNode,
  ]);

  const ownerState = { isDraggable, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const publish = React.useCallback(
    (
      eventName: keyof GridRowEventLookup,
      propHandler?: React.MouseEventHandler<HTMLDivElement> | undefined,
    ): React.MouseEventHandler<HTMLDivElement> =>
      (event) => {
        // Ignore portal
        if (isEventTargetInPortal(event)) {
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
      },
    [apiRef, params.id],
  );

  const handleMouseDown = React.useCallback(() => {
    // Prevent text selection as it will block all the drag events. More context: https://github.com/mui/mui-x/issues/16303
    apiRef.current.rootElementRef?.current?.classList.add(
      gridClasses['root--disableUserSelection'],
    );
  }, [apiRef]);

  const handleMouseUp = React.useCallback(() => {
    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );
  }, [apiRef]);

  const handleDragEnd = React.useCallback(
    (event: DragEvent) => {
      handleMouseUp();
      if (apiRef.current.getRow(params.id)) {
        apiRef.current.publishEvent('rowDragEnd', apiRef.current.getRowParams(params.id), event);
      }

      listenerNodeRef.current!.removeEventListener('dragend', handleDragEnd);
      listenerNodeRef.current = null;
    },
    [apiRef, params.id, handleMouseUp],
  );

  const handleDragStart = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!cellRef.current) {
        return;
      }
      publish('rowDragStart')(event);
      cellRef.current.addEventListener('dragend', handleDragEnd);
      // cache the node to remove the listener when the drag ends
      listenerNodeRef.current = cellRef.current;
    },
    [publish, handleDragEnd],
  );

  const draggableEventHandlers = isDraggable
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

  return (
    <div ref={cellRef} className={classes.root} draggable={isDraggable} {...draggableEventHandlers}>
      <RowReorderIcon
        as={rootProps.slots.rowReorderIcon}
        ownerState={ownerState}
        className={classes.icon}
        fontSize="small"
      />
      <div className={classes.placeholder}>{cellValue}</div>
    </div>
  );
}

GridRowReorderCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
} as any;

export { GridRowReorderCell };

export const renderRowReorderCell = (params: GridRenderCellParams) => {
  if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
    return null;
  }
  return <GridRowReorderCell {...params} />;
};
