import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { GridInitialStatePremium } from '@mui/x-data-grid-premium/models/gridStatePremium';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

function saveDataGridStateToLocalStorage(stateSnapshot: GridInitialStatePremium) {
  console.info('State update: Update the state snap in localStorage', stateSnapshot);
  localStorage.setItem('dataGridState', JSON.stringify(stateSnapshot));
}

function getInitialStateFromLocalStorage(): Promise<GridInitialStatePremium> {
  const stateFromLocalStorage = localStorage.getItem('dataGridState');
  return new Promise((resolve) => {
    if (!stateFromLocalStorage) {
      resolve({});
      return;
    }
    const state = JSON.parse(stateFromLocalStorage);
    resolve(state);
  });
}

export default function SaveAndRestoreStateInitialState() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const [initialState, setInitialState] = React.useState<GridInitialStatePremium>();

  React.useEffect(() => {
    const getSnapshot = async () => {
      const snapshotFromLocalStorage = await getInitialStateFromLocalStorage();
      setInitialState(snapshotFromLocalStorage);
    };
    getSnapshot().catch(() => {
      // fallback to no state when state retrieval fails
      setInitialState({});
    });
  }, []);

  const saveSnapshot = React.useCallback(() => {
    if (apiRef?.current) {
      const currentState = apiRef.current.exportState();
      saveDataGridStateToLocalStorage(currentState);
    }
  }, [apiRef]);

  if (!initialState) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        loading={loading}
        onStateChange={saveSnapshot}
        initialState={{
          ...initialState,
        }}
      />
    </Box>
  );
}
