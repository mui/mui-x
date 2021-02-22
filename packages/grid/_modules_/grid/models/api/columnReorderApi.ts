import * as React from 'react';
import { GridColDef } from '../colDef/gridColDef';

export interface CursorCoordinates {
  x: number;
  y: number;
}

/**
 * The column reorder API interface that is available in the grid [[apiRef]].
 */
export interface ColumnReorderApi {
  /**
   * Column item drag start event handler.
   * @param column
   * @param target
   * @returns void
   */
  onColItemDragStart: (column: GridColDef, target: HTMLElement) => void;
  /**
   * Column header drag over event handler.
   * @param event
   * @param ref
   * @returns void
   */
  onColHeaderDragOver: (event: Event, ref: React.RefObject<HTMLElement>) => void;
  /**
   * Column item drag over event handler.
   * @param column
   * @param coordinates
   * @returns void
   */
  onColItemDragOver: (column: GridColDef, coordinates: CursorCoordinates) => void;
  /**
   * Column item drag enter event handler.
   * @param event
   * @returns void
   */
  onColItemDragEnter: (event: Event) => void;
}
