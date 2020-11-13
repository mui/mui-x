import { FilterItem } from '../../hooks/features/filter/visibleRowsState';
import { stringNumberComparer } from '../../utils/sortingUtils';
import { RowData, RowModel } from '../rows';
import { ColTypeDef } from './colDef';

export interface FilterOperator {
  label: string;
  value: string | number;
  getApplyFilterFn: (filterItem: FilterItem) => (null | ((row: RowModel) => boolean));
}

export const STRING_OPERATORS: FilterOperator [] = [
  {
    label: 'Contains',
    value: 'contains',
    getApplyFilterFn: (filterItem: FilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operator) {
        return null;
      }

      const filterRegex = new RegExp(filterItem.value, 'i');
      return (row): boolean => {
        return filterRegex.test(row.data[filterItem.columnField!])
      }
    }
  }, {
    label: 'Starts With',
    value: 'start',
    getApplyFilterFn: (filterItem: FilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operator) {
        return null;
      }

      const filterRegex = new RegExp(`^${filterItem.value}.*$`, 'i');
      return (row): boolean => {
        return filterRegex.test(row.data[filterItem.columnField!])
      }
    }
  },
  {
    label: 'Ends With',
    value: 'end',
    getApplyFilterFn: (filterItem: FilterItem) => {
      if (!filterItem.columnField || !filterItem.value || !filterItem.operator) {
        return null;
      }

      const filterRegex = new RegExp(`.*${filterItem.value}$`, 'i');
      return (row): boolean => {
        return filterRegex.test(row.data[filterItem.columnField!])
      }
    }
  }
];
export const STRING_COL_DEF: ColTypeDef = {
  width: 100,
  hide: false,
  sortable: true,
  resizable: true,
  filterable: true,
  sortDirection: null,
  sortComparator: stringNumberComparer,
  type: 'string',
  align: 'left',
  filterOperators: STRING_OPERATORS
};
