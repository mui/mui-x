import { GridAlignment, GridColDef } from './colDef';

export interface LeafColumn {
  field: GridColDef['field'];
}

export type GridColumnNode = GridColumnGroup | LeafColumn;

export function isLeaf(node: GridColumnNode): node is LeafColumn {
  return (<LeafColumn>node).field !== undefined;
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

export type GridColumnGroup = {
  /**
   * A unique string identifying the group.
   */
  groupId: string;
  /**
   * The groups and columns included in this group.
   */
  children: GridColumnNode[];
  /**
   * The name to display in the group header.
   */
  headerName?: string;
  /**
   * The description displayed in the header tooltip.
   */
  description?: string;
  /**
   * If `true` allows to reorder columns outside of the group.
   * @default false
   */
  freeReordering?: boolean;
  /**
   * Header cell element alignment.
   */
  headerAlign?: GridAlignment;
  /**
   * Allows to render a component in the column group header cell.
   * @param {GridColumnGroupHeaderParams} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderHeaderGroup?: (params: GridColumnGroupHeaderParams) => React.ReactNode;
};

export type GridColumnGroupingModel = GridColumnGroup[];
