import { GridApiRef } from '../../../models/api/gridApiRef';
import { allGridColumnsSelector, visibleGridColumnsSelector } from '../columns';
import { gridFilteredSortedRowIdsSelector } from '../filter';
import { GridCsvGetRowsToExportParams, GridFileExportOptions } from '../../../models/gridExport';
import { GridRowId, GridStateColDef, GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../models';

export const defaultGetRowsToExport = ({ apiRef }: GridCsvGetRowsToExportParams): GridRowId[] => {
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const selectedRows = apiRef.current.getSelectedRows();

  if (selectedRows.size > 0) {
    return filteredSortedRowIds.filter((id) => selectedRows.has(id));
  }

  return filteredSortedRowIds;
};

interface GridGetColumnsToExportParams {
  /**
   * The API of the grid.
   */
  apiRef: GridApiRef;
  options: GridFileExportOptions;
}

export const getColumns = ({
  apiRef,
  options,
}: GridGetColumnsToExportParams): GridStateColDef[] => {
  const columns = allGridColumnsSelector(apiRef);

  let exportedColumns: GridStateColDef[];
  if (options.fields) {
    exportedColumns = options.fields
      .map((field) => columns.find((column) => column.field === field))
      .filter((column): column is GridStateColDef => !!column);
  } else {
    const validColumns = options.allColumns ? columns : visibleGridColumnsSelector(apiRef);
    exportedColumns = validColumns.filter((column) => !column.disableExport);
  }

  return exportedColumns.filter((column) => column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field);
};
