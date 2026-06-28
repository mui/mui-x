import {
  type CommandHandler,
  type ExecutorContext,
  invalid,
  ok,
} from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

type Handler<P> = CommandHandler<StudioHostAdapter, StudioStateDocument, P>;
type Ctx = ExecutorContext<StudioHostAdapter, StudioStateDocument>;

interface SelectDatasetParams {
  dataSourceId: string;
}

interface InvalidateDatasetParams {
  dataSourceId: string;
}

function findDataSource(ctx: Ctx, dataSourceId: string) {
  return ctx.adapter.api.dataSources.find((d) => d.id === dataSourceId);
}

export const studioSelectDataset: Handler<SelectDatasetParams> = {
  type: 'studio.selectDataSource',
  namespace: 'studio',
  tier: 2,
  plan: 'community',
  guard: 'dataSourceSwitching',
  phase: 'layout',
  validate: (params, ctx) => {
    if (!params || typeof params.dataSourceId !== 'string') {
      return invalid('studio.selectDataSource requires { dataSourceId }');
    }
    if (!findDataSource(ctx, params.dataSourceId)) {
      return invalid(`studio.selectDataSource: unknown dataSourceId '${params.dataSourceId}'`);
    }
    return ok();
  },
  run: ({ dataSourceId }, ctx) => {
    ctx.adapter.api.stateApi.selectDataSource(dataSourceId);
  },
};

export const studioInvalidateDataset: Handler<InvalidateDatasetParams> = {
  type: 'studio.invalidateDataSource',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'dataSourceSwitching',
  phase: 'history',
  validate: (params, ctx) => {
    if (!params || typeof params.dataSourceId !== 'string') {
      return invalid('studio.invalidateDataSource requires { dataSourceId }');
    }
    if (!findDataSource(ctx, params.dataSourceId)) {
      return invalid(`studio.invalidateDataSource: unknown dataSourceId '${params.dataSourceId}'`);
    }
    return ok();
  },
  run: ({ dataSourceId }, ctx) => {
    ctx.adapter.api.stateApi.invalidateDataSource(dataSourceId);
  },
};

export const studioInvalidateAll: Handler<void> = {
  type: 'studio.invalidateAll',
  namespace: 'studio',
  tier: 3,
  plan: 'community',
  guard: 'dataSourceSwitching',
  phase: 'history',
  run: (_params, ctx) => {
    ctx.adapter.api.stateApi.invalidateAll();
  },
};

export const studioDataSourceCommands: Array<CommandHandler<StudioHostAdapter, StudioStateDocument>> = [
  studioSelectDataset,
  studioInvalidateDataset,
  studioInvalidateAll,
];
