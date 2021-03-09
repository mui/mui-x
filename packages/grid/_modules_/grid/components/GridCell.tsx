import * as React from 'react';
import { capitalize } from '@material-ui/core/utils';
import {
  GRID_CELL_CLICK,
  GRID_CELL_ENTER,
  GRID_CELL_OVER,
  GRID_CELL_LEAVE,
  GRID_CELL_OUT,
  GRID_DOUBLE_CELL_CLICK,
} from '../constants/eventsConstants';
import { GridAlignment, GridCellValue, GridRowId } from '../models';
import { GRID_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { GridApiContext } from './GridApiContext';

export interface GridCellProps {
  align: GridAlignment;
  colIndex?: number;
  cssClass?: string;
  field?: string;
  rowId?: GridRowId;
  formattedValue?: GridCellValue;
  hasFocus?: boolean;
  height: number;
  isEditable?: boolean;
  rowIndex?: number;
  showRightBorder?: boolean;
  tabIndex?: number;
  value?: GridCellValue;
  width: number;
}

export const GridCell: React.FC<GridCellProps> = React.memo((props) => {
  const {
    align,
    children,
    colIndex,
    cssClass,
    field,
    formattedValue,
    hasFocus,
    height,
    isEditable,
    rowIndex,
    rowId,
    showRightBorder,
    tabIndex,
    value,
    width,
  } = props;

  const valueToRender = formattedValue || value;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useContext(GridApiContext);

  const getParams = React.useCallback(() => {
    if (rowId == null || field == null || !apiRef?.current) {
      return null;
    }

    return apiRef!.current.getCellParams(rowId, field);
  }, [apiRef, field, rowId]);

  React.useEffect(() => {
    if (hasFocus && cellRef.current) {
      cellRef.current.focus();
    }
  }, [hasFocus]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      const params = getParams();
      if (params?.colDef.disableClickEventBubbling) {
        event.stopPropagation();
      }
      apiRef?.current.publishEvent(GRID_CELL_CLICK, params, event);
    },
    [apiRef, getParams],
  );

  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent) => {
      apiRef?.current.publishEvent(GRID_DOUBLE_CELL_CLICK, getParams(), event);
    },
    [apiRef, getParams],
  );

  const handleHover = React.useCallback(
    (event: React.MouseEvent) => {
      apiRef?.current.publishEvent(GRID_CELL_OVER, getParams(), event);
    },
    [apiRef, getParams],
  );

  const handleOut = React.useCallback(
    (event: React.MouseEvent) => {
      apiRef?.current.publishEvent(GRID_CELL_OUT, getParams(), event);
    },
    [apiRef, getParams],
  );

  const handleEnter = React.useCallback(
    (event: React.MouseEvent) => {
      apiRef?.current.publishEvent(GRID_CELL_ENTER, getParams(), event);
    },
    [apiRef, getParams],
  );

  const handleLeave = React.useCallback(
    (event: React.MouseEvent) => {
      apiRef?.current.publishEvent(GRID_CELL_LEAVE, getParams(), event);
    },
    [apiRef, getParams],
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/mouse-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={cellRef}
      className={classnames(GRID_CELL_CSS_CLASS, cssClass, `MuiDataGrid-cell${capitalize(align)}`, {
        'MuiDataGrid-withBorder': showRightBorder,
        'MuiDataGrid-cellEditable': isEditable,
      })}
      role="cell"
      data-value={value}
      data-field={field}
      data-rowindex={rowIndex}
      data-editable={isEditable}
      aria-colindex={colIndex}
      style={{
        minWidth: width,
        maxWidth: width,
        lineHeight: `${height - 1}px`,
        minHeight: height,
        maxHeight: height,
      }}
      tabIndex={tabIndex}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseOver={handleHover}
      onMouseOut={handleOut}
    >
      {children || valueToRender?.toString()}
    </div>
  );
});

GridCell.displayName = 'GridCell';

interface EmptyCellProps {
  width?: number;
  height?: number;
}

export const GridLeftEmptyCell: React.FC<EmptyCellProps> = React.memo(({ width, height }) =>
  !width || !height ? null : <GridCell width={width} height={height} align="left" />,
);
GridLeftEmptyCell.displayName = 'GridLeftEmptyCell';

export const GridRightEmptyCell: React.FC<EmptyCellProps> = React.memo(({ width, height }) =>
  !width || !height ? null : <GridCell width={width} height={height} align="left" />,
);
GridRightEmptyCell.displayName = 'GridRightEmptyCell';
