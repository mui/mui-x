import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';

export default function SaveAndRestoreStateInitialState() {
  const apiRef = useGridApiRef();
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const [initialState, setInitialState] = React.useState();

  const saveSnapshot = React.useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem('dataGridState', JSON.stringify(currentState));
    }
  }, [apiRef]);

  React.useLayoutEffect(() => {
    const stateFromLocalStorage = localStorage?.getItem('dataGridState');
    setInitialState(stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {});

    // handle refresh and navigating away/refreshing
    window.addEventListener('beforeunload', saveSnapshot);

    return () => {
      // in case of an SPA remove the event-listener
      window.removeEventListener('beforeunload', saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  if (!initialState) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        loading={loading}
        initialState={{
          ...data.initialState,
          ...initialState,
        }}
      />
    </Box>
  );
}
