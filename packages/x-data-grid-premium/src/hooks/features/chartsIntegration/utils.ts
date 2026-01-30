import type { GridColDef } from '@mui/x-data-grid-pro';
import type { GridRowGroupingModel } from '../rowGrouping/gridRowGroupingInterfaces';
import type { GridPivotModel } from '../pivoting/gridPivotingInterfaces';
import { COLUMN_GROUP_ID_SEPARATOR } from '../../../constants/columnGroups';

export const getBlockedSections = (
  column: GridColDef,
  rowGroupingModel: GridRowGroupingModel,
  pivotModel: GridPivotModel | undefined,
): string[] => {
  // with pivoting, columns that are pivot values can only be added to the chart values
  // grid columns that are pivot rows can only be added to the chart dimensions
  // the rest of the columns can be added anywhere
  // pivoting columns are already filtered out by the chartable columns selector
  if (pivotModel) {
    const sections: string[] = [];
    const rows = pivotModel.rows.filter((item) => item.hidden !== true).map((item) => item.field);
    const values = pivotModel.values
      .filter((item) => item.hidden !== true)
      .map((item) => item.field);

    // field names in the values contain the group path. We are comparing the last part of it (the actual field name used for the value)
    const unwrappedFieldName = column.field.split(COLUMN_GROUP_ID_SEPARATOR).pop() as string;
    if (values.includes(unwrappedFieldName)) {
      sections.push('dimensions');
    }
    if (rows.includes(column.field)) {
      sections.push('values');
    }
    return sections;
  }
  // field that is already used for grouping cannot be added to the values
  if (rowGroupingModel.length > 0) {
    return rowGroupingModel.includes(column.field) ? ['values'] : [];
  }
  // without pivoting and row grouping the only constraint is that non-number columns cannot be added to the values
  if (column.type !== 'number') {
    return ['values'];
  }
  return [];
};

export const isBlockedForSection = (
  column: GridColDef,
  section: string,
  rowGroupingModel: GridRowGroupingModel,
  pivotModel: GridPivotModel | undefined,
) => getBlockedSections(column, rowGroupingModel, pivotModel).includes(section);
