import * as React from 'react';
import { GridStateColDef } from '../models/colDef/gridColDef';
import { GridCellCoordinates } from '../models/gridCell';
import { GridRowId, GridRowModel } from '../models/gridRows';
import { GridEditingState } from '../models/gridEditRowModel';

export interface GridRowProps
  extends React.AllHTMLAttributes<HTMLDivElement>,
    React.DOMAttributes<HTMLDivElement> {
  rowId: GridRowId;
  selected: boolean;
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: number;
  rowHeight: number | 'auto';
  containerWidth: number;
  firstColumnToRender: number;
  lastColumnToRender: number;
  visibleColumns: GridStateColDef[];
  renderedColumns: GridStateColDef[];
  cellFocus: GridCellCoordinates | null;
  cellTabIndex: GridCellCoordinates | null;
  editRowsState: GridEditingState;
  position: 'left' | 'center' | 'right';
  row?: GridRowModel;
  isLastVisible?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  [x: string]: any; // Allow custom attributes like data-* and aria-*
}
