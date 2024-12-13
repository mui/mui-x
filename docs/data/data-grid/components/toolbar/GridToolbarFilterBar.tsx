import * as React from 'react';
import {
  DataGridPro,
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  GridFilterItem,
  GridFilterModel,
  Grid,
  useGridApiContext,
  useGridSelector,
  GridFilterListIcon,
  GridToolbarProps,
} from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { unstable_capitalize as capitalize } from '@mui/utils';
import { useDemoData } from '@mui/x-data-grid-generator';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onRemoveFilter: (filterId: GridFilterItem['id']) => void;
  }
}

type ToolbarProps = GridToolbarProps & {
  onRemoveFilter: (filterId: GridFilterItem['id']) => void;
};

const GridToolbarRoot = styled(Grid.Toolbar.Root)(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  height: 45,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GridToolbarButton = styled(Grid.Toolbar.Button)(({ theme }) => ({
  minWidth: 0,
  color: theme.palette.action.active,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Toolbar({ onRemoveFilter }: ToolbarProps) {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  return (
    <GridToolbarRoot>
      <Grid.FilterPanel.Trigger render={<GridToolbarButton />}>
        <GridFilterListIcon fontSize="small" />
      </Grid.FilterPanel.Trigger>

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
    </GridToolbarRoot>
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
        slots={{ toolbar: Toolbar }}
        slotProps={{ toolbar: { onRemoveFilter } }}
      />
    </div>
  );
}
