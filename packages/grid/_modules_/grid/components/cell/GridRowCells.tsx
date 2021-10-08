import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { GridCellIdentifier } from '../../hooks/features/focus/gridFocusState';
import {
  GridRowModel,
  GridCellParams,
  GridRowId,
  GridEditRowProps,
  GridStateColDef,
} from '../../models';
import { GridCell, GridCellProps } from './GridCell';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { isFunction } from '../../utils/utils';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface RowCellsProps {
  columns: GridStateColDef[];
  extendRowFullWidth: boolean;
  firstColIdx: number;
  id: GridRowId;
  hasScrollX: boolean;
  hasScrollY: boolean;
  height: number;
  getCellClassName?: (params: GridCellParams) => string;
  lastColIdx: number;
  row: GridRowModel;
  rowIndex: number;
  showCellRightBorder: boolean;
  cellFocus: GridCellIdentifier | null;
  cellTabIndex: GridCellIdentifier | null;
  isSelected: boolean;
  editRowState?: GridEditRowProps;
}

export function GridRowCells(props: RowCellsProps) {
  const {
    columns,
    firstColIdx,
    hasScrollX,
    hasScrollY,
    height,
    id,
    getCellClassName,
    lastColIdx,
    rowIndex,
    cellFocus,
    cellTabIndex,
    showCellRightBorder,
    isSelected,
    editRowState,
    ...other
  } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const rowNode = apiRef.current.UNSTABLE_getRowNode(id);

  const cellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const colIndex = firstColIdx + colIdx;
    const isLastColumn = colIndex === columns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn
      ? showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    const cellParams: GridCellParams = apiRef.current.getCellParams(id, column.field);

    const classNames: string[] = [];

    if (column.cellClassName) {
      classNames.push(
        clsx(
          isFunction(column.cellClassName)
            ? column.cellClassName(cellParams)
            : column.cellClassName,
        ),
      );
    }

    const editCellState = editRowState && editRowState[column.field];
    let cellComponent: React.ReactNode = null;

    const skipRender = !column.shouldRenderFillerRows && rowNode?.fillerNode;

    if (editCellState == null && column.renderCell && !skipRender) {
      cellComponent = column.renderCell({ ...cellParams, api: apiRef.current });
      // TODO move to GridCell
      classNames.push(
        clsx(gridClasses['cell--withRenderer'], rootProps.classes?.['cell--withRenderer']),
      );
    }

    if (editCellState != null && column.renderEditCell && !skipRender) {
      const params = { ...cellParams, ...editCellState, api: apiRef.current };
      cellComponent = column.renderEditCell(params);
      // TODO move to GridCell
      classNames.push(clsx(gridClasses['cell--editing'], rootProps.classes?.['cell--editing']));
    }

    if (getCellClassName) {
      // TODO move to GridCell
      classNames.push(getCellClassName(cellParams));
    }

    const cellProps: GridCellProps = {
      value: skipRender ? null : cellParams.value,
      field: column.field,
      width: column.computedWidth,
      rowId: id,
      height,
      showRightBorder,
      formattedValue: skipRender ? null : cellParams.formattedValue,
      align: column.align || 'left',
      rowIndex,
      cellMode: cellParams.cellMode,
      colIndex,
      children: cellComponent,
      isEditable: cellParams.isEditable,
      isSelected,
      hasFocus: cellFocus !== null && cellFocus.id === id && cellFocus.field === column.field,
      tabIndex:
        cellTabIndex !== null &&
        cellTabIndex.id === id &&
        cellTabIndex.field === column.field &&
        cellParams.cellMode === 'view'
          ? 0
          : -1,
      className: clsx(classNames),
      ...other,
    };

    return cellProps;
  });

  return (
    <React.Fragment>
      {cellsProps.map((cellProps) => (
        <GridCell key={cellProps.field} {...cellProps} />
      ))}
    </React.Fragment>
  );
}

GridRowCells.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  cellFocus: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  cellTabIndex: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  editRowState: PropTypes.object,
  extendRowFullWidth: PropTypes.bool.isRequired,
  firstColIdx: PropTypes.number.isRequired,
  getCellClassName: PropTypes.func,
  hasScrollX: PropTypes.bool.isRequired,
  hasScrollY: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isSelected: PropTypes.bool.isRequired,
  lastColIdx: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  showCellRightBorder: PropTypes.bool.isRequired,
} as any;
