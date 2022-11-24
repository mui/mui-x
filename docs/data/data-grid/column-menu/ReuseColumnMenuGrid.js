import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconFilter from '@mui/icons-material/FilterAlt';
import { DataGrid, GridColumnMenuDefault } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomFilterItem(props) {
  const { onClick } = props;
  return (
    <Button sx={{ m: 1 }} onClick={onClick} startIcon={<IconFilter />}>
      Show Filters
    </Button>
  );
}

CustomFilterItem.propTypes = {
  onClick: PropTypes.func.isRequired,
};

function CustomColumnMenu(props) {
  return (
    <GridColumnMenuDefault
      {...props}
      slots={{
        // Override slot for `ColumnMenuFilterItem`
        ColumnMenuFilterItem: CustomFilterItem,
        // Hide `ColumnMenuColumnsItem`
        ColumnMenuColumnsItem: null,
      }}
      slotsProps={{
        // Swap positions of filter and sort items
        ColumnMenuFilterItem: {
          displayOrder: 0, // Previously `10`
        },
        ColumnMenuSortItem: {
          displayOrder: 10, // Previously `0`
        },
      }}
    />
  );
}

export default function ReuseColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} components={{ ColumnMenu: CustomColumnMenu }} />
    </div>
  );
}
