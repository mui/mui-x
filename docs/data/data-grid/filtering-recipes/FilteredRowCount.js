import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const predefinedFilters = [
  {
    label: 'All',
    filterModel: { items: [] },
  },
  {
    label: 'Filled',
    filterModel: { items: [{ field: 'status', operator: 'is', value: 'Filled' }] },
  },
  {
    label: 'Open',
    filterModel: { items: [{ field: 'status', operator: 'is', value: 'Open' }] },
  },
  {
    label: 'Rejected',
    filterModel: { items: [{ field: 'status', operator: 'is', value: 'Rejected' }] },
  },
  {
    label: 'Partially Filled',
    filterModel: {
      items: [{ field: 'status', operator: 'is', value: 'PartiallyFilled' }],
    },
  },
];

export default function FilteredRowCount() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    maxColumns: 10,
  });

  const apiRef = useGridApiRef();

  const [predefinedFiltersRowCount, setPredefinedFiltersRowCount] = React.useState(
    [],
  );

  const getFilteredRowsCount = React.useCallback(
    (filterModel) => {
      const { filteredRowsLookup } = apiRef.current.getFilterState(filterModel);
      return Object.keys(filteredRowsLookup).filter(
        (rowId) => filteredRowsLookup[rowId] === true,
      ).length;
    },
    [apiRef],
  );

  React.useEffect(() => {
    // Calculate the row count for predefined filters
    if (data.rows.length === 0) {
      return;
    }

    setPredefinedFiltersRowCount(
      predefinedFilters.map(({ filterModel }) => getFilteredRowsCount(filterModel)),
    );
  }, [apiRef, data.rows, getFilteredRowsCount]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Stack direction="row" gap={1} mb={1} flexWrap="wrap">
        {predefinedFilters.map(({ label, filterModel }, index) => {
          const count = predefinedFiltersRowCount[index];
          return (
            <Button
              key={label}
              onClick={() => apiRef.current.setFilterModel(filterModel)}
              variant="outlined"
            >
              {label} {count !== undefined ? `(${count})` : ''}
            </Button>
          );
        })}
      </Stack>
      <Box sx={{ height: 520, width: '100%' }}>
        <DataGridPro {...data} loading={data.rows.length === 0} apiRef={apiRef} />
      </Box>
    </div>
  );
}
