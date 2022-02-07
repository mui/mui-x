import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  DataGridProProps,
  GridInitialState,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';

const GridCustomToolbar = ({
  unMount,
}: {
  unMount: (stateToSave: GridInitialState) => void;
}) => {
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

interface WrappedDataGridProProps
  extends Omit<
    DataGridProProps,
    'columns' | 'rows' | 'loading' | 'apiRef' | 'components' | 'componentsProps'
  > {
  unMount: (stateToSave: GridInitialState) => void;
}

const WrappedDataGridPro = (props: WrappedDataGridProProps) => {
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

export default function RestoreStateInitialState() {
  const [savedState, setSavedState] = React.useState<GridInitialState | undefined>(
    undefined,
  );
  const [isMounted, setIsMounted] = React.useState(true);

  const unMountGrid = React.useCallback((stateToState: GridInitialState) => {
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
