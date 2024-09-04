import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import {
  GridRenderCellParams,
  GridRowEventLookup,
  gridRowMaximumTreeDepthSelector,
  gridSortModelSelector,
  useGridApiContext,
  useGridSelector,
  getDataGridUtilityClass,
} from '@mui/x-data-grid';
import { gridEditRowsStateSelector, isEventTargetInPortal } from '@mui/x-data-grid/internals';
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
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridRowReorderCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const treeDepth = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector);
  const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);
  // eslint-disable-next-line no-underscore-dangle
  const cellValue = params.row.__reorder__ || params.id;

  // TODO: remove sortModel and treeDepth checks once row reorder is compatible
  const isDraggable = React.useMemo(
    () =>
      !!rootProps.rowReordering &&
      !sortModel.length &&
      treeDepth === 1 &&
      Object.keys(editRowsState).length === 0,
    [rootProps.rowReordering, sortModel, treeDepth, editRowsState],
  );

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

  const draggableEventHandlers = isDraggable
    ? {
        onDragStart: publish('rowDragStart'),
        onDragOver: publish('rowDragOver'),
        onDragEnd: publish('rowDragEnd'),
      }
    : null;

  if (params.rowNode.type === 'footer') {
    return null;
  }

  return (
    <div className={classes.root} draggable={isDraggable} {...draggableEventHandlers}>
      <rootProps.slots.rowReorderIcon />
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
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focus: PropTypes.func.isRequired,
      }),
    }),
  ]),
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
