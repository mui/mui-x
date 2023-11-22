import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DataGrid, useGridRootProps } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import SyncIcon from '@mui/icons-material/Sync';

function InputNumberInterval(props) {
  const rootProps = useGridRootProps();
  const { item, applyValue, focusElementRef = null } = props;

  const filterTimeout = React.useRef();
  const [filterValueState, setFilterValueState] = React.useState(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    const itemValue = item.value ?? [undefined, undefined];
    setFilterValueState(itemValue);
  }, [item.value]);

  const updateFilterValue = (lowerBound, upperBound) => {
    clearTimeout(filterTimeout.current);
    setFilterValueState([lowerBound, upperBound]);

    setIsApplying(true);
    filterTimeout.current = setTimeout(() => {
      setIsApplying(false);
      applyValue({ ...item, value: [lowerBound, upperBound] });
    }, rootProps.filterDebounceMs);
  };

  const handleUpperFilterChange = (event) => {
    const newUpperBound = event.target.value;
    updateFilterValue(filterValueState[0], newUpperBound);
  };
  const handleLowerFilterChange = (event) => {
    const newLowerBound = event.target.value;
    updateFilterValue(newLowerBound, filterValueState[1]);
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'end',
        height: 48,
        pl: '20px',
      }}
    >
      <TextField
        name="lower-bound-input"
        placeholder="From"
        label="From"
        variant="standard"
        value={Number(filterValueState[0])}
        onChange={handleLowerFilterChange}
        type="number"
        inputRef={focusElementRef}
        sx={{ mr: 2 }}
      />
      <TextField
        name="upper-bound-input"
        placeholder="To"
        label="To"
        variant="standard"
        value={Number(filterValueState[1])}
        onChange={handleUpperFilterChange}
        type="number"
        InputProps={applying ? { endAdornment: <SyncIcon /> } : {}}
      />
    </Box>
  );
}

const quantityOnlyOperators = [
  {
    label: 'Between',
    value: 'between',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
        return null;
      }
      if (filterItem.value[0] == null || filterItem.value[1] == null) {
        return null;
      }
      return (value) => {
        return (
          value !== null &&
          filterItem.value[0] <= value &&
          value <= filterItem.value[1]
        );
      };
    },
    InputComponent: InputNumberInterval,
  },
];

export default function CustomMultiValueOperator() {
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  const [filterModel, setFilterModel] = React.useState({
    items: [
      {
        id: 1,
        field: 'quantity',
        value: [5000, 15000],
        operator: 'between',
      },
    ],
  });

  const columns = React.useMemo(() => {
    const newColumns = [...data.columns];

    if (newColumns.length > 0) {
      const index = newColumns.findIndex((col) => col.field === 'quantity');
      const quantityColumn = newColumns[index];

      newColumns[index] = {
        ...quantityColumn,
        filterOperators: quantityOnlyOperators,
      };
    }

    return newColumns;
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        columns={columns}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
      />
    </div>
  );
}
