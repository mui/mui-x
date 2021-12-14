export type GridGroupingColumnsModel = string[];

export interface GridGroupingColumnsState {
  model: GridGroupingColumnsModel;
}

export interface GridGroupingColumnsInitialState {
  model?: GridGroupingColumnsModel;
}

export interface GridGroupingColumnsApi {
  /**
   * Sets the columns to use as grouping criteria.
   * @param {GridGroupingColumnsModel} model The columns to use as grouping criteria.
   */
  setGroupingColumnsModel: (model: GridGroupingColumnsModel) => void;

  /**
   * Add the field to the groupingColumnsModel.
   * @param {string} groupingCriteriaField The field from which we want to group the rows.
   * @param {number | undefined} groupingIndex The grouping index at which we want to insert the new grouping criteria. By default, it will be inserted at the end of the model.
   */
  addGroupingCriteria: (groupingCriteriaField: string, groupingIndex?: number) => void;

  /**
   * Remove the field from to groupingColumnsModel.
   * @param {string} groupingCriteriaField The field from which we want to stop grouping the rows.
   */
  removeGroupingCriteria: (groupingCriteriaField: string) => void;

  /**
   * Sets the grouping index of a grouping criteria.
   * @param {string} groupingCriteriaField The field of the grouping criteria from which we want to change the grouping index.
   * @param {number} groupingIndex The new grouping index of this grouping criteria.
   */
  setGroupingCriteriaIndex: (groupingCriteriaField: string, groupingIndex: number) => void;
}
