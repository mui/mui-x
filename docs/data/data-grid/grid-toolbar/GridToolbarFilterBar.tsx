import * as React from 'react';
import {
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  GridFilterItem,
  GridFilterModel,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridToolbarV8 as GridToolbar,
  GridToolbarProps,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FilterListIcon from '@mui/icons-material/FilterList';
import useId from '@mui/utils/useId';
import { unstable_capitalize as capitalize } from '@mui/utils';
import Chip from '@mui/material/Chip';
import { DataGridPro } from '@mui/x-data-grid-pro';

function FilterPanelTrigger() {
  const filterButtonId = useId();
  const filterPanelId = useId();
  const apiRef = useGridApiContext();
  const { open, openedPanelValue } = useGridSelector(
    apiRef,
    gridPreferencePanelStateSelector,
  );
  const isOpen = open && openedPanelValue === GridPreferencePanelsValue.filters;

  const toggleFilters = () => {
    if (isOpen) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.filters,
        filterPanelId,
        filterButtonId,
      );
    }
  };

  return (
    <GridToolbar.ToggleButton
      aria-label="Filters"
      value="filters"
      selected={isOpen}
      onChange={toggleFilters}
    >
      <FilterListIcon fontSize="small" />
    </GridToolbar.ToggleButton>
  );
}

function Toolbar({ onRemoveFilter }: GridToolbarProps) {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  return (
    <GridToolbar.Root>
      <FilterPanelTrigger />
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
    </GridToolbar.Root>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'position'];

export default function GridToolbarFilterBar() {
  const { data } = useDemoData({
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
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          toolbar: {
            onRemoveFilter,
          },
        }}
      />
    </div>
  );
}
