import * as React from 'react';
import {
  DataGridPro,
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  GridFilterItem,
  GridFilterModel,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip';
import useId from '@mui/utils/useId';
import { unstable_capitalize as capitalize } from '@mui/utils';
import { useDemoData } from '@mui/x-data-grid-generator';
import { GridSlots } from '@mui/x-data-grid';

function FilterPanelTrigger({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) {
  const filterButtonId = useId();
  const filterPanelId = useId();
  const apiRef = useGridApiContext();
  const { open, openedPanelValue } = useGridSelector(
    apiRef,
    gridPreferencePanelStateSelector,
  );
  const isOpen = open && openedPanelValue === GridPreferencePanelsValue.filters;

  const toggleFilterPanel = () => {
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
    <GridToolbar.Button
      ref={buttonRef}
      id={filterButtonId}
      aria-label="Filters"
      aria-haspopup="true"
      aria-expanded={isOpen ? 'true' : undefined}
      aria-controls={isOpen ? filterPanelId : undefined}
      onClick={toggleFilterPanel}
    >
      <FilterListIcon fontSize="small" />
    </GridToolbar.Button>
  );
}

type ToolbarProps = GridSlots['toolbar'] & {
  filterButtonRef: React.RefObject<HTMLButtonElement>;
  onRemoveFilter: (filterId: GridFilterItem['id']) => void;
};

function Toolbar({ filterButtonRef, onRemoveFilter, ...rest }: ToolbarProps) {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  return (
    <GridToolbar.Root {...rest}>
      <FilterPanelTrigger buttonRef={filterButtonRef} />
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
  const [filterButtonEl, setFilterButtonEl] =
    React.useState<HTMLButtonElement | null>(null);

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
        slots={{ toolbar: Toolbar as GridSlots['toolbar'] }}
        slotProps={{
          panel: { anchorEl: filterButtonEl },
          toolbar: {
            filterButtonRef: setFilterButtonEl,
            onRemoveFilter,
          },
        }}
      />
    </div>
  );
}
