import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import Box from '@mui/material/Box';
import {
  DataGridPremium,
  useGridApiRef,
  GridHistoryEventHandler,
  GridEvents,
  GridFilterModel,
  GridApiPremium,
  createClipboardPasteHistoryHandler,
  createRowEditHistoryHandler,
  createCellEditHistoryHandler,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

interface FilterHistoryData {
  oldFilterModel: GridFilterModel;
  newFilterModel: GridFilterModel;
}

function createFilterHistoryHandler(
  apiRef: RefObject<GridApiPremium>,
): GridHistoryEventHandler<FilterHistoryData> {
  let previousFilterModel: GridFilterModel = { items: [] };

  return {
    store: (newFilterModel: GridFilterModel) => {
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

    undo: async (data: FilterHistoryData) => {
      const { oldFilterModel } = data;
      apiRef.current.setFilterModel(oldFilterModel);
    },

    redo: async (data: FilterHistoryData) => {
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

  const apiRef = useGridApiRef() as RefObject<GridApiPremium>;

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
  }, [apiRef]) as Record<GridEvents, GridHistoryEventHandler<any>>;

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
