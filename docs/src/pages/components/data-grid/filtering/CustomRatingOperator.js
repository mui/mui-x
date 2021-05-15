import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

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
    columnField: PropTypes.string,
    id: PropTypes.number,
    operatorValue: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

const ratingOnlyOperators = [
  {
    label: 'From',
    value: 'from',
    getApplyFilterFn: (filterItem) => {
      if (
        !filterItem.columnField ||
        !filterItem.value ||
        !filterItem.operatorValue
      ) {
        return null;
      }

      return (params) => {
        return Number(params.value) >= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: 'number' },
  },
];

export default function CustomRatingOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });
  const columns = [...data.columns];

  if (columns.length > 0) {
    const ratingColumn = columns.find((col) => col.field === 'rating');
    const newRatingColumn = {
      ...ratingColumn,
      filterOperators: ratingOnlyOperators,
    };

    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');
    columns[ratingColIndex] = newRatingColumn;
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.rows}
        columns={columns}
        filterModel={{
          items: [{ columnField: 'rating', value: '3.5', operatorValue: 'from' }],
        }}
      />
    </div>
  );
}
