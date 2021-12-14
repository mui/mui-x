import * as React from 'react';
import {
  DataGridPro,
  GridApiRef,
  GridColumns,
  GridEvents,
  GridGroupingColumnsModel,
  GridKeyGetterParams,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['composer'];

const useKeepGroupingColumnsHidden = (
  apiRef: GridApiRef,
  columns: GridColumns,
  initialModel: GridGroupingColumnsModel,
  leafField?: string,
) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(
      GridEvents.groupingColumnsModelChange,
      (newModel) => {
        apiRef.current.updateColumns([
          ...newModel
            .filter((field) => !prevModel.current.includes(field))
            .map((field) => ({ field, hide: true })),
          ...prevModel.current
            .filter((field) => !newModel.includes(field))
            .map((field) => ({ field, hide: false })),
        ]);
        prevModel.current = initialModel;
      },
    );
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

export default function GroupingColumnsKeyGetter() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columnsWithComposer = React.useMemo(
    () => [
      ...data.columns,
      {
        field: 'composer',
        headerName: 'Composer',
        renderCell: (params: GridRenderCellParams<{ name: string } | undefined>) =>
          params.value?.name,
        keyGetter: (params: GridKeyGetterParams<{ name: string }>) =>
          params.value.name,
        width: 200,
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
          groupingColumns: {
            model: INITIAL_GROUPING_COLUMN_MODEL,
          },
        }}
        experimentalFeatures={{
          groupingColumns: true,
        }}
      />
    </div>
  );
}
