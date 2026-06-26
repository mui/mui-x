import * as React from 'react';
import {
  DataGridPro,
  Toolbar,
  ToolbarButton,
  FilterPanelTrigger,
  gridFilterActiveItemsSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';

function useActiveFiltersDescription() {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);

  if (activeFilters.length === 0) {
    return 'Filters';
  }

  return activeFilters
    .map((item) => {
      const column = apiRef.current.getColumn(item.field);
      const operator = column.filterOperators?.find(
        (filterOperator) => filterOperator.value === item.operator,
      );
      return `${column.headerName ?? column.field} ${operator?.label ?? item.operator} ${item.value ?? ''}`.trim();
    })
    .join(', ');
}

function CustomToolbar() {
  const description = useActiveFiltersDescription();

  return (
    <Toolbar>
      <Tooltip title={description}>
        <FilterPanelTrigger render={<ToolbarButton />}>
          <FilterListIcon fontSize="small" />
        </FilterPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function FilterPanelTriggerDescription() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [{ field: 'quantity', operator: '>', value: '50000' }],
            },
          },
        }}
      />
    </div>
  );
}
