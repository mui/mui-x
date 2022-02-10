import { GridApiRef } from '../../../models/api/gridApiRef';
import { allGridColumnsSelector, visibleGridColumnsSelector } from '../columns';
import { GridExportOptions } from '../../../models/gridExport';
import { GridStateColDef } from '../../../models';

interface GridGetColumnsToExportParams {
  /**
   * The API of the grid.
   */
  apiRef: GridApiRef;
  options: GridExportOptions;
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

  return exportedColumns;
};
