import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridToolbar,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, styled, darken, lighten, Theme } from '@mui/material/styles';
import { useDemoDataSource } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];

function getBorderColor(theme: Theme) {
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

const StyledDiv = styled('div')(({ theme: t }) => ({
  position: 'absolute',
  zIndex: 10,
  fontSize: '0.875em',
  top: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  border: `1px solid ${getBorderColor(t)}`,
  backgroundColor: t.palette.background.default,
}));

function ErrorOverlay({ error }: { error: Error }) {
  if (!error?.message) {
    return null;
  }
  return <StyledDiv>{error.message}</StyledDiv>;
}

export default function ServerSideErrorHandling() {
  const apiRef = useGridApiRef();
  const [error, setError] = React.useState<Error | null>();
  const [serverOptions, setServerOptions] = React.useState({
    useCursorPagination: false,
    successRate: 0.5,
  });

  const { getRows, ...props } = useDemoDataSource({}, serverOptions);

  const dataSource = React.useMemo(() => {
    return {
      getRows,
    };
  }, [getRows]);

  const initialState: GridInitialState = React.useMemo(
    () => ({
      ...props.initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [props.initialState],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setError(null);
            apiRef.current.fetchTopLevelRows();
          }}
        >
          Refetch Rows
        </Button>
        <Box sx={{ width: 250 }}>
          <Typography>Success Rate</Typography>
          <Slider
            size="small"
            aria-label="Success Rate"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={0}
            max={100}
            value={serverOptions.successRate * 100}
            onChange={(_, value) =>
              setServerOptions((prev) => ({
                ...prev,
                successRate: Number(value) / 100,
              }))
            }
          />
        </Box>
      </div>
      <div style={{ height: 400, position: 'relative' }}>
        <DataGridPro
          {...props}
          unstable_dataSource={dataSource}
          unstable_onDataSourceError={(e) => setError(e)}
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialState}
          slots={{ toolbar: GridToolbar }}
        />
        {error && <ErrorOverlay error={error} />}
      </div>
    </div>
  );
}
