import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

export interface GridGroupingColDefOverride<R extends GridValidRowModel = any>
  extends Omit<
    GridColDef<R>,
    | 'editable'
    | 'valueSetter'
    | 'field'
    | 'type'
    | 'preProcessEditCellProps'
    | 'renderEditCell'
    | 'groupable'
  > {
  /**
   * The field from which we want to apply the sorting and the filtering for the grouping column.
   * It is only useful when `props.rowGroupingColumnMode === "multiple"` to decide which grouping criteria should be used for sorting and filtering.
   * Do not have any effect when building the tree with the `props.treeData` feature.
   * @default The sorting and filtering is applied based on the leaf field in any, otherwise based on top level grouping criteria.
   */
  mainGroupingCriteria?: string;
  /**
   * The field from which we want to render the leaves of the tree.
   * Do not have any effect when building the tree with the `props.treeData` feature.
   */
  leafField?: string;
  /**
   * If `true`, the grouping cells will not render the amount of descendants.
   * @default false
   */
  hideDescendantCount?: boolean;
}

export interface GridGroupingColDefOverrideParams {
  /**
   * The name of the grouping algorithm currently building the grouping column.
   */
  groupingName: string;
  /**
   * The fields of the columns from which we want to group the values on this new grouping column.
   */
  fields: string[];
}
