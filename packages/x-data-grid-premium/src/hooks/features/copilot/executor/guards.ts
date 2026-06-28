import type { DataGridPremiumProcessedProps } from '../../../../models/dataGridPremiumProps';
import type { Guards } from './types';

export function buildGuards(props: DataGridPremiumProcessedProps): Guards {
  return {
    filter: !props.disableColumnFilter,
    sort: !props.disableColumnSorting,
    grouping: !props.disableRowGrouping,
    aggregation: !props.disableAggregation,
    pivoting: !props.disablePivoting,
    rowSelection: !!props.rowSelection,
    chartsIntegration: !!props.chartsIntegration,
    mutations: !!(props as DataGridPremiumProcessedProps & { enableMutatingActions?: boolean })
      .enableMutatingActions,
  };
}
