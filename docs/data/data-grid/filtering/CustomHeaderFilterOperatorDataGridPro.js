import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { DataGridPro, getGridNumericOperators } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

function RatingInputValue(props) {
  const { item, applyValue, focusElementRef, headerFilterMenu, clearButton } = props;

  const ratingRef = React.useRef(null);
  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      ratingRef.current
        .querySelector(`input[value="${Number(item.value) || ''}"]`)
        .focus();
    },
  }));

  const handleFilterChange = (event, newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <React.Fragment>
      {headerFilterMenu}
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: '100%',
          pl: '10px',
          bl: '1px solid lightgrey',
        }}
      >
        <Rating
          name="custom-rating-filter-operator"
          placeholder="Filter value"
          value={Number(item.value)}
          onChange={handleFilterChange}
          precision={0.5}
          ref={ratingRef}
        />
      </Box>
      {clearButton}
    </React.Fragment>
  );
}

RatingInputValue.propTypes = {
  applyValue: PropTypes.func.isRequired,
  clearButton: PropTypes.node,
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
  headerFilterMenu: PropTypes.node,
  item: PropTypes.shape({
    /**
     * The column from which we want to filter the rows.
     */
    field: PropTypes.string.isRequired,
    /**
     * Must be unique.
     * Only useful when the model contains several items.
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * The name of the operator we want to apply.
     */
    operator: PropTypes.string.isRequired,
    /**
     * The filtering value.
     * The operator filtering function will decide for each row if the row values is correct compared to this value.
     */
    value: PropTypes.any,
  }).isRequired,
};

export default function CustomHeaderFilterOperatorDataGridPro() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((colDef) => {
        if (colDef.field === 'rating') {
          return {
            ...colDef,
            minWidth: 200,
            filterOperators: getGridNumericOperators()
              .filter((operator) => operator.value !== 'isAnyOf')
              .map((operator) => ({
                ...operator,
                InputComponent: operator.InputComponent
                  ? RatingInputValue
                  : undefined,
              })),
          };
        }
        return colDef;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} columns={columns} unstable_headerFilters />
    </div>
  );
}
