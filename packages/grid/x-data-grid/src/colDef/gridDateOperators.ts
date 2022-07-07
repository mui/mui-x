import { GridFilterInputDate } from '../components/panel/filterPanel/GridFilterInputDate';
import { GridFilterItem } from '../models/gridFilterItem';
import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridCellParams } from '../models/params/gridCellParams';

export type DateType = 'date' | 'time' | 'dateTime';

const dateRegex = /(\d+)-(\d+)-(\d+)/;
const timeRegex = /(\d+):(\d+)/;
const dateTimeRegex = /(\d+)-(\d+)-(\d+)T(\d+):(\d+)/;

function buildApplyFilterFn(
  filterItem: GridFilterItem,
  compareFn: (value1: number, value2: number) => boolean,
  dateType: DateType,
  keepHours?: boolean,
) {
  if (!filterItem.value) {
    return null;
  }
  
  let regex = dateRegex;
  if (dateType === 'time') {
    regex = timeRegex;
  } else if (dateType === 'dateTime') {
    regex = dateTimeRegex;
  }

  const [year, month, day, hour, minute] = filterItem.value
    .match(regex)!
    .slice(1)
    .map(Number);

  const time = new Date(year, month - 1, day, hour || 0, minute || 0).getTime();

  return ({ value }: GridCellParams<string | number | Date, any, any>): boolean => {
    if (!value) {
      return false;
    }

    const valueAsDate = value instanceof Date ? value : new Date(value.toString());
    if (keepHours) {
      return compareFn(valueAsDate.getTime(), time);
    }

    // Make a copy of the date to not reset the hours in the original object
    const dateCopy = value instanceof Date ? new Date(valueAsDate) : valueAsDate;
    const timeToCompare = dateCopy.setHours(
      (dateType === 'time' || dateType === 'dateTime') ? valueAsDate.getHours() : 0,
      (dateType === 'time' || dateType === 'dateTime') ? valueAsDate.getMinutes() : 0,
      0,
      0,
    );
    return compareFn(timeToCompare, time);
  };
}

export const getGridDateOperators = (
  type: DateType,
): GridFilterOperator<any, string | Date, any>[] => {
  let inputType = 'date';
  if (type === 'time') {
    inputType = 'time';
  } else if (type === 'dateTime') {
    inputType = 'datetime-local';
  }

  return [
    {
      value: 'is',
      getApplyFilterFn: (filterItem) => {
        return buildApplyFilterFn(filterItem, (value1, value2) => value1 === value2, type);
      },
      InputComponent: GridFilterInputDate,
      InputComponentProps: { type: inputType },
    },
    {
      value: 'not',
      getApplyFilterFn: (filterItem) => {
        return buildApplyFilterFn(filterItem, (value1, value2) => value1 !== value2, type);
      },
      InputComponent: GridFilterInputDate,
      InputComponentProps: { type: inputType },
    },
    {
      value: 'after',
      getApplyFilterFn: (filterItem) => {
        return buildApplyFilterFn(filterItem, (value1, value2) => value1 > value2, type);
      },
      InputComponent: GridFilterInputDate,
      InputComponentProps: { type: inputType },
    },
    {
      value: 'onOrAfter',
      getApplyFilterFn: (filterItem) => {
        return buildApplyFilterFn(filterItem, (value1, value2) => value1 >= value2, type);
      },
      InputComponent: GridFilterInputDate,
      InputComponentProps: { type: inputType },
    },
    {
      value: 'before',
      getApplyFilterFn: (filterItem) => {
        return buildApplyFilterFn(
          filterItem,
          (value1, value2) => value1 < value2,
          type,
          type === 'date',
        );
      },
      InputComponent: GridFilterInputDate,
      InputComponentProps: { type: inputType },
    },
    {
      value: 'onOrBefore',
      getApplyFilterFn: (filterItem) => {
        return buildApplyFilterFn(filterItem, (value1, value2) => value1 <= value2, type);
      },
      InputComponent: GridFilterInputDate,
      InputComponentProps: { type: inputType },
    },
    {
      value: 'isEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value == null;
        };
      },
      requiresFilterValue: false,
    },
    {
      value: 'isNotEmpty',
      getApplyFilterFn: () => {
        return ({ value }): boolean => {
          return value != null;
        };
      },
      requiresFilterValue: false,
    },
  ];
};
