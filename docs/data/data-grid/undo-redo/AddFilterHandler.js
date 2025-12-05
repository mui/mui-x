import * as React from 'react';

import Box from '@mui/material/Box';
import {
  DataGridPremium,
  useGridApiRef,
  createClipboardPasteHistoryHandler,
  createRowEditHistoryHandler,
  createCellEditHistoryHandler,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

function createFilterHistoryHandler(apiRef) {
  let previousFilterModel = { items: [] };

  return {
    store: (newFilterModel) => {
      const oldFilterModel = previousFilterModel;
      previousFilterModel = { ...newFilterModel };

      return {
        oldFilterModel,
        newFilterModel,
      };
    },
    validate: () => {
      // We will assume that the filter model will not be changed in a way that does not send `filterModelChange` event
      return true;
    },
    undo: async (data) => {
      const { oldFilterModel } = data;
      apiRef.current.setFilterModel(oldFilterModel);
    },
    redo: async (data) => {
      const { newFilterModel } = data;
      apiRef.current.setFilterModel(newFilterModel);
    },
  };
}

export default function AddFilterHandler() {
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
      cellEditStop: createCellEditHistoryHandler(apiRef),
      rowEditStop: createRowEditHistoryHandler(apiRef),
      clipboardPasteEnd: createClipboardPasteHistoryHandler(apiRef),
      filterModelChange: createFilterHistoryHandler(apiRef),
    };
  }, [apiRef]);

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        historyEventHandlers={historyEventHandlers}
      />
    </Box>
  );
}
