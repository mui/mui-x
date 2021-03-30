import { GridFilterInputBoolean } from '../../components/panel/filterPanel/GridFilterInputBoolean';
import { GridFilterItem } from '../gridFilterItem';
import { GridFilterOperator } from '../gridFilterOperator';
import { GridColDef } from './gridColDef';

export const getGridBooleanOperators: () => GridFilterOperator[] = () => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const valueAsBoolean = filterItem.value === 'true';
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return Boolean(rowValue) === valueAsBoolean;
      };
    },
    InputComponent: GridFilterInputBoolean,
  },
];
