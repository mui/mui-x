import { capitalize } from '@material-ui/core/utils';
import * as React from 'react';
import { GRID_CELL_CSS_CLASS } from '../../constants/cssClassesConstants';
import {
  GRID_CELL_CLICK,
  GRID_CELL_DOUBLE_CLICK,
  GRID_CELL_ENTER,
  GRID_CELL_FOCUS,
  GRID_CELL_KEYDOWN,
  GRID_CELL_LEAVE,
  GRID_CELL_MOUSE_DOWN,
  GRID_CELL_OUT,
  GRID_CELL_OVER,
} from '../../constants/eventsConstants';
import { GridAlignment, GridCellMode, GridCellValue, GridRowId } from '../../models/index';
import { classnames } from '../../utils/index';
import { GridApiContext } from '../GridApiContext';

export interface GridCellProps {
  align: GridAlignment;
  colIndex?: number;
  cssClass?: string;
  field: string;
  rowId: GridRowId;
  formattedValue?: GridCellValue;
  hasFocus?: boolean;
  height: number;
  isEditable?: boolean;
  rowIndex?: number;
  showRightBorder?: boolean;
  value?: GridCellValue;
  width: number;
  cellMode?: GridCellMode;
}

export const GridCell: React.FC<GridCellProps> = React.memo((props) => {
  const {
    align,
    children,
    colIndex,
    cellMode,
    cssClass,
    field,
    formattedValue,
    hasFocus,
    height,
    isEditable,
    rowIndex,
    rowId,
    showRightBorder,
    value,
    width,
  } = props;

  const valueToRender = formattedValue || value;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useContext(GridApiContext);

  const cssClasses = classnames(
    GRID_CELL_CSS_CLASS,
    cssClass,
    `MuiDataGrid-cell${capitalize(align)}`,
    {
      'MuiDataGrid-withBorder': showRightBorder,
      'MuiDataGrid-cellEditable': isEditable,
    },
  );

  const publishClick = React.useCallback(
    (eventName: string) => (event: React.MouseEvent) => {
      const params = apiRef!.current.getCellParams(rowId, field || '');
      if (params?.colDef.disableClickEventBubbling) {
        event.stopPropagation();
      }
      apiRef!.current.publishEvent(eventName, params, event);
    },
    [apiRef, field, rowId],
  );

  const publish = React.useCallback(
    (eventName: string) => (event: React.SyntheticEvent) =>
      apiRef!.current.publishEvent(
        eventName,
        apiRef!.current.getCellParams(rowId!, field || ''),
        event,
      ),
    [apiRef, field, rowId],
  );

  const eventsHandlers = React.useMemo(
    () => ({
      onClick: publishClick(GRID_CELL_CLICK),
      onDoubleClick: publish(GRID_CELL_DOUBLE_CLICK),
      onMouseDown: publish(GRID_CELL_MOUSE_DOWN),
      onMouseOver: publish(GRID_CELL_OVER),
      onMouseOut: publish(GRID_CELL_OUT),
      onMouseEnter: publish(GRID_CELL_ENTER),
      onMouseLeave: publish(GRID_CELL_LEAVE),
      onKeyDown: publish(GRID_CELL_KEYDOWN),
      onFocus: publish(GRID_CELL_FOCUS),
    }),
    [publish, publishClick],
  );

  const style = {
    minWidth: width,
    maxWidth: width,
    lineHeight: `${height - 1}px`,
    minHeight: height,
    maxHeight: height,
  };

  React.useLayoutEffect(() => {
    if (hasFocus && cellMode === 'view' && cellRef.current) {
      cellRef.current!.focus();
    }
  });

  return (
    <div
      ref={cellRef}
      className={cssClasses}
      role="cell"
      data-value={value}
      data-field={field}
      data-rowindex={rowIndex}
      data-editable={isEditable}
      data-mode={cellMode}
      aria-colindex={colIndex}
      style={style}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={hasFocus ? 0 : -1}
      {...eventsHandlers}
    >
      {children || valueToRender?.toString()}
    </div>
  );
});

GridCell.displayName = 'GridCell';
