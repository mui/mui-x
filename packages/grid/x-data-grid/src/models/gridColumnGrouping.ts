import { GridColDef } from './colDef';

export interface GridLeafColumn {
  field: GridColDef['field'];
}

export type GridColumnNode = GridColumnGroup | GridLeafColumn;

export function isLeaf(node: GridColumnNode): node is GridLeafColumn {
  return (<GridLeafColumn>node).field !== undefined;
}

export interface GridColumnGroupHeaderParams
  extends Pick<GridColumnGroup, 'groupId' | 'headerName' | 'description'> {
  /**
   * The number parent the group have.
   */
  depth: number;
  /**
   * The maximal depth among visible columns.
   */
  maxDepth: number;
  /**
   * The column fields included in the group (including nested ones).
   */
  fields: string[];
  /**
   * The column index (0 based).
   */
  colIndex: number;
  /**
   * Indicate if the group is the last one for the given depth.
   */
  isLastColumn: boolean;
}

export interface GridColumnGroup
  extends Pick<GridColDef, 'headerName' | 'description' | 'headerAlign'> {
  /**
   * A unique string identifying the group.
   */
  groupId: string;
  /**
   * The groups and columns included in this group.
   */
  children: GridColumnNode[];
  /**
   * If `true` allows to reorder columns outside of the group.
   * @default false
   */
  freeReordering?: boolean;
  /**
   * Allows to render a component in the column group header cell.
   * @param {GridColumnGroupHeaderParams} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderHeaderGroup?: (params: GridColumnGroupHeaderParams) => React.ReactNode;
}

export type GridColumnGroupingModel = GridColumnGroup[];
