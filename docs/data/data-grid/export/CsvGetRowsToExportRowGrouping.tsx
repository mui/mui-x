import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import {
  DataGridPremium,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
  gridRowTreeSelector,
  gridFilteredSortedRowIdsSelector,
  useGridApiContext,
  Toolbar,
  ToolbarButton,
  GridDownloadIcon,
} from '@mui/x-data-grid-premium';

const getRowsWithGroups = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridFilteredSortedRowIdsSelector(apiRef);

const getRowsWithoutGroups = ({ apiRef }: GridCsvGetRowsToExportParams) => {
  const rows = gridFilteredSortedRowIdsSelector(apiRef);
  const tree = gridRowTreeSelector(apiRef);

  return rows.filter((rowId) => tree[rowId].type !== 'group');
};

const buttonBaseProps = {
  color: 'primary',
  size: 'small',
  startIcon: <GridDownloadIcon />,
} as const;

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const handleExport = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  return (
    <Toolbar>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getRowsWithGroups })}
      >
        Rows with groups
      </ToolbarButton>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getRowsWithoutGroups })}
      >
        Rows without groups
      </ToolbarButton>
    </Toolbar>
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
