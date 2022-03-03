export type GridRowGroupingModel = string[];

export interface GridRowGroupingState {
  model: GridRowGroupingModel;
  /**
   * Tracks the model on the last pre-processing
   * Allows to check if we need to re-build the grouping columns when the grid upserts a column.
   * TODO: Move outside of the state
   */
  unstable_sanitizedModelOnLastRowTreeCreation: GridRowGroupingModel;
}

export interface GridRowGroupingInitialState {
  model?: GridRowGroupingModel;
}

export interface GridRowGroupingApi {
  /**
   * Sets the columns to use as grouping criteria.
   * @param {GridRowGroupingModel} model The columns to use as grouping criteria.
   */
  setRowGroupingModel: (model: GridRowGroupingModel) => void;
  /**
   * Adds the field to the row grouping model.
   * @param {string} groupingCriteriaField The field from which we want to group the rows.
   * @param {number | undefined} groupingIndex The grouping index at which we want to insert the new grouping criteria. By default, it will be inserted at the end of the model.
   */
  addRowGroupingCriteria: (groupingCriteriaField: string, groupingIndex?: number) => void;
  /**
   * sRemove the field from the row grouping model.
   * @param {string} groupingCriteriaField The field from which we want to stop grouping the rows.
   */
  removeRowGroupingCriteria: (groupingCriteriaField: string) => void;
  /**
   * Sets the grouping index of a grouping criteria.
   * @param {string} groupingCriteriaField The field of the grouping criteria from which we want to change the grouping index.
   * @param {number} groupingIndex The new grouping index of this grouping criteria.
   */
  setRowGroupingCriteriaIndex: (groupingCriteriaField: string, groupingIndex: number) => void;
}
