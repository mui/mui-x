import * as React from 'react';
import PropTypes from 'prop-types';
import {
  DataGrid,
  GridColumnMenuFilterItem,
  GridColumnMenuSortItem,
  GridColumnMenuColumnsItem,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

function MenuCloseComponent(props) {
  return (
    <Button color="primary" onClick={props.onClick}>
      Close Menu
    </Button>
  );
}

MenuCloseComponent.propTypes = {
  onClick: PropTypes.func,
};

function CustomColumnMenu(props) {
  const itemProps = {
    column: props.currentColumn,
    onClick: props.hideMenu,
  };

  return (
    <Stack p={0.5}>
      <GridColumnMenuSortItem {...itemProps} />
      {/* Only provide filtering on desk */}
      {itemProps.column.field === 'desk' ? (
        <GridColumnMenuFilterItem {...itemProps} />
      ) : null}
      <Divider />
      <GridColumnMenuColumnsItem {...itemProps} />
      <MenuCloseComponent {...itemProps} />
    </Stack>
  );
}

CustomColumnMenu.propTypes = {
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
};

export default function CustomColumnMenuGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        components={{
          ColumnMenu: CustomColumnMenu,
        }}
      />
    </div>
  );
}
