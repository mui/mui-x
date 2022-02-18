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
          columnField: 'col1',
          operatorValue: 'contains',
          value: 'lo',
        },
      ],
    },
    selectionModel: [5],
  }));

  const selectionModelLookup = React.useMemo(
    () =>
      models.selectionModel.reduce((lookup, rowId) => {
        lookup[rowId] = rowId;
        return lookup;
      }, {}),
    [models.selectionModel],
  );

  const selectionModelLookupRef = React.useRef(selectionModelLookup);
  selectionModelLookupRef.current = selectionModelLookup;

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

        return (params) => {
          if (selectionModelLookupRef.current[params.id]) {
            return true;
          }

          return innerFilterFn(params);
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

  const handleSelectionModelChange = React.useCallback(
    (newSelectionModel) =>
      setModels((prev) => ({
        ...prev,
        selectionModel: newSelectionModel,
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
        onSelectionModelChange={handleSelectionModelChange}
        onFilterModelChange={handleFilterModelChange}
      />
    </div>
  );
}
