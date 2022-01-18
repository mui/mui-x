import * as React from 'react';
import { DataGridPro, GridEvents, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['composer', 'decade'];

const useKeepGroupingColumnsHidden = (apiRef, columns, initialModel, leafField) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowGroupingModelChange, (newModel) => {
      apiRef.current.updateColumns([
        ...newModel
          .filter((field) => !prevModel.current.includes(field))
          .map((field) => ({ field, hide: true })),
        ...prevModel.current
          .filter((field) => !newModel.includes(field))
          .map((field) => ({ field, hide: false })),
      ]);

      prevModel.current = initialModel;
    });
  }, [apiRef, initialModel]);

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

export default function RowGroupingGroupingValueGetter() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columnsWithComposer = React.useMemo(
    () => [
      ...data.columns,
      {
        field: 'composer',
        headerName: 'Composer',
        renderCell: (params) => params.value?.name,
        groupingValueGetter: (params) => params.value.name,
        width: 200,
      },
      {
        field: 'decade',
        headerName: 'Decade',
        valueGetter: (params) => Math.floor(params.row.year / 10) * 10,
        groupingValueGetter: (params) => Math.floor(params.row.year / 10) * 10,
        renderCell: (params) => `${params.value.toString().slice(-2)}'s`,
      },
    ],
    [data.columns],
  );

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    columnsWithComposer,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        columns={columns}
        initialState={{
          rowGrouping: {
            model: INITIAL_GROUPING_COLUMN_MODEL,
          },
        }}
        experimentalFeatures={{
          rowGrouping: true,
        }}
      />
    </div>
  );
}
