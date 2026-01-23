import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  createCustomCellEditHandler,
  createCustomClipboardPasteHistoryHandler,
} from './customHistoryEventHandlers';

export default function CustomHandlers() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 200,
    editable: true,
  });

  const apiRef = useGridApiRef();

  const historyEventHandlers = React.useMemo(() => {
    if (!apiRef.current) {
      return {};
    }

    return {
      cellEditStop: createCustomCellEditHandler(apiRef),
      clipboardPasteEnd: createCustomClipboardPasteHistoryHandler(apiRef),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef.current]);

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        pagination
        pageSizeOptions={[50, 100]}
        showToolbar
        disableRowSelectionOnClick
        cellSelection
        disablePivoting
        disableRowGrouping
        disableColumnPinning
        historyEventHandlers={historyEventHandlers}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 50 } },
        }}
      />
    </Box>
  );
}
