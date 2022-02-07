import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';

const GridCustomToolbar = ({ unMount }) => {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        size="small"
        color="primary"
        startIcon={<rootProps.components.ColumnSelectorIcon />}
        onClick={() => unMount(apiRef.current.exportState())}
        {...rootProps.componentsProps?.baseButton}
      >
        Save state and unmount
      </Button>
    </GridToolbarContainer>
  );
};

GridCustomToolbar.propTypes = {
  unMount: PropTypes.func.isRequired,
};

const WrappedDataGridPro = (props) => {
  const { unMount, ...other } = props;

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
  });

  if (loading) {
    return null;
  }

  return (
    <DataGridPro
      components={{ Toolbar: GridCustomToolbar }}
      componentsProps={{ toolbar: { unMount } }}
      {...data}
      {...other}
    />
  );
};

WrappedDataGridPro.propTypes = {
  unMount: PropTypes.func.isRequired,
};

export default function RestoreStateInitialState() {
  const [savedState, setSavedState] = React.useState(undefined);

  const [isMounted, setIsMounted] = React.useState(true);

  const unMountGrid = React.useCallback((stateToState) => {
    setIsMounted(false);
    setSavedState(stateToState);
  }, []);

  const restoreGrid = () => setIsMounted(true);

  if (isMounted) {
    return (
      <React.Fragment>
        <Box sx={{ width: '100%', height: 400, bgcolor: 'background.paper' }}>
          <WrappedDataGridPro unMount={unMountGrid} initialState={savedState} />
        </Box>
        {!!savedState && (
          <Alert severity="info" style={{ marginBottom: 8 }}>
            <code>Initial state: {JSON.stringify(savedState)}</code>
          </Alert>
        )}
      </React.Fragment>
    );
  }

  return <Button onClick={restoreGrid}>Remount the grid</Button>;
}
