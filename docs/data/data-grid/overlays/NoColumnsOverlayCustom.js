import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  DataGrid,
  GridPreferencePanelsValue,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
  '& .no-columns-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-columns-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoColumnsOverlay() {
  const apiRef = useGridApiContext();

  const handleOpenManageColumns = () => {
    apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
  };

  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 370 260"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-columns-secondary"
          d="M10 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10C0 4.477 4.477 0 10 0Zm50 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10ZM110 194c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10v-46c0-5.523 4.477-10 10-10Zm150 0c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10v-46c0-5.523 4.477-10 10-10Zm-100 27c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10v-19c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10v-19c0-5.523 4.477-10 10-10Z"
        />
        <path
          className="no-columns-primary"
          d="M185 71c-32.585 0-59 26.415-59 59s26.415 59 59 59 59-26.415 59-59-26.415-59-59-59Zm-79 59c0-43.63 35.37-79 79-79s79 35.37 79 79c0 43.631-35.37 79-79 79s-79-35.369-79-79Zm109.296-30.56c3.905 3.905 3.905 10.236 0 14.142l-16.286 16.286 16.286 16.286c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-16.286-16.286-16.286 16.286c-3.905 3.905-10.237 3.905-14.142 0-3.906-3.905-3.906-10.237 0-14.142l16.286-16.286-16.286-16.286c-3.906-3.905-3.906-10.237 0-14.142 3.905-3.906 10.237-3.906 14.142 0l16.286 16.286 16.286-16.286c3.905-3.906 10.237-3.906 14.142 0Z"
        />
      </svg>
      <Stack sx={{ mt: 2 }} gap={1}>
        No columns
        <Button onClick={handleOpenManageColumns} size="small">
          Manage columns
        </Button>
      </Stack>
    </StyledGridOverlay>
  );
}

export default function NoColumnsOverlayCustom() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50,
    maxColumns: 6,
  });

  const initialColumns = React.useMemo(
    () =>
      data.columns.reduce((acc, col) => {
        acc[col.field] = false;
        return acc;
      }, {}),
    [data.columns],
  );

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid
        {...data}
        initialState={{
          columns: {
            columnVisibilityModel: initialColumns,
          },
        }}
        slots={{
          noColumnsOverlay: CustomNoColumnsOverlay,
        }}
      />
    </Box>
  );
}
