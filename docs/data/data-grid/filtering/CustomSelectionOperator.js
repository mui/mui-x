import * as React from 'react';
import {
  DataGrid,
  getGridDefaultColumnTypes,
  DEFAULT_GRID_COL_TYPE_KEY,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const defaultColumnTypes = getGridDefaultColumnTypes();

export default function CustomSelectionOperator() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [models, setModels] = React.useState(() => ({
    filterModel: {
      items: [
        {
          field: 'col1',
          operator: 'contains',
          value: 'lo',
        },
      ],
    },
    rowSelectionModel: [5],
  }));

  const rowSelectionModelLookup = React.useMemo(
    () =>
      models.rowSelectionModel.reduce((lookup, rowId) => {
        lookup[rowId] = rowId;
        return lookup;
      }, {}),
    [models.rowSelectionModel],
  );

  const rowSelectionModelLookupRef = React.useRef(rowSelectionModelLookup);
  rowSelectionModelLookupRef.current = rowSelectionModelLookup;

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
          if (rowSelectionModelLookupRef.current[rowId]) {
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

  const handleRowSelectionModelChange = React.useCallback(
    (newRowSelectionModel) =>
      setModels((prev) => ({
        ...prev,
        rowSelectionModel: newRowSelectionModel,
        // Forces the re-application of the filtering process
        filterModel: { ...prev.filterModel },
      })),
    [],
  );

  const handleFilterModelChange = React.useCallback(
    (newFilterModel) =>
      setModels((prev) => ({ ...prev, filterModel: newFilterModel })),
    [],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        columns={columns}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        onFilterModelChange={handleFilterModelChange}
      />
    </div>
  );
}
