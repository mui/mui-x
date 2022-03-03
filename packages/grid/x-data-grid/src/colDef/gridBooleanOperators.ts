import { GridFilterInputBoolean } from '../components/panel/filterPanel/GridFilterInputBoolean';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridApiCommon } from '../models/api/gridApiCommon';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

export const getGridBooleanOperators = <
  Api extends GridApiCommon = GridApiCommunity,
>(): GridFilterOperator<any, boolean | null, any, Api>[] => [
  {
    value: 'is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null;
      }

      const valueAsBoolean = filterItem.value === 'true';
      return ({ value }): boolean => {
        return Boolean(value) === valueAsBoolean;
      };
    },
    InputComponent: GridFilterInputBoolean,
  },
];
