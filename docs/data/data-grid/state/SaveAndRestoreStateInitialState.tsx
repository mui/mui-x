import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { GridInitialStatePremium } from '@mui/x-data-grid-premium/models/gridStatePremium';

export default function SaveAndRestoreStateInitialState() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const [initialState, setInitialState] = React.useState<GridInitialStatePremium>();

  React.useEffect(() => {
    const stateFromLocalStorage = localStorage?.getItem('dataGridState');
    setInitialState(stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {});
  }, []);

  const saveSnapshot = React.useCallback(() => {
    if (apiRef?.current && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem('dataGridState', JSON.stringify(currentState));
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
          ...data.initialState,
          ...initialState,
        }}
      />
    </Box>
  );
}
