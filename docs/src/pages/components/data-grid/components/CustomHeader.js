import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import {
  useGridSlotComponentProps,
  DataGrid,
  GridHeader,
} from '@material-ui/data-grid';

function PaginationComponent(props) {
  const { state, apiRef } = useGridSlotComponentProps();
  return (
    <Pagination
      className="my-custom-pagination"
      page={state.pagination.page + 1}
      color={props.color}
      count={state.pagination.pageCount}
      onChange={(event, value) => apiRef.current.setPage(value)}
    />
  );
}

PaginationComponent.propTypes = {
  color: PropTypes.oneOf(['primary']),
};

export { PaginationComponent };

const useStyles = makeStyles(() => ({
  root: {
    padding: 10,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
}));

export function CustomHeaderComponent(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <GridHeader {...props} />
      <div className={classes.root}>
        <PaginationComponent {...props} />
      </div>
    </React.Fragment>
  );
}

export default function CustomHeader() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 350, width: '100%' }}>
      <DataGrid
        {...data}
        hideFooter
        pagination
        pageSize={5}
        components={{
          Header: CustomHeaderComponent,
        }}
        componentsProps={{
          header: { color: 'primary' },
        }}
      />
    </div>
  );
}
