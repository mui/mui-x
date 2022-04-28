import { useDemoData } from '@mui/x-data-grid-generator';
import * as React from 'react';
import {
  DataGridPremium,
  gridColumnVisibilityModelSelector,
  GridEvents,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

const INITIAL_GROUPING_COLUMN_MODEL = ['commodity'];

const useKeepGroupingColumnsHidden = (apiRef, columns, initialModel, leafField) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowGroupingModelChange, (newModel) => {
      const columnVisibilityModel = {
        ...gridColumnVisibilityModelSelector(apiRef),
      };

      newModel.forEach((field) => {
        if (!prevModel.current.includes(field)) {
          columnVisibilityModel[field] = false;
        }
      });
      prevModel.current.forEach((field) => {
        if (!newModel.includes(field)) {
          columnVisibilityModel[field] = true;
        }
      });
      apiRef.current.setColumnVisibilityModel(columnVisibilityModel);
      prevModel.current = newModel;
    });
  }, [apiRef]);

  return React.useMemo(
    () =>
      columns.map((colDef) =>
        initialModel.includes(colDef.field) ||
        (leafField && colDef.field === leafField)
          ? { ...colDef, hide: true }
          : colDef,
      ),
    [columns, initialModel, leafField],
  );
};

export default function RowGroupingFullExample() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 25,
  });

  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        columns={columns}
        loading={loading}
        disableSelectionOnClick
        initialState={{
          ...data.initialState,
          columns: {
            ...data.initialState?.columns,
            columnVisibilityModel: {
              ...data.initialState?.columns?.columnVisibilityModel,
              ...Object.fromEntries(
                INITIAL_GROUPING_COLUMN_MODEL.map((field) => [field, false]),
              ),
            },
          },
          rowGrouping: {
            model: INITIAL_GROUPING_COLUMN_MODEL,
          },
          sorting: {
            sortModel: [{ field: '__row_group_by_columns_group__', sort: 'asc' }],
          },
        }}
        groupingColDef={{
          leafField: 'traderEmail',
        }}
      />
    </div>
  );
}
