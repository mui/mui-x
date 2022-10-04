import * as React from 'react';
import {
  DataGridPro,
  GridToolbar,
  useGridApiRef,
  gridFilterModelSelector,
  GridFilterItem,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DisableMultiFiltersDataGridPro() {
  const apiRef = useGridApiRef();
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const filterColumns = React.useCallback(
    (columnField: string) => {
      // remove already filtered fields from list of columns
      const colDefs = apiRef.current.getAllColumns();
      const filterModel = gridFilterModelSelector(apiRef);
      const filteredFields = filterModel.items?.map((item) => item.columnField);
      return colDefs.filter(
        (colDef) =>
          colDef.filterable &&
          (colDef.field === columnField || !filteredFields.includes(colDef.field)),
      );
    },
    [apiRef],
  );

  const getColumnForNewFilter = React.useCallback(
    (currentFilters: GridFilterItem[]) => {
      const colDefs = apiRef.current.getAllColumns();
      const filteredFields = currentFilters?.map(({ columnField }) => columnField);
      const columnForNewFilter = colDefs
        .filter(
          (colDef) => colDef.filterable && !filteredFields.includes(colDef.field),
        )
        .find((colDef) => colDef.filterOperators?.length);
      return columnForNewFilter;
    },
    [apiRef],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        apiRef={apiRef}
        {...data}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          filterPanel: {
            filterFormProps: {
              filterColumns,
            },
            getColumnForNewFilter,
          },
        }}
      />
    </div>
  );
}
