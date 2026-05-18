'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import {
  getDataGridUtilityClass,
  gridColumnLookupSelector,
  gridFilterModelSelector,
  gridSortModelSelector,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridRowGroupingModelSelector } from '../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { gridAggregationModelSelector } from '../../hooks/features/aggregation/gridAggregationSelectors';
import {
  gridPivotActiveSelector,
  gridPivotModelSelector,
} from '../../hooks/features/pivoting/gridPivotingSelectors';
import { gridChartsIntegrationChartsLookupSelector } from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import type { GridCopilotExecutionResult } from '../../hooks/features/copilot/executor';
import {
  buildAggregationChanges,
  buildChartChange,
  buildFilterChanges,
  buildGroupingChanges,
  buildPivotingChanges,
  buildSortingChanges,
  type Change,
} from '../prompt/changeBuilders';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['copilotAppliedChanges'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const CopilotAppliedChangesRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotAppliedChanges',
})({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.spacing(0.5),
  width: '100%',
  marginTop: vars.spacing(0.5),
});

function hasPath(result: GridCopilotExecutionResult, prefix: string): boolean {
  return result.applied.some(
    (entry) =>
      entry.kind === 'patch' && (entry.path === prefix || entry.path.startsWith(`${prefix}/`)),
  );
}

function CopilotAppliedChanges({ messageId }: { messageId: string }) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  const subscribe = React.useCallback(
    (listener: () => void) => apiRef.current.copilot.subscribeResults(listener),
    [apiRef],
  );
  const getSnapshot = React.useCallback(
    () => apiRef.current.copilot.getResultsForMessage(messageId),
    [apiRef, messageId],
  );
  const result = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const groupingModel = useGridSelector(apiRef, gridRowGroupingModelSelector);
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const pivotModel = useGridSelector(apiRef, gridPivotModelSelector);
  const chartsLookup = useGridSelector(apiRef, gridChartsIntegrationChartsLookupSelector);

  const changes = React.useMemo<Change[]>(() => {
    if (!result) {
      return [];
    }
    const helpers = { apiRef, slots: rootProps.slots, columns };
    const out: Change[] = [];

    if (hasPath(result, '/grouping') && groupingModel.length > 0) {
      out.push(
        ...buildGroupingChanges(
          groupingModel.map((field) => ({ column: field })),
          helpers,
        ),
      );
    }

    if (hasPath(result, '/aggregation') && Object.keys(aggregationModel).length > 0) {
      out.push(...buildAggregationChanges(aggregationModel as Record<string, string>, helpers));
    }

    if (hasPath(result, '/filter') && filterModel.items.length > 0) {
      out.push(
        ...buildFilterChanges(
          filterModel.items.map((item) => ({
            column: item.field,
            operator: item.operator ?? 'is',
            value: item.value,
          })),
          helpers,
        ),
      );
    }

    if (hasPath(result, '/sort') && sortModel.length > 0) {
      out.push(
        ...buildSortingChanges(
          sortModel.map((entry) => ({
            column: entry.field,
            direction: entry.sort === 'desc' ? 'desc' : 'asc',
          })),
          helpers,
        ),
      );
    }

    if (hasPath(result, '/pivot') && pivotActive && pivotModel) {
      const pivoting = {
        columns: (pivotModel.columns ?? []).map((c: any) => ({
          column: c.field,
          direction: c.sort,
        })),
        rows: (pivotModel.rows ?? []).map((r: any) => r.field),
        values: (pivotModel.values ?? []).map((v: any) => ({
          [v.field]: v.aggFunc ?? 'sum',
        })),
      };
      out.push(...buildPivotingChanges(pivoting, helpers));
    }

    if (chartsLookup) {
      Object.entries(chartsLookup).forEach(([id, slice]) => {
        if (hasPath(result, `/charts/${id}`)) {
          const dims = (slice as any)?.dimensions ?? [];
          const vals = (slice as any)?.values ?? [];
          if (dims.length > 0 || vals.length > 0) {
            out.push(buildChartChange({ dimensions: dims, values: vals }, helpers));
          }
        }
      });
    }

    return out;
  }, [
    result,
    apiRef,
    rootProps.slots,
    columns,
    sortModel,
    filterModel,
    groupingModel,
    aggregationModel,
    pivotActive,
    pivotModel,
    chartsLookup,
  ]);

  if (changes.length === 0) {
    return null;
  }

  return (
    <CopilotAppliedChangesRoot className={classes.root}>
      {changes.map((c, index) => (
        <rootProps.slots.baseTooltip key={`${c.label}-${index}`} title={c.description}>
          <rootProps.slots.baseChip label={c.label} icon={<c.icon />} size="small" />
        </rootProps.slots.baseTooltip>
      ))}
    </CopilotAppliedChangesRoot>
  );
}

export { CopilotAppliedChanges };
