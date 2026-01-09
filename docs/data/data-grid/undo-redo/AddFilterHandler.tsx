import * as React from 'react';
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
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';

interface FilterHistoryData {
  oldFilterModel: GridFilterModel;
  newFilterModel: GridFilterModel;
}

function createFilterHistoryHandler(
  apiRef: React.RefObject<GridApiPremium>,
): GridHistoryEventHandler<FilterHistoryData> {
  let previousFilterModel: GridFilterModel | undefined;

  return {
    store: (newFilterModel: GridFilterModel) => {
      const oldFilterModel = previousFilterModel;
      previousFilterModel = { ...newFilterModel };

      // Ignore changes made to the operator for the empty values
      const oldFilterItemsWithValues = oldFilterModel?.items.filter(
        (item) => item.value !== undefined,
      );
      const newFilterItemsWithValues = newFilterModel.items.filter(
        (item) => item.value !== undefined,
      );

      if (
        !oldFilterModel &&
        newFilterItemsWithValues.length === 0 &&
        newFilterModel.quickFilterValues?.length === 0
      ) {
        return null;
      }

      if (
        oldFilterModel &&
        isDeepEqual(oldFilterItemsWithValues, newFilterItemsWithValues) &&
        isDeepEqual(
          oldFilterModel.quickFilterValues,
          newFilterModel.quickFilterValues,
        ) &&
        oldFilterModel.logicOperator === newFilterModel.logicOperator &&
        oldFilterModel.quickFilterLogicOperator ===
          newFilterModel.quickFilterLogicOperator
      ) {
        return null;
      }

      return {
        oldFilterModel: oldFilterModel || { items: [] },
        newFilterModel,
      };
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

  const apiRef = useGridApiRef() as React.RefObject<GridApiPremium>;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef.current]) as Record<GridEvents, GridHistoryEventHandler<any>>;

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        historyEventHandlers={historyEventHandlers}
        showToolbar
        disableRowSelectionOnClick
        cellSelection
        disablePivoting
        disableRowGrouping
        disableColumnPinning
      />
    </Box>
  );
}
