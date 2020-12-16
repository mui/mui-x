import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Rating } from '@material-ui/lab';
import {
  PreferencePanelsValue,
  DataGrid,
  FilterInputValueProps,
  NUMERIC_OPERATORS,
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const useStyles = makeStyles({
  ratingContainer: {
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
  const [filterValueState, setFilterValueState] = React.useState<number>(
    Number(item.value),
  );

  const onFilterChange = React.useCallback(
    (event) => {
      const value = event.target.value;
      setFilterValueState(value);
      applyValue({ ...item, value });
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    setFilterValueState(Number(item.value));
  }, [item.value]);

  return (
    <div className={classes.ratingContainer}>
      <Rating
        placeholder={'Filter value'}
        value={filterValueState}
        onChange={onFilterChange}
        precision={0.1}
      />
    </div>
  );
}

const filterModel = {
  items: [{ columnField: 'rating', value: '3.5', operatorValue: '>=' }],
};

export default function CustomFilterOperator() {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });

  React.useEffect(() => {
    if (data.columns.length > 0) {
      const ratingColumn = data.columns.find((col) => col.field === 'rating');
      const ratingOperators = [...NUMERIC_OPERATORS].map((operator) => {
        operator.InputComponent = RatingInputValue;
        return operator;
      });
      ratingColumn!.filterOperators = ratingOperators;

      // Just hidding some columns for demo clarity
      data.columns
        .filter(
          (col) =>
            col.field === 'phone' ||
            col.field === 'email' ||
            col.field === 'username',
        )
        .forEach((col) => {
          col.hide = true;
        });
    }
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data.rows} columns={data.columns} filterModel={filterModel} />
    </div>
  );
}
