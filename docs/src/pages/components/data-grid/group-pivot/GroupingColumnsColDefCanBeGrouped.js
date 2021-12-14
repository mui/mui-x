import * as React from 'react';
import { DataGridPro, GridEvents, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company'];

const useKeepGroupingColumnsHidden = (apiRef, columns, initialModel, leafField) => {
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

export default function GroupingColumnsColDefCanBeGrouped() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const columnWithNoDirectorGroup = React.useMemo(
    () =>
      columns.map((colDef) =>
        colDef.field === 'director' ? { ...colDef, canBeGrouped: false } : colDef,
      ),
    [columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        columns={columnWithNoDirectorGroup}
        disableSelectionOnClick
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
