import { StringFilterInputValue } from '../../components/tools/StringFilterInputValue';
import { FilterItem } from '../filterItem';
import { FilterOperator } from '../filterOperator';
import { ColDef } from './colDef';

export const STRING_OPERATORS: FilterOperator[] = [
  {
    label: 'Contains',
    value: 'contains',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(filterItem.value, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: StringFilterInputValue,
  },
  {
    label: 'Equals',
    value: 'equals',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return (
          filterItem.value?.localeCompare(rowValue?.toString() || '', undefined, {
            sensitivity: 'base',
          }) === 0
        );
      };
    },
    InputComponent: StringFilterInputValue,
  },
  {
    label: 'Starts With',
    value: 'start',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(`^${filterItem.value}.*$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: StringFilterInputValue,
  },
  {
    label: 'Ends With',
    value: 'end',
    getApplyFilterFn: (filterItem: FilterItem, column: ColDef) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
        return null;
      }

      const filterRegex = new RegExp(`.*${filterItem.value}$`, 'i');
      return (params): boolean => {
        const rowValue = column.valueGetter ? column.valueGetter(params) : params.value;
        return filterRegex.test(rowValue?.toString() || '');
      };
    },
    InputComponent: StringFilterInputValue,
  },
];
