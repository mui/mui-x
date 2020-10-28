import * as React from 'react';
import { ColDef } from '../colDef/colDef';

export interface CursorCoordinates {
  x: number;
  y: number;
}

/**
 * The column reorder API interface that is available in the grid [[apiRef]].
 */
export interface ColumnReorderApi {
  /**
   * Column cell drag start event handler.
   * @param column
   * @param target
   * @returns void
   */
  onColCellDragStart: (column: ColDef, target: HTMLElement) => void;
  /**
   * Column header drag over event handler.
   * @param event
   * @param ref
   * @returns void
   */
  onColHeaderDragOver: (event: Event, ref: React.RefObject<HTMLElement>) => void;
  /**
   * Column cell drag over event handler.
   * @param column
   * @param coordinates
   * @returns void
   */
  onColCellDragOver: (column: ColDef, coordinates: CursorCoordinates) => void;
  /**
   * Column cell drag enter event handler.
   * @param event
   * @returns void
   */
  onColCellDragEnter: (event: Event) => void;
}
