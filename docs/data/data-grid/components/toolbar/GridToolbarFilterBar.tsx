import * as React from 'react';
import {
  DataGridPro,
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  GridFilterItem,
  GridFilterModel,
  useGridApiContext,
  useGridSelector,
  GridFilterListIcon,
  GridToolbarProps,
  Toolbar,
  ToolbarButton,
  FilterPanelTrigger,
} from '@mui/x-data-grid-pro';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { unstable_capitalize as capitalize } from '@mui/utils';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onRemoveFilter: (filterId: GridFilterItem['id']) => void;
  }
}

type ToolbarProps = GridToolbarProps & {
  onRemoveFilter: (filterId: GridFilterItem['id']) => void;
};

function CustomToolbar({ onRemoveFilter }: ToolbarProps) {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  return (
    <Toolbar>
      <Tooltip title="Filters">
        <FilterPanelTrigger render={<ToolbarButton />}>
          <GridFilterListIcon fontSize="small" />
        </FilterPanelTrigger>
      </Tooltip>
      <Stack direction="row" sx={{ gap: 0.5, flex: 1 }}>
        {activeFilters.map((filter) => {
          const column = columns[filter.field];
          const field = column?.headerName ?? filter.field;
          const operator = apiRef.current.getLocaleText(
            `filterOperator${capitalize(filter.operator)}` as 'filterOperatorContains',
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
      </Stack>
    </Toolbar>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'position'];

export default function GridToolbarFilterBar() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
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

  const onRemoveFilter = (filterId: GridFilterItem['id']) => {
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
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: { onRemoveFilter },
          basePopper: {
            placement: 'bottom-start',
          },
        }}
        showToolbar
      />
    </div>
  );
}
