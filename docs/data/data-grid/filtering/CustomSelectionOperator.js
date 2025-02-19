import * as React from 'react';
import {
  DataGrid,
  getGridDefaultColumnTypes,
  DEFAULT_GRID_COL_TYPE_KEY,
  gridRowSelectionStateSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const defaultColumnTypes = getGridDefaultColumnTypes();

export default function CustomSelectionOperator() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(() => {
    /**
     * Function that takes an operator and wrap it to skip filtering for selected rows.
     */
    const wrapOperator = (operator) => {
      const getApplyFilterFn = (filterItem, column) => {
        const innerFilterFn = operator.getApplyFilterFn(filterItem, column);
        if (!innerFilterFn) {
          return innerFilterFn;
        }

        return (value, row, col, apiRef) => {
          const rowId = apiRef.current.getRowId(row);
          const rowSelectionModel = gridRowSelectionStateSelector(apiRef);
          if (rowSelectionModel.ids.has(rowId)) {
            return true;
          }

          return innerFilterFn(value, row, col, apiRef);
        };
      };

      return {
        ...operator,
        getApplyFilterFn,
      };
    };

    return data.columns.map((col) => {
      const filterOperators =
        col.filterOperators ??
        defaultColumnTypes[col.type ?? DEFAULT_GRID_COL_TYPE_KEY].filterOperators;

      return {
        ...col,
        filterOperators: filterOperators.map((operator) => wrapOperator(operator)),
      };
    });
  }, [data.columns]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} columns={columns} />
    </div>
  );
}
