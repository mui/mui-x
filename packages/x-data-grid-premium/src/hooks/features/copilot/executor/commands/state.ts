import type { GridRowSelectionModel } from '@mui/x-data-grid-pro';
import type { CommandHandler } from '../types';
import { ok, invalid } from '../types';

interface RestoreParams {
  state: unknown;
}

interface ExportParams {
  params?: { exportOnlyDirtyModels?: boolean };
}

export const stateRestore: CommandHandler<RestoreParams> = {
  type: 'state.restore',
  namespace: 'state',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'history',
  validate: (params) => {
    if (!params || params.state == null || typeof params.state !== 'object') {
      return invalid('state.restore.params.state must be an object');
    }
    return ok();
  },
  run: ({ state }, ctx) => {
    ctx.apiRef.current.restoreState(state as any);
  },
};

export const stateExport: CommandHandler<ExportParams> = {
  type: 'state.export',
  namespace: 'state',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'history',
  dependsOn: (_, ctx) => Array.from(ctx.appliedSlices),
  run: (params, ctx) => {
    const exportParams = params?.params;
    return ctx.apiRef.current.exportState(exportParams);
  },
};

export const stateReset: CommandHandler<void> = {
  type: 'state.reset',
  namespace: 'state',
  tier: 2,
  plan: 'premium',
  guard: null,
  phase: 'history',
  run: (_, ctx) => {
    const api = ctx.apiRef.current;
    api.setSortModel([]);
    api.setFilterModel({ items: [], quickFilterValues: [], logicOperator: 'and' as any });
    api.setRowGroupingModel([]);
    api.setAggregationModel({});
    api.setPivotActive(false);
    api.setPivotModel({ rows: [], columns: [], values: [] });
    api.setColumnVisibilityModel({});
    api.setPinnedColumns({ left: [], right: [] });
    const emptySelection: GridRowSelectionModel = { type: 'include', ids: new Set() };
    api.setRowSelectionModel(emptySelection);
  },
};

export const stateCommands: CommandHandler[] = [stateRestore, stateExport, stateReset];
