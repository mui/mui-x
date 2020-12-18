import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { DataGrid, getNumericColumnOperators } from '@material-ui/data-grid';
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
        placeholder={'Filter value'}
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

const filterModel = {
  items: [{ columnField: 'rating', value: '3.5', operatorValue: '>=' }],
};

export default function CustomRatingFilterOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });
  const [cols, setCols] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      const ratingColumn = data.columns.find((col) => col.field === 'rating');

      ratingColumn.filterOperators = getNumericColumnOperators();
      ratingColumn.filterOperators.forEach((operator) => {
        operator.InputComponent = RatingInputValue;
      });

      setCols(data.columns);
    }
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data.rows} columns={cols} filterModel={filterModel} />
    </div>
  );
}
