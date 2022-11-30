import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconFilter from '@mui/icons-material/FilterAlt';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import {
  DataGrid,
  GridColumnMenuDefault,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

function CustomFilterItem(props) {
  const { onClick, colDef } = props;
  const apiRef = useGridApiContext();
  const handleClick = React.useCallback(
    (event) => {
      apiRef.current.showFilterPanel(colDef.field);
      onClick(event);
    },
    [apiRef, colDef.field, onClick],
  );

  return (
    <Button sx={{ m: 1 }} onClick={handleClick} startIcon={<IconFilter />}>
      Show Filters
    </Button>
  );
}

CustomFilterItem.propTypes = {
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

function CustomUserItem(props) {
  const { myCustomHandler, myCustomValue } = props;
  return (
    <Button
      sx={{ m: 1 }}
      onClick={myCustomHandler}
      startIcon={<SettingsApplicationsIcon />}
    >
      {myCustomValue}
    </Button>
  );
}

function CustomColumnMenu(props) {
  return (
    <GridColumnMenuDefault
      {...props}
      components={{
        // Override slot for `ColumnMenuFilterItem`
        ColumnMenuFilterItem: CustomFilterItem,
        // Hide `ColumnMenuColumnsItem`
        ColumnMenuColumnsItem: null,
        // Add new item
        ColumnMenuUserItem: CustomUserItem,
      }}
      componentsProps={{
        // Swap positions of filter and sort items
        columnMenuFilterItem: {
          displayOrder: 0, // Previously `10`
        },
        columnMenuSortItem: {
          displayOrder: 10, // Previously `0`
        },
        columnMenuUserItem: {
          // set `displayOrder` for new item
          displayOrder: 15,
          // pass additional props
          myCustomValue: 'Do custom action',
          myCustomHandler: () => alert('Custom handler fired'),
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
