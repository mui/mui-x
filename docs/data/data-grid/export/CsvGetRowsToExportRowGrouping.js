import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import { createSvgIcon } from '@mui/material/utils';
import {
  DataGridPremium,
  gridRowTreeSelector,
  GridToolbarContainer,
  gridFilteredSortedRowIdsSelector,
  useGridApiContext,
} from '@mui/x-data-grid-premium';

const getRowsWithGroups = ({ apiRef }) => gridFilteredSortedRowIdsSelector(apiRef);

const getRowsWithoutGroups = ({ apiRef }) => {
  const rows = gridFilteredSortedRowIdsSelector(apiRef);
  const tree = gridRowTreeSelector(apiRef);

  return rows.filter((rowId) => tree[rowId].type !== 'group');
};

const ExportIcon = createSvgIcon(
  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
  'SaveAlt',
);

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const handleExport = (options) => apiRef.current.exportDataAsCsv(options);

  const buttonBaseProps = {
    color: 'primary',
    size: 'small',
    startIcon: <ExportIcon />,
  };

  return (
    <GridToolbarContainer>
      <Button
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getRowsWithGroups })}
      >
        Rows with groups
      </Button>
      <Button
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getRowsWithoutGroups })}
      >
        Rows without groups
      </Button>
    </GridToolbarContainer>
  );
}

export default function CsvGetRowsToExportRowGrouping() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        initialState={{
          ...data.initialState,
          rowGrouping: {
            ...data.initialState?.rowGrouping,
            model: ['commodity'],
          },
        }}
      />
    </div>
  );
}
