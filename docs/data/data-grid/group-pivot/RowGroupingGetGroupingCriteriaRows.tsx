import * as React from 'react';
import {
  DataGridPro,
  GridApi,
  GridColumns,
  gridColumnVisibilityModelSelector,
  GridEventListener,
  GridEvents,
  GridRowGroupingModel,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { Movie, useMovieData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

const useKeepGroupingColumnsHidden = (
  apiRef: React.MutableRefObject<GridApi>,
  columns: GridColumns,
  initialModel: GridRowGroupingModel,
  leafField?: string,
) => {
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

export default function RowGroupingGetGroupingCriteriaRows() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const [lastGroupClickedChildren, setLastGroupClickedChildren] = React.useState<
    string[] | null
  >(null);

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const handleRowClick = React.useCallback<GridEventListener<GridEvents.rowClick>>(
    (params) => {
      // Only log groups
      if (!apiRef.current.getRowNode(params.id)?.children) {
        return;
      }

      const rowIds = apiRef.current.getGroupingCriteriaRows({
        groupId: params.id,
      });

      const rowTitles = rowIds.map(
        (rowId) => apiRef.current.getRow<Movie>(rowId)!.title,
      );

      setLastGroupClickedChildren(rowTitles);
    },
    [apiRef],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          {...data}
          apiRef={apiRef}
          columns={columns}
          onRowClick={handleRowClick}
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
      <Alert severity="info" style={{ marginBottom: 8 }}>
        {lastGroupClickedChildren ? (
          <code>
            Movies in the last group clicked
            <br />
            <br />
            {lastGroupClickedChildren.map((movieTitle) => (
              <React.Fragment>
                - {movieTitle}
                <br />
              </React.Fragment>
            ))}
          </code>
        ) : (
          <code>Click on a group row to log its children here</code>
        )}
      </Alert>
    </div>
  );
}
