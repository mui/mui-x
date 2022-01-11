import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';

const GridCustomToolbar = ({ unMount }) => {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <rootProps.components.BaseButton
        size="small"
        color="primary"
        startIcon={<rootProps.components.ColumnSelectorIcon />}
        onClick={() => unMount(apiRef.current.exportState())}
        {...rootProps.componentsProps?.baseButton}
      >
        Save state and unmount
      </rootProps.components.BaseButton>
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
      <Box sx={{ width: '100%', height: 400, bgcolor: 'background.paper' }}>
        <WrappedDataGridPro unMount={unMountGrid} initialState={savedState} />
      </Box>
    );
  }

  return <Button onClick={restoreGrid}>Remount the grid</Button>;
}
