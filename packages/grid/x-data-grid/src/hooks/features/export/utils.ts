import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { gridColumnDefinitionsSelector, gridVisibleColumnDefinitionsSelector } from '../columns';
import { GridExportOptions, GridCsvGetRowsToExportParams } from '../../../models/gridExport';
import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { gridFilteredSortedRowIdsSelector } from '../filter';
import { GridRowId } from '../../../models';

interface GridGetColumnsToExportParams {
  /**
   * The API of the grid.
   */
  apiRef: React.MutableRefObject<GridApiCommunity>;
  options: GridExportOptions;
}

export const getColumnsToExport = ({
  apiRef,
  options,
}: GridGetColumnsToExportParams): GridStateColDef[] => {
  const columns = gridColumnDefinitionsSelector(apiRef);

  if (options.fields) {
    return options.fields
      .map((field) => columns.find((column) => column.field === field))
      .filter((column): column is GridStateColDef => !!column);
  }

  const validColumns = options.allColumns ? columns : gridVisibleColumnDefinitionsSelector(apiRef);
  return validColumns.filter((column) => !column.disableExport);
};

export const defaultGetRowsToExport = ({ apiRef }: GridCsvGetRowsToExportParams): GridRowId[] => {
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const selectedRows = apiRef.current.getSelectedRows();

  if (selectedRows.size > 0) {
    return filteredSortedRowIds.filter((id) => selectedRows.has(id));
  }

  return filteredSortedRowIds;
};
