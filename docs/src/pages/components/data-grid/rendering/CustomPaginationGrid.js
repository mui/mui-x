import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

function CustomPagination(props) {
  const { paginationProps } = props;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      color="primary"
      page={paginationProps.page}
      count={paginationProps.pageCount}
      onChange={(event, value) => paginationProps.setPage(value)}
    />
  );
}

CustomPagination.propTypes = {
  /**
   * The object containing all pagination details in [[PaginationProps]].
   */
  paginationProps: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    setPageSize: PropTypes.func.isRequired,
  }).isRequired,
};

export default function CustomPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pagination
        pageSize={5}
        components={{
          pagination: CustomPagination,
        }}
        {...data}
      />
    </div>
  );
}
