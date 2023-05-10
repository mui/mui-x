import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  useGridSelector,
  gridFilterModelSelector,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const CustomHeaderFilter = React.forwardRef(function CustomHeaderFilter(props, ref) {
  const { colDef, width, height } = props;
  const apiRef = useGridApiContext();

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const activeFiltersCount =
    filterModel.items?.filter(({ field }) => field === colDef.field).length ?? 0;

  return (
    <Stack
      data-field={colDef.field}
      ref={ref}
      justifyContent="center"
      alignItems="center"
      width={width}
      height={height}
    >
      <Button onClick={() => apiRef.current.showFilterPanel(colDef.field)}>
        {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'Add'} filters
      </Button>
    </Stack>
  );
});

CustomHeaderFilter.propTypes = {
  colDef: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default function CustomHeaderFilterDataGridPro() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
        }}
        slots={{
          headerFilterCell: CustomHeaderFilter,
        }}
        experimentalFeatures={{ headerFilters: true }}
      />
    </div>
  );
}
