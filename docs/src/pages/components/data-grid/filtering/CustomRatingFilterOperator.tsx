import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import {
  DataGrid,
  FilterInputValueProps,
  getNumericColumnOperators,
} from '@material-ui/data-grid';
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

function RatingInputValue(props: FilterInputValueProps) {
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

const filterModel = {
  items: [{ columnField: 'rating', value: '3.5', operatorValue: '>=' }],
};

export default function CustomRatingFilterOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });
  const [columns, setColumns] = React.useState(data.columns);

  React.useEffect(() => {
    if (data.columns.length > 0) {
      const ratingColumn = data.columns.find((column) => column.field === 'rating')!;

      ratingColumn.filterOperators = getNumericColumnOperators().map((operator) => ({
        ...operator,
        InputComponent: RatingInputValue,
      }));

      setColumns(data.columns);
    }
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} columns={columns} filterModel={filterModel} />
    </div>
  );
}
