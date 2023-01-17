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
  onClick: PropTypes.func.isRequired,
};

function CustomColumnMenu(props) {
  const itemProps = {
    colDef: props.colDef,
    onClick: props.hideMenu,
  };
  return (
    <React.Fragment>
      <Stack px={0.5} py={0.5}>
        <GridColumnMenuSortItem {...itemProps} />
        {/* Only provide filtering on desk */}
        {itemProps.colDef.field === 'desk' ? (
          <GridColumnMenuFilterItem {...itemProps} />
        ) : null}
      </Stack>
      <Divider />
      <Stack px={0.5} py={0.5}>
        <GridColumnMenuColumnsItem {...itemProps} />
        <MenuCloseComponent {...itemProps} />
      </Stack>
    </React.Fragment>
  );
}

CustomColumnMenu.propTypes = {
  colDef: PropTypes.object.isRequired,
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
