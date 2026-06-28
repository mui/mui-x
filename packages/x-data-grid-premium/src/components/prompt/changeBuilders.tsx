import type * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridSingleSelectColDef } from '@mui/x-data-grid-pro';
import { getValueOptions, isSingleSelectColDef } from '@mui/x-data-grid-pro/internals';
import capitalize from '@mui/utils/capitalize';
import type { GridApiPremium } from '../../models/gridApiPremium';
import type { GridPremiumSlotsComponent } from '../../models';

export interface Change {
  label: string;
  description?: string;
  icon: React.ElementType;
}

export interface ChangeBuilderHelpers {
  apiRef: RefObject<GridApiPremium>;
  slots: GridPremiumSlotsComponent;
  columns: Record<string, any>;
}

function getColumnName(columns: Record<string, any>, field: string): string {
  return columns[field]?.headerName ?? field;
}

export function buildGroupingChanges(
  grouping: Array<{ column: string }>,
  { apiRef, slots, columns }: ChangeBuilderHelpers,
): Change[] {
  return grouping.map((group) => ({
    label: getColumnName(columns, group.column),
    description: apiRef.current!.getLocaleText('promptChangeGroupDescription')(
      getColumnName(columns, group.column),
    ),
    icon: slots.promptGroupIcon,
  }));
}

export function buildAggregationChanges(
  aggregation: Record<string, string>,
  { apiRef, slots, columns }: ChangeBuilderHelpers,
): Change[] {
  return Object.keys(aggregation).map((column) => ({
    label: apiRef.current!.getLocaleText('promptChangeAggregationLabel')(
      getColumnName(columns, column),
      aggregation[column] as any,
    ),
    description: apiRef.current!.getLocaleText('promptChangeAggregationDescription')(
      getColumnName(columns, column),
      aggregation[column] as any,
    ),
    icon: slots.promptAggregationIcon,
  }));
}

export function buildFilterChanges(
  filters: Array<{ column: string; operator: string; value: any }>,
  { apiRef, slots, columns }: ChangeBuilderHelpers,
): Change[] {
  return filters.map((filter) => {
    const filterOperator = apiRef.current!.getLocaleText(
      `filterOperator${capitalize(filter.operator)}` as 'filterOperatorContains',
    );
    let filterValue = filter.value;

    if (isSingleSelectColDef(columns[filter.column])) {
      const allOptions = getValueOptions(columns[filter.column] as GridSingleSelectColDef) ?? [];
      const colDef = columns[filter.column] as GridSingleSelectColDef;
      const getOptionLabel =
        colDef.getOptionLabel ??
        ((option) => (typeof option === 'object' ? option.label : String(option)));
      const getOptionValue =
        colDef.getOptionValue ?? ((option) => (typeof option === 'object' ? option.value : option));

      if (Array.isArray(filterValue)) {
        filterValue = filterValue
          .map((filterVal) => {
            const option = allOptions.find(
              (opt) => String(getOptionValue(opt)) === String(filterVal),
            );
            return option ? getOptionLabel(option) : String(filterVal);
          })
          .join(', ');
      } else {
        const option = allOptions.find(
          (opt) => String(getOptionValue(opt)) === String(filterValue),
        );
        filterValue = option ? getOptionLabel(option) : String(filterValue);
      }
    }

    return {
      label: apiRef.current!.getLocaleText('promptChangeFilterLabel')(
        getColumnName(columns, filter.column),
        filterOperator,
        filterValue as string,
      ),
      description: apiRef.current!.getLocaleText('promptChangeFilterDescription')(
        getColumnName(columns, filter.column),
        filterOperator,
        filterValue as string,
      ),
      icon: slots.promptFilterIcon,
    };
  });
}

export function buildSortingChanges(
  sorting: Array<{ column: string; direction: 'asc' | 'desc' }>,
  { apiRef, slots, columns }: ChangeBuilderHelpers,
): Change[] {
  return sorting.map((sort) => ({
    label: getColumnName(columns, sort.column),
    description: apiRef.current!.getLocaleText('promptChangeSortDescription')(
      getColumnName(columns, sort.column),
      sort.direction,
    ),
    icon: sort.direction === 'asc' ? slots.promptSortAscIcon : slots.promptSortDescIcon,
  }));
}

interface PivotingShape {
  columns: Array<{ column: string; direction?: 'asc' | 'desc' }>;
  rows: string[];
  values: Array<Record<string, string>>;
}

export function buildPivotingChanges(
  pivoting: PivotingShape | {},
  { apiRef, slots, columns }: ChangeBuilderHelpers,
): Change[] {
  if (!('columns' in pivoting)) {
    return [];
  }
  const changes: Change[] = [
    {
      label: apiRef.current!.getLocaleText('promptChangePivotEnableLabel'),
      icon: slots.promptPivotIcon,
      description: apiRef.current!.getLocaleText('promptChangePivotEnableDescription'),
    },
  ];

  if (pivoting.columns.length) {
    changes.push({
      label: apiRef.current!.getLocaleText('promptChangePivotColumnsLabel')(
        pivoting.columns.length,
      ),
      icon: slots.columnMenuManageColumnsIcon,
      description: pivoting.columns
        .map((column) =>
          apiRef.current!.getLocaleText('promptChangePivotColumnsDescription')(
            getColumnName(columns, column.column),
            column.direction as any,
          ),
        )
        .join(', '),
    });
  }

  if (pivoting.rows.length) {
    changes.push({
      label: apiRef.current!.getLocaleText('promptChangePivotRowsLabel')(pivoting.rows.length),
      icon: slots.densityStandardIcon,
      description: pivoting.rows.map((column) => getColumnName(columns, column)).join(', '),
    });
  }

  if (pivoting.values.length) {
    changes.push({
      label: apiRef.current!.getLocaleText('promptChangePivotValuesLabel')(pivoting.values.length),
      icon: slots.promptAggregationIcon,
      description: pivoting.values
        .map((aggregation) =>
          Object.keys(aggregation).map((column) =>
            apiRef.current!.getLocaleText('promptChangePivotValuesDescription')(
              getColumnName(columns, column),
              aggregation[column] as any,
            ),
          ),
        )
        .join(', '),
    });
  }

  return changes;
}

export function buildChartChange(
  chart: { dimensions: any[]; values: any[] },
  { apiRef, slots }: ChangeBuilderHelpers,
): Change {
  return {
    label: apiRef.current!.getLocaleText('toolbarCharts'),
    description: apiRef.current!.getLocaleText('promptChangeChartsLabel')(
      chart.dimensions.length,
      chart.values.length,
    ),
    icon: slots.promptChartsIcon,
  };
}
