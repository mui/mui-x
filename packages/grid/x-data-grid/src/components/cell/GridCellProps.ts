import { GridAlignment } from '../../models/colDef/gridColDef';
import { GridCellMode } from '../../models/gridCell';
import { GridRowId } from '../../models/gridRows';

export interface GridCellProps<V = any, F = V> {
  align: GridAlignment;
  className?: string;
  colIndex: number;
  field: string;
  rowId: GridRowId;
  formattedValue?: F;
  hasFocus?: boolean;
  height: number | 'auto';
  isEditable?: boolean;
  isSelected?: boolean;
  showRightBorder?: boolean;
  value?: V;
  width: number;
  cellMode?: GridCellMode;
  children: React.ReactNode;
  tabIndex: 0 | -1;
  colSpan?: number;
  disableDragEvents?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onDragEnter?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  [x: string]: any; // TODO it should not accept unspecified props
}
