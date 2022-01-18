import * as React from 'react';
import {
  DataGridPro,
  GridApiRef,
  GridColumns,
  GridEvents,
  GridRowGroupingModel,
  GridRowTreeNodeConfig,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

const useKeepGroupingColumnsHidden = (
  apiRef: GridApiRef,
  columns: GridColumns,
  initialModel: GridRowGroupingModel,
  leafField?: string,
) => {
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

const isGroupExpandedByDefault = (node: GridRowTreeNodeConfig) =>
  node.groupingField === 'company' && node.groupingKey === '20th Century Fox';

export default function RowGroupingIsGroupExpandedByDefault() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        columns={columns}
        isGroupExpandedByDefault={isGroupExpandedByDefault}
        disableSelectionOnClick
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
