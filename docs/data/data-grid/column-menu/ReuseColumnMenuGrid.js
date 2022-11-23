import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconFilter from '@mui/icons-material/FilterAlt';
import IconClose from '@mui/icons-material/Close';
import {
  DataGrid,
  GridColumnMenuDefault,
  gridColumnMenuSlots,
} from '@mui/x-data-grid';
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

function CustomMenuItem(props) {
  const { onClick } = props;
  return (
    <Button sx={{ mt: 1, ml: 1 }} onClick={onClick} startIcon={<IconClose />}>
      Close column Menu
    </Button>
  );
}

CustomMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
};

function CustomColumnMenu(props) {
  const slots = {
    ...gridColumnMenuSlots,
    ColumnMenuFilterItem: {
      // override Filter slot
      component: CustomFilterItem,
      // put in start
      displayOrder: 1,
    },
    ColumnMenuSortItem: {
      ...gridColumnMenuSlots.ColumnMenuSortItem,
      // modify `displayOrder` to put after `Filter`
      displayOrder: 2,
    },
    CustomComponent: {
      component: CustomMenuItem,
      // place in last, after `ColumnMenuColumnsItem`
      displayOrder: 31,
    },
  };
  return (
    <GridColumnMenuDefault
      {...props}
      slots={slots}
      initialItems={[slots.CustomComponent]}
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
