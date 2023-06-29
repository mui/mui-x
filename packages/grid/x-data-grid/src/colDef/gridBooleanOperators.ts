import { GridFilterInputBoolean } from '../components/panel/filterPanel/GridFilterInputBoolean';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { convertLegacyOperators } from './utils';

export const getGridBooleanOperators = () =>
  convertLegacyOperators([
    {
      value: 'is',
      getApplyFilterFnV7: (filterItem: GridFilterItem) => {
        if (!filterItem.value) {
          return null;
        }

        const valueAsBoolean = filterItem.value === 'true';
        return (value): boolean => {
          return Boolean(value) === valueAsBoolean;
        };
      },
      InputComponent: GridFilterInputBoolean,
    },
  ] as const satisfies ReadonlyArray<Omit<GridFilterOperator<any, boolean | null, any>, 'getApplyFilterFn'>>);
