import * as React from 'react';
import {
  DataGridPro,
  GridEvents,
  gridVisibleSortedRowIdsSelector,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

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

export default function GroupingColumnsSetChildrenExpansion() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = useKeepGroupingColumnsHidden(
    apiRef,
    data.columns,
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  const toggleSecondRow = () => {
    const rowIds = gridVisibleSortedRowIdsSelector(apiRef.current.state);

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
        <DataGridPro
          {...data}
          apiRef={apiRef}
          columns={columns}
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
    </Stack>
  );
}
