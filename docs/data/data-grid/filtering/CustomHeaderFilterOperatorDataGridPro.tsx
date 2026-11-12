import * as React from 'react';
import Box from '@mui/material/Box';
import type { RatingProps } from '@mui/material/Rating';
import Rating from '@mui/material/Rating';
import type { GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { DataGridPro, getGridNumericOperators } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

function RatingInputValue(
  props: GridFilterInputValueProps & {
    headerFilterMenu: React.ReactNode;
    clearButton: React.ReactNode;
  },
) {
  const { item, applyValue, headerFilterMenu, clearButton } = props;

  const handleFilterChange: RatingProps['onChange'] = (event, newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Rating
        name="custom-rating-filter-operator"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
        sx={{ mr: 0.5 }}
      />
      {headerFilterMenu}
      {clearButton}
    </Box>
  );
}

export default function CustomHeaderFilterOperatorDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((colDef) => {
        if (colDef.field === 'rating') {
          return {
            ...colDef,
            minWidth: 200,
            filterOperators: getGridNumericOperators()
              .filter((operator) => operator.value !== 'isAnyOf')
              .map((operator) => ({
                ...operator,
                InputComponent: operator.InputComponent
                  ? RatingInputValue
                  : undefined,
              })),
          };
        }
        return colDef;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} loading={loading} columns={columns} headerFilters />
    </div>
  );
}
