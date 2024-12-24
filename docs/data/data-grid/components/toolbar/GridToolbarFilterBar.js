import * as React from 'react';
import {
  DataGridPro,
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  Grid,
  useGridApiContext,
  useGridSelector,
  GridFilterListIcon,
} from '@mui/x-data-grid-pro';
import Chip from '@mui/material/Chip';
import { unstable_capitalize as capitalize } from '@mui/utils';
import { useDemoData } from '@mui/x-data-grid-generator';

function Toolbar({ onRemoveFilter }) {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  return (
    <Grid.Toolbar.Root>
      <Grid.FilterPanel.Trigger render={<Grid.Toolbar.Button size="small" />}>
        <GridFilterListIcon fontSize="small" />
      </Grid.FilterPanel.Trigger>

      {activeFilters.map((filter) => {
        const column = columns[filter.field];
        const field = column?.headerName ?? filter.field;
        const operator = apiRef.current.getLocaleText(
          `filterOperator${capitalize(filter.operator)}`,
        );
        const isDate = column?.type === 'date';
        const value = isDate
          ? new Date(filter.value).toLocaleDateString()
          : (filter.value ?? '');

        return (
          <Chip
            key={filter.id}
            label={`${field} ${operator} ${value}`}
            onDelete={() => onRemoveFilter(filter.id)}
            sx={{ mx: 0.25 }}
          />
        );
      })}
    </Grid.Toolbar.Root>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'position'];

export default function GridToolbarFilterBar() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = React.useState({
    items: [
      {
        id: 'rating',
        field: 'rating',
        operator: '>',
        value: '2.5',
      },
      {
        id: 'dateCreated',
        field: 'dateCreated',
        operator: 'before',
        value: '2024-01-01',
      },
    ],
  });

  const onRemoveFilter = (filterId) => {
    setFilterModel({
      items: filterModel.items.filter((item) => item.id !== filterId),
    });
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        slots={{ toolbar: Toolbar }}
        slotProps={{ toolbar: { onRemoveFilter } }}
      />
    </div>
  );
}
