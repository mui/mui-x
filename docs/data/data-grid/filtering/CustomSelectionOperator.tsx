import * as React from 'react';
import {
  DataGrid,
  GridSelectionModel,
  GridFilterModel,
  GridFilterItem,
  GridRowId,
  GridFilterOperator,
  GridStateColDef,
  GridCellParams,
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

  const [models, setModels] = React.useState<{
    selectionModel: GridSelectionModel;
    filterModel: GridFilterModel;
  }>(() => ({
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
      }, {} as Record<GridRowId, GridRowId>),
    [models.selectionModel],
  );

  const selectionModelLookupRef =
    React.useRef<Record<GridRowId, GridRowId>>(selectionModelLookup);
  selectionModelLookupRef.current = selectionModelLookup;

  const columns = React.useMemo(() => {
    /**
     * Function that takes an operator and wrap it to skip filtering for selected rows.
     */
    const wrapOperator = (operator: GridFilterOperator) => {
      const getApplyFilterFn = (
        filterItem: GridFilterItem,
        column: GridStateColDef,
      ) => {
        const innerFilterFn = operator.getApplyFilterFn(filterItem, column);
        if (!innerFilterFn) {
          return innerFilterFn;
        }

        return (params: GridCellParams) => {
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
        defaultColumnTypes[col.type ?? DEFAULT_GRID_COL_TYPE_KEY].filterOperators!;

      return {
        ...col,
        filterOperators: filterOperators.map((operator) => wrapOperator(operator)),
      };
    });
  }, [data.columns]);

  const handleSelectionModelChange = React.useCallback(
    (newSelectionModel: GridSelectionModel) =>
      setModels((prev) => ({
        ...prev,
        selectionModel: newSelectionModel,
        // Forces the re-application of the filtering process
        filterModel: { ...prev.filterModel },
      })),
    [],
  );

  const handleFilterModelChange = React.useCallback(
    (newFilterModel: GridFilterModel) =>
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
