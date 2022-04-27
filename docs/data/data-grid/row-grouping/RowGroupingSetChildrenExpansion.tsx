import * as React from 'react';
import {
  DataGridPremium,
  GridApi,
  GridColumns,
  gridColumnVisibilityModelSelector,
  GridEvents,
  GridRowGroupingModel,
  gridVisibleSortedRowIdsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const INITIAL_GROUPING_COLUMN_MODEL = ['company'];

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

export default function RowGroupingSetChildrenExpansion() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const toggleSecondRow = () => {
    const rowIds = gridVisibleSortedRowIdsSelector(apiRef);

    if (rowIds.length > 1) {
      const rowId = rowIds[1];
      apiRef.current.setRowChildrenExpansion(
        rowId,
        !apiRef.current.getRowNode(rowId)?.childrenExpanded,
      );
    }
  };

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <Button onClick={toggleSecondRow}>Toggle 2nd row expansion</Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          columns={columns}
          disableSelectionOnClick
          initialState={{
            rowGrouping: {
              model: INITIAL_GROUPING_COLUMN_MODEL,
            },
          }}
        />
      </div>
    </Stack>
  );
}
