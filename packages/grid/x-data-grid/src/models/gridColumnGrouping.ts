import { GridColDef } from './colDef';

export type LeafColumn = {
  field: GridColDef['field'];
};

export type GridColumnNode = GridColumnGroup | LeafColumn;

export function isLeaf(node: GridColumnNode): node is LeafColumn {
  return (<LeafColumn>node).field !== undefined;
}

export type GridColumnGroupHeaderParams = {
  groupId: string;
  headerName: string;
  description: string;
  depth: number;
  maxDepth: number;
  fields: string[];
  colIndex: number;
  isLastColumn: boolean;
};

export type GridColumnGroup = {
  /**
   * A unique string identifying the group
   */
  groupId: string;
  /**
   * The array of groups and columns included in this group
   */
  children: GridColumnNode[];
  /**
   * The name to display in the group header
   */
  headerName?: string;
  /**
   * The description displayed in the header tooltip
   */
  description?: string;
  /**
   * If `true` allows to reorder columns outside of the group
   * @default false
   */
  freeReordering?: boolean;
  /**
   * Allows to render a component in the column group header cell.
   * @param {GridColumnGroupHeaderParams} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderHeaderGroup?: (params: GridColumnGroupHeaderParams) => React.ReactNode;
};

export type GridColumnGroupingModel = GridColumnGroup[];
