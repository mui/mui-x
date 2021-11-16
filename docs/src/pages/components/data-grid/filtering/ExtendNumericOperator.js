import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Rating from '@mui/material/Rating';
import { DataGrid, getGridNumericColumnOperators } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 20,
  },
});

function RatingInputValue(props) {
  const classes = useStyles();
  const { item, applyValue } = props;

  const handleFilterChange = (event) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <div className={classes.root}>
      <Rating
        name="custom-rating-filter-operator"
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
      />
    </div>
  );
}

RatingInputValue.propTypes = {
  applyValue: PropTypes.func.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
};

export default function ExtendNumericOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });
  const columns = [...data.columns];

  const [filterModel, setFilterModel] = React.useState({
    items: [{ columnField: 'rating', value: '3.5', operatorValue: '>=' }],
  });

  if (columns.length > 0) {
    const ratingColumn = columns.find((column) => column.field === 'rating');
    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');

    const ratingFilterOperators = getGridNumericColumnOperators().map(
      (operator) => ({
        ...operator,
        InputComponent: RatingInputValue,
      }),
    );

    columns[ratingColIndex] = {
      ...ratingColumn,
      filterOperators: ratingFilterOperators,
    };
  }
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.rows}
        columns={columns}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
      />
    </div>
  );
}
