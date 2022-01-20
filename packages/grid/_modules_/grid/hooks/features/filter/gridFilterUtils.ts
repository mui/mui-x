import {
  GridApiRef,
  GridFilterItem,
  GridFilterModel,
  GridLinkOperator,
  GridRowId,
} from '../../../models';
import { GridAggregatedFilterItemApplier } from './gridFilterState';

type GridFilterItemApplier = {
  fn: (rowId: GridRowId) => boolean;
  item: GridFilterItem;
};

/**
 * Adds default values to the optional fields of a filter items.
 * @param {GridFilterItem} item The raw filter item.
 * @param {GridApiRef} apiRef The API of the grid.
 * @return {GridFilterItem} The clean filter item with an uniq ID and an always-defined operatorValue.
 * TODO: Make the typing reflect the different between GridFilterInputItem and GridFilterItem.
 */
export const cleanFilterItem = (item: GridFilterItem, apiRef: GridApiRef) => {
  const cleanItem: GridFilterItem = { ...item };

  if (cleanItem.id == null) {
    cleanItem.id = Math.round(Math.random() * 1e5);
  }

  if (cleanItem.operatorValue == null) {
    // we select a default operator
    const column = apiRef.current.getColumn(cleanItem.columnField);
    cleanItem.operatorValue = column && column!.filterOperators![0].value!;
  }

  return cleanItem;
};

/**
 * Generates a method to easily check if a row is matching the current filter model.
 * @param {GridFilterModel} filterModel The model with which we want to filter the rows.
 * @param {GridApiRef} apiRef The API of the grid.
 * @returns {GridAggregatedFilterItemApplier | null} A method that checks if a row is matching the current filter model. If `null`, we consider that all the rows are matching the filters.
 */
export const buildAggregatedFilterApplier = (
  filterModel: GridFilterModel,
  apiRef: GridApiRef,
): GridAggregatedFilterItemApplier | null => {
  const { items, linkOperator = GridLinkOperator.And } = filterModel;

  const getFilterCallbackFromItem = (filterItem: GridFilterItem): GridFilterItemApplier | null => {
    if (!filterItem.columnField || !filterItem.operatorValue) {
      return null;
    }

    const column = apiRef.current.getColumn(filterItem.columnField);
    if (!column) {
      return null;
    }
    let parsedValue;

    if (column.valueParser) {
      const parser = column.valueParser;
      parsedValue = Array.isArray(filterItem.value)
        ? filterItem.value?.map((x) => parser(x))
        : parser(filterItem.value);
    } else {
      parsedValue = filterItem.value;
    }
    const newFilterItem: GridFilterItem = { ...filterItem, value: parsedValue };

    const filterOperators = column.filterOperators;
    if (!filterOperators?.length) {
      throw new Error(`MUI: No filter operators found for column '${column.field}'.`);
    }

    const filterOperator = filterOperators.find(
      (operator) => operator.value === newFilterItem.operatorValue,
    )!;
    if (!filterOperator) {
      throw new Error(
        `MUI: No filter operator found for column '${column.field}' and operator value '${newFilterItem.operatorValue}'.`,
      );
    }

    const applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column)!;
    if (typeof applyFilterOnRow !== 'function') {
      return null;
    }

    const fn = (rowId: GridRowId) => {
      const cellParams = apiRef.current.getCellParams(rowId, newFilterItem.columnField!);

      return applyFilterOnRow(cellParams);
    };

    return { fn, item: newFilterItem };
  };

  const appliers = items
    .map(getFilterCallbackFromItem)
    .filter((callback): callback is GridFilterItemApplier => !!callback);

  if (appliers.length === 0) {
    return null;
  }

  return (rowId, shouldApplyFilter) => {
    const filteredAppliers = shouldApplyFilter
      ? appliers.filter((applier) => shouldApplyFilter(applier.item))
      : appliers;

    // Return `false` as soon as we have a failing filter
    if (linkOperator === GridLinkOperator.And) {
      return filteredAppliers.every((applier) => applier.fn(rowId));
    }

    // Return `true` as soon as we have a passing filter
    return filteredAppliers.some((applier) => applier.fn(rowId));
  };
};
